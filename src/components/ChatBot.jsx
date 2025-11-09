import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sendMessage, getAvailableProviders } from '../services/aiService.js';

const ChatBot = ({ questionContext }) => {
  const availableProviders = getAvailableProviders();
  const [selectedProvider, setSelectedProvider] = useState(
    availableProviders.length > 0 ? availableProviders[0] : 'groq'
  );
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hi! I'm your GRE study assistant. How can I help?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usedHints, setUsedHints] = useState(new Set());
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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

    const userMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Add typing indicator
    const typingIndicator = {
      id: 'typing-indicator',
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingIndicator]);

    try {
      const botResponse = await sendMessage(inputMessage, questionContext, selectedProvider);

      // Remove typing indicator and add actual response
      setMessages((prev) => prev.filter(msg => msg.id !== 'typing-indicator'));

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Remove typing indicator
      setMessages((prev) => prev.filter(msg => msg.id !== 'typing-indicator'));

      const errorMessage = {
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

  const handleKeyPress = (e) => {
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

  const handleQuickPrompt = async (promptId) => {
    if (!questionContext) return;

    const basePromptMap = {
      explain: 'Explain the core idea behind solving this question in simple terms.',
      concept: 'What is the key concept needed to solve this?',
      hint1: 'Give me the first hint to get started (no answer).',
      hint2: 'Give me another hint (no answer).',
      hint3: 'Give me one more hint (no answer).',
      solution: 'Give me the complete solution step by step.',
    };

    // Enforce hint ordering
    if (promptId === 'hint2' && !usedHints.has('hint1')) return;
    if (promptId === 'hint3' && !usedHints.has('hint2')) return;

    const prompt = basePromptMap[promptId] || '';

    // Mark hint as used before sending
    if (promptId === 'hint1' || promptId === 'hint2' || promptId === 'hint3') {
      setUsedHints((prev) => new Set(prev).add(promptId));
    }

    // Set input and send automatically
    setInputMessage(prompt);

    // Send the message automatically
    const userMessage = {
      id: Date.now().toString(),
      text: prompt,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage(''); // Clear input after sending
    setIsLoading(true);

    // Add typing indicator
    const typingIndicator = {
      id: 'typing-indicator',
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingIndicator]);

    try {
      const botResponse = await sendMessage(prompt, questionContext, selectedProvider);

      // Remove typing indicator
      setMessages((prev) => prev.filter(msg => msg.id !== 'typing-indicator'));

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Remove typing indicator
      setMessages((prev) => prev.filter(msg => msg.id !== 'typing-indicator'));

      const errorMessage = {
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

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-header-content">
          <div className="chatbot-icon">👨‍🏫</div>
          <div className="chatbot-header-text">
            <h3>AI Mentor</h3>
            <div className="chatbot-status">
              <span className="status-dot"></span>
              <span>Online</span>
            </div>
          </div>
        </div>
        <div className="chatbot-provider-selector">
          <select
            className="provider-select"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            disabled={isLoading}
            title="Select AI Provider"
          >
            {availableProviders.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="message-bubble">
              {msg.isTyping ? (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Custom renderer for text to escape dollar signs properly
                    text: ({node, ...props}) => <span {...props} />
                  }}
                >
                  {msg.text.replace(/\$/g, '\\$')}
                </ReactMarkdown>
              )}
            </div>
            {!msg.isTyping && (
              <div className="message-meta">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-quick-prompts">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt.id}
            className="quick-prompt"
            onClick={() => handleQuickPrompt(prompt.id)}
            disabled={prompt.requiresHint && !usedHints.has(prompt.requiresHint)}
            title={prompt.requiresHint ? `Requires ${prompt.requiresHint.toUpperCase()}` : ''}
          >
            {prompt.label}
          </button>
        ))}
      </div>

      <div className="chatbot-input">
        <textarea
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={2}
        />
        <button className="send-button" onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
