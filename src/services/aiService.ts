export type AIProvider = 'gemini' | 'openai' | 'groq';

// System prompt for GRE study assistant
const SYSTEM_PROMPT = `You are a helpful GRE study assistant. Your role is to:
- Help students understand GRE questions and concepts
- Explain difficult topics in simple terms
- Provide study tips and strategies
- Answer questions about verbal reasoning, quantitative reasoning, and analytical writing
- Encourage and motivate students

**IMPORTANT RULE:** Do NOT provide the direct answer or a complete solution to the user's question unless they explicitly ask for it using a phrase like "give me the complete solution". Instead, guide them with hints, explanations of concepts, or by breaking down the problem. Your primary goal is to help them learn how to solve the problem themselves.

Keep your responses concise, clear, and educational. Be friendly and supportive.`;

// Gemini Configuration
const GEMINI_API_KEYS = (import.meta.env.VITE_GEMINI_API_KEYS || '')
  .split(',')
  .map((key: string) => key.trim())
  .filter((key: string) => key);

let currentGeminiKeyIndex = 0;

// OpenAI Configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

// Groq Configuration
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

// Gemini API call
const callGeminiAPI = async (prompt: string, apiKey: string): Promise<string> => {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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

// Gemini with key rotation
const callGeminiWithRotation = async (prompt: string): Promise<string> => {
  if (GEMINI_API_KEYS.length === 0) {
    throw new Error('Gemini API keys not configured');
  }

  for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
    const apiKey = GEMINI_API_KEYS[currentGeminiKeyIndex];
    try {
      const result = await callGeminiAPI(prompt, apiKey);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      const isKeyError = message.includes('API key') || message.includes('API_KEY_INVALID') || message.includes('429');

      if (isKeyError) {
        console.warn(`Gemini API key ${currentGeminiKeyIndex + 1} failed. Trying next key.`);
        currentGeminiKeyIndex = (currentGeminiKeyIndex + 1) % GEMINI_API_KEYS.length;
      } else {
        throw error;
      }
    }
  }

  throw new Error('All Gemini API keys failed.');
};

// OpenAI API call
const callOpenAI = async (prompt: string): Promise<string> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const url = 'https://api.openai.com/v1/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API Error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response generated';
};

// Groq API call
const callGroq = async (prompt: string): Promise<string> => {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key not configured');
  }

  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Groq API Error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response generated';
};

// Unified message sending function
export const sendMessage = async (
  userMessage: string,
  questionContext: string,
  provider: AIProvider = 'gemini'
): Promise<string> => {
  try {
    const prompt = `Here is the question for context:\n${questionContext}\n\nUser: ${userMessage}\n\nAssistant:`;
    console.log(`Sending request to ${provider.toUpperCase()}...`);

    let text: string;
    
    if (provider === 'openai') {
      text = await callOpenAI(prompt);
    } else if (provider === 'groq') {
      text = await callGroq(prompt);
    } else {
      if (GEMINI_API_KEYS.length === 0) {
        return "I'm having trouble connecting right now. Please make sure the Gemini API keys are configured correctly.";
      }
      const fullPrompt = `${SYSTEM_PROMPT}\n\n${prompt}`;
      text = await callGeminiWithRotation(fullPrompt);
    }

    console.log(`Received response from ${provider.toUpperCase()}`);
    return text || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error(`Error calling ${provider.toUpperCase()} API:`, error);
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message.includes('API key') || message.includes('API_KEY_INVALID') || message.includes('not configured')) {
      const providerName = provider === 'openai' ? 'OpenAI' : provider === 'groq' ? 'Groq' : 'Gemini';
      return `${providerName} API key error. Please check your configuration.`;
    }
    
    if (message.includes('All') && message.includes('API keys failed')) {
      return "I'm having trouble responding right now. Please try again in a moment.";
    }

    return `Error: ${message}. Please try a different AI provider or check the console for details.`;
  }
};

// Get a contextual hint for a question
export const getQuestionHint = async (
  question: string,
  options: string[],
  provider: AIProvider = 'gemini'
): Promise<string> => {
  try {
    const prompt = `As a GRE tutor, provide a helpful hint (not the answer) for this question:

Question: ${question}

Options:
${options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}

Provide a brief hint that helps the student think through the problem without giving away the answer.`;

    console.log(`Getting hint from ${provider.toUpperCase()}...`);
    
    let text: string;
    
    if (provider === 'openai') {
      text = await callOpenAI(prompt);
    } else if (provider === 'groq') {
      text = await callGroq(prompt);
    } else {
      if (GEMINI_API_KEYS.length === 0) {
        return "Hints are temporarily unavailable.";
      }
      const fullPrompt = `${SYSTEM_PROMPT}\n\n${prompt}`;
      text = await callGeminiWithRotation(fullPrompt);
    }

    return text || "Try breaking down the problem step by step.";
  } catch (error) {
    console.error('Error getting hint:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message.includes('All') && message.includes('API keys failed')) {
      return "Sorry, I couldn't get a hint for you right now. Please try again in a moment.";
    }
    
    return "Could not fetch a hint at this time. Please try again later.";
  }
};

// Check which providers are available
export const getAvailableProviders = (): AIProvider[] => {
  const providers: AIProvider[] = [];
  
  // Groq first (fastest and free)
  if (GROQ_API_KEY) {
    providers.push('groq');
  }
  
  // Then Gemini
  if (GEMINI_API_KEYS.length > 0) {
    providers.push('gemini');
  }
  
  // Then OpenAI
  if (OPENAI_API_KEY) {
    providers.push('openai');
  }
  
  return providers;
};

export default { sendMessage, getQuestionHint, getAvailableProviders };
