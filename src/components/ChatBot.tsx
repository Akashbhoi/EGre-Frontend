import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ChatBot.css';
import { sendMessageToGemini } from '../services/geminiService';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your GRE study assistant. I can help you understand questions, explain concepts, and provide study tips. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
        text: "Hi! I'm your GRE study assistant. I can help you understand questions, explain concepts, and provide study tips. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
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
      const botResponse = await sendMessageToGemini(inputMessage, questionContext);

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
    "Explain this question",
    "Give me a hint",
    "What's the concept?",
    "Study tips",
  ];

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-header-content">
          <div className="chatbot-icon">🤖</div>
          <div className="chatbot-header-text">
            <h3>AI Study Assistant</h3>
            <span className="chatbot-status">
              <span className="status-dot"></span>
              Ready to help
            </span>
          </div>
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'message-user' : 'message-bot'}`}
          >
            <div className="message-avatar">
              {message.sender === 'user' ? '👤' : '🤖'}
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
            <div className="message-avatar">🤖</div>
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
        {quickPrompts.map((prompt, index) => (
          <button
            key={index}
            className="quick-prompt-btn"
            onClick={() => setInputMessage(prompt)}
          >
            {prompt}
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
        <small>💡 Powered by Google Gemini AI</small>
      </div>
    </div>
  );
};

export default ChatBot;
