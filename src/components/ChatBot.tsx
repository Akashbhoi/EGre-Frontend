import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ChatBot.css';
import { sendMessage, getAvailableProviders, type AIProvider } from '../services/aiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  questionContext: string;
}

const ChatBot = ({ questionContext }: ChatBotProps) => {
  const availableProviders = getAvailableProviders();
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(
    availableProviders.length > 0 ? availableProviders[0] : 'gemini'
  );
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your GRE study assistant. How can I help?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usedHints, setUsedHints] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset chat when the question context changes
  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: "Hi! I'm your GRE study assistant. How can I help?",
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
    setUsedHints(new Set()); // Reset hints when question changes
  }, [questionContext]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponse = await sendMessage(inputMessage, questionContext, selectedProvider);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble responding right now. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    { id: 'explain', label: 'Explain', requiresHint: null },
    { id: 'concept', label: 'Concept', requiresHint: null },
    { id: 'hint1', label: 'Hint 1', requiresHint: null },
    { id: 'hint2', label: 'Hint 2', requiresHint: 'hint1' },
    { id: 'hint3', label: 'Hint 3', requiresHint: 'hint2' },
    { id: 'solution', label: 'Solution', requiresHint: null },
  ];

  const handleQuickPrompt = (prompt: typeof quickPrompts[0]) => {
    setInputMessage(prompt.label);
    // Track hint usage
    if (prompt.id.startsWith('hint')) {
      setUsedHints(prev => new Set(prev).add(prompt.id));
    }
  };

  const isPromptDisabled = (prompt: typeof quickPrompts[0]) => {
    // If it requires a previous hint, check if that hint has been used
    if (prompt.requiresHint) {
      return !usedHints.has(prompt.requiresHint);
    }
    return false;
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-header-content">
          <div className="chatbot-icon">🧑‍🏫</div>
          <div className="chatbot-header-text">
            <h3>AI Mentor</h3>
            <span className="chatbot-status">
              <span className="status-dot"></span>
              Ready to help
            </span>
          </div>
        </div>
        {availableProviders.length > 1 && (
          <div className="chatbot-provider-selector">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as AIProvider)}
              className="provider-select"
              disabled={isLoading}
            >
              {availableProviders.includes('gemini') && (
                <option value="gemini">Gemini 1.5 Flash</option>
              )}
              {availableProviders.includes('openai') && (
                <option value="openai">GPT-4o Mini</option>
              )}
              {availableProviders.includes('groq') && (
                <option value="groq">Groq Llama 3.3 (Fast & Free)</option>
              )}
            </select>
          </div>
        )}
      </div>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'message-user' : 'message-bot'}`}
          >
            <div className="message-avatar">
              {message.sender === 'user' ? '👤' : '🧑‍🏫'}
            </div>
            <div className="message-content">
              {message.sender === 'bot' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
              ) : (
                <p>{message.text}</p>
              )}
              <span className="message-time">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message message-bot">
            <div className="message-avatar">🧑‍🏫</div>
            <div className="message-content">
              <p className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-quick-prompts">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt.id}
            className="quick-prompt-btn"
            onClick={() => handleQuickPrompt(prompt)}
            disabled={isPromptDisabled(prompt)}
            style={{
              opacity: isPromptDisabled(prompt) ? 0.5 : 1,
              cursor: isPromptDisabled(prompt) ? 'not-allowed' : 'pointer',
            }}
          >
            {prompt.label}
          </button>
        ))}
      </div>

      <div className="chatbot-input-area">
        <textarea
          className="chatbot-input"
          placeholder="Ask me anything about this question..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={1}
        />
        <button
          className="chatbot-send-btn"
          onClick={handleSendMessage}
          disabled={inputMessage.trim() === '' || isLoading}
        >
          <span>➤</span>
        </button>
      </div>

      <div className="chatbot-footer">
        <small>
          💡 Powered by {
            selectedProvider === 'openai' 
              ? 'OpenAI GPT-4o Mini' 
              : selectedProvider === 'groq' 
                ? 'Groq Llama 3.3 70B' 
                : 'Google Gemini 1.5 Flash'
          }
        </small>
      </div>
    </div>
  );
};

export default ChatBot;
