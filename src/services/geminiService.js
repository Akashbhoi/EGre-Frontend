const API_KEYS = (import.meta.env.VITE_GEMINI_API_KEYS || '')
  .split(',')
  .map((key) => key.trim())
  .filter((key) => key);

let currentApiKeyIndex = 0;

// System prompt for GRE study assistant
const SYSTEM_PROMPT = `You are a helpful GRE study assistant. Your role is to:
- Help students understand GRE questions and concepts
- Explain difficult topics in simple terms
- Provide study tips and strategies
- Answer questions about verbal reasoning, quantitative reasoning, and analytical writing
- Encourage and motivate students

**IMPORTANT RULE:** Do NOT provide the direct answer or a complete solution to the user's question unless they explicitly ask for it using a phrase like "give me the complete solution". Instead, guide them with hints, explanations of concepts, or by breaking down the problem. Your primary goal is to help them learn how to solve the problem themselves.

Keep your responses concise, clear, and educational. Be friendly and supportive.`;

// Use REST API directly to avoid v1beta issues
const callGeminiAPI = async (prompt, apiKey) => {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
};

const callGeminiWithRotation = async (prompt) => {
  if (API_KEYS.length === 0) {
    throw new Error('API keys not configured');
  }

  for (let i = 0; i < API_KEYS.length; i++) {
    const apiKey = API_KEYS[currentApiKeyIndex];
    try {
      const result = await callGeminiAPI(prompt, apiKey);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      const isKeyError = message.includes('API key') || message.includes('API_KEY_INVALID') || message.includes('429');

      if (isKeyError) {
        console.warn(`API key ${currentApiKeyIndex + 1} failed. Trying next key.`);
        currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
      } else {
        throw error; // Re-throw non-key related errors
      }
    }
  }

  throw new Error('All API keys failed.');
};

// Send a message to Gemini and get a response
export const sendMessageToGemini = async (userMessage, questionContext) => {
  if (API_KEYS.length === 0) {
    return "I'm having trouble connecting right now. Please make sure the API key is configured correctly.";
  }

  try {
    const prompt = `${SYSTEM_PROMPT}\n\nHere is the question for context:\n${questionContext}\n\nUser: ${userMessage}\n\nAssistant:`;
    console.log('Sending request to Gemini...');

    const text = await callGeminiWithRotation(prompt);
    console.log('Received response from Gemini');

    return text || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';

    console.error('Error details:', {
      message,
    });

    if (message.includes('API key') || message.includes('API_KEY_INVALID')) {
      return 'API key error. Please check your configuration in Google AI Studio.';
    }

    if (message.includes('All API keys failed')) {
      return "I'm having trouble responding right now. Please try again in a moment.";
    }

    return `Error: ${message}. Please check the console for details.`;
  }
};

// Get a contextual hint for a question
export const getQuestionHint = async (question, options) => {
  if (API_KEYS.length === 0) {
    return "Hints are temporarily unavailable.";
  }

  try {
    const prompt = `As a GRE tutor, provide a helpful hint (not the answer) for this question:

Question: ${question}

Options:
${options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}

Provide a brief hint that helps the student think through the problem without giving away the answer.`;

    const text = await callGeminiWithRotation(prompt);
    return text || "Try breaking down the problem step by step.";
  } catch (error) {
    console.error('Error getting hint:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message.includes('All API keys failed')) {
      return "Sorry, I couldn't get a hint for you right now. Please try again in a moment.";
    }

    return "Could not fetch a hint at this time. Please try again later.";
  }
};

export default { sendMessageToGemini, getQuestionHint };

