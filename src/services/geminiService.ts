const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// System prompt for GRE study assistant
const SYSTEM_PROMPT = `You are a helpful GRE study assistant. Your role is to:
- Help students understand GRE questions and concepts
- Explain difficult topics in simple terms
- Provide study tips and strategies
- Answer questions about verbal reasoning, quantitative reasoning, and analytical writing
- Encourage and motivate students
Keep your responses concise, clear, and educational. Be friendly and supportive.`;

// Use REST API directly to avoid v1beta issues
const callGeminiAPI = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error('API key not configured');
  }

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${API_KEY}`;

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

// Send a message to Gemini and get a response
export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  if (!API_KEY) {
    return "I'm having trouble connecting right now. Please make sure the API key is configured correctly.";
  }

  try {
    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\n\nAssistant:`;
    console.log('Sending request to Gemini...');

    const text = await callGeminiAPI(prompt);
    console.log('Received response from Gemini');

    return text || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    console.error('Error details:', {
      message: error?.message
    });

    if (error?.message?.includes('API key') || error?.message?.includes('API_KEY_INVALID')) {
      return "API key error. Please check your configuration in Google AI Studio.";
    }

    return `Error: ${error?.message || 'Unknown error'}. Please check the console for details.`;
  }
};

// Get a contextual hint for a question
export const getQuestionHint = async (question: string, options: string[]): Promise<string> => {
  if (!API_KEY) {
    return "Hints are temporarily unavailable.";
  }

  try {
    const prompt = `As a GRE tutor, provide a helpful hint (not the answer) for this question:

Question: ${question}

Options:
${options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}

Provide a brief hint that helps the student think through the problem without giving away the answer.`;

    const text = await callGeminiAPI(prompt);
    return text || "Try breaking down the problem step by step.";
  } catch (error) {
    console.error('Error getting hint:', error);
    return "Try reading the question carefully and eliminating obviously wrong answers first.";
  }
};

export default { sendMessageToGemini, getQuestionHint };
