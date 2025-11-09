// Unified AI service (JavaScript version)

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
  .map((key) => key.trim())
  .filter((key) => key);

let currentGeminiKeyIndex = 0;

// OpenAI Configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

// Groq Configuration
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

// OpenRouter Configuration
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

// Gemini API call
const callGeminiAPI = async (prompt, apiKey) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

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
const callGeminiWithRotation = async (prompt) => {
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
const callOpenAI = async (prompt) => {
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
const callGroq = async (prompt) => {
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


// OpenRouter API call
const callOpenRouter = async (prompt) => {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  const url = 'https://api.openrouter.com/v1/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'openrouter-3.3-70b-versatile',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenRouter API Error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response generated';
};

// Unified message sending function
export const sendMessage = async (
  userMessage,
  questionContext,
  provider = 'gemini'
) => {
  try {
    const prompt = `Here is the question for context:\n${questionContext}\n\nUser: ${userMessage}\n\nAssistant:`;
    console.log(`Sending request to ${String(provider).toUpperCase()}...`);

    switch (provider) {
      case 'openai':
        return await callOpenAI(prompt);
      case 'groq':
        return await callGroq(prompt);
      case 'openrouter':
        return await callOpenRouter(prompt);
      case 'gemini':
      default:
        return await callGeminiWithRotation(prompt);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return `Error: ${message}`;
  }
};

// Generate quiz questions using selected provider (basic prompt)
export const generateQuizQuestions = async (topic, count = 10, provider = 'gemini') => {
  const prompt = `Generate ${count} multiple-choice GRE-style questions for the topic: ${topic}.
Each question should be JSON with fields: id, question, options (array of 4), correctAnswer (index 0-3), explanation, topic, difficulty (Easy|Medium|Hard).
Return ONLY valid JSON array, no markdown.`;

  try {
    const raw = await sendMessage(prompt, '', provider);

    // Check if we got an error message back
    if (raw && raw.startsWith('Error:')) {
      console.error('AI provider returned error:', raw);
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log(`Successfully generated ${parsed.length} questions using ${provider}`);
        return parsed;
      }
      // sometimes models wrap in object
      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        console.log(`Successfully generated ${parsed.questions.length} questions using ${provider}`);
        return parsed.questions;
      }
      console.warn('AI returned valid JSON but no questions found');
    } catch (_e) {
      console.warn('Failed to parse AI questions JSON, falling back to static. Raw:', raw);
    }
  } catch (e) {
    console.error('AI question generation failed:', e);
  }

  console.log('Returning empty array - caller should fallback to static questions');
  return [];
};

export const getAvailableProviders = () => {
  const providers = [];
  // Groq is the default provider (listed first)
  if (GROQ_API_KEY) providers.push('groq');
  if (GEMINI_API_KEYS.length > 0) providers.push('gemini');
  if (OPENAI_API_KEY) providers.push('openai');
  if (OPENROUTER_API_KEY) providers.push('openrouter');
  return providers;
};
