import { useState } from 'react';
import './ChatBot.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your GRE study assistant. I can help you understand questions, explain concepts, and provide study tips. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response (placeholder)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm a UI mockup. Connect me to an AI service to provide real responses!",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
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
              <p>{message.text}</p>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
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
          disabled={inputMessage.trim() === ''}
        >
          <span>➤</span>
        </button>
      </div>

      <div className="chatbot-footer">
        <small>💡 AI-powered assistant (mockup)</small>
      </div>
    </div>
  );
};

export default ChatBot;
