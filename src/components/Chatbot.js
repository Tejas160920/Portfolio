import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedChats, setSavedChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Hugging Face Space API URL
  const API_URL = 'https://tejasgaikwad16092002-tejas-portfolio-rag.hf.space/chat';
  const STREAM_API_URL = 'https://tejasgaikwad16092002-tejas-portfolio-rag.hf.space/chat/stream';
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [streamingText, setStreamingText] = useState('');

  // Wake up the HF Space when chatbot opens (prevents cold start delays)
  const wakeUpSpace = async () => {
    try {
      await fetch(API_URL.replace('/chat', '/health'), {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      }).catch(() => {});
    } catch (e) {
      // Ignore errors - just trying to wake it up
    }
  };

  // Fetch with retry logic for HF Space cold starts
  const fetchWithRetry = async (url, options, maxRetries = 3) => {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        if (i > 0) {
          setIsWakingUp(true);
          // Wait longer between retries (2s, 4s)
          await new Promise(resolve => setTimeout(resolve, 2000 * i));
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          setIsWakingUp(false);
          return response;
        }
        throw new Error(`HTTP ${response.status}`);
      } catch (error) {
        lastError = error;
        console.log(`Attempt ${i + 1} failed:`, error.message);
      }
    }
    setIsWakingUp(false);
    throw lastError;
  };

  // Load saved chats from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('tejas-portfolio-chats');
    if (stored) {
      try {
        setSavedChats(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading saved chats:', e);
      }
    }
  }, []);

  // Listen for custom event to open chatbot from other components
  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
      wakeUpSpace(); // Pre-warm the Space
    };
    window.addEventListener('openTejasAI', handleOpenChatbot);
    return () => window.removeEventListener('openTejasAI', handleOpenChatbot);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save current chat when messages change (if there are messages)
  useEffect(() => {
    if (messages.length > 0 && currentChatId) {
      const updatedChats = savedChats.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages, updatedAt: Date.now() }
          : chat
      );
      setSavedChats(updatedChats);
      localStorage.setItem('tejas-portfolio-chats', JSON.stringify(updatedChats));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, currentChatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    // Prevent body scroll when chat is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Hide hire-me button on mobile when chat is open
      const hireMeBtn = document.querySelector('.hire-me-button');
      if (hireMeBtn && window.innerWidth <= 768) {
        hireMeBtn.style.display = 'none';
      }
    } else {
      document.body.style.overflow = 'unset';
      // Show hire-me button again
      const hireMeBtn = document.querySelector('.hire-me-button');
      if (hireMeBtn) {
        hireMeBtn.style.display = '';
      }
    }

    // Close chat when clicking on anchor links (navbar)
    const handleHashChange = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Also listen for clicks on nav links
    const handleNavClick = (e) => {
      if (e.target.closest('a[href^="#"]') && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleNavClick);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('hashchange', handleHashChange);
      document.removeEventListener('click', handleNavClick);
    };
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Add user message to state
    const newMessages = [...messages, { type: 'user', text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    // If this is the first message, create a new chat
    if (!currentChatId && messages.length === 0) {
      const newChatId = Date.now().toString();
      setCurrentChatId(newChatId);

      // Keep only 3 most recent chats
      let updatedChats = [...savedChats, {
        id: newChatId,
        title: userMessage.length > 25 ? userMessage.substring(0, 25) + '...' : userMessage,
        messages: newMessages,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }];

      // Sort by updatedAt and keep only 3
      updatedChats = updatedChats
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, 3);

      setSavedChats(updatedChats);
      localStorage.setItem('tejas-portfolio-chats', JSON.stringify(updatedChats));
    }

    try {
      // Build conversation history for API
      const history = newMessages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      // Try streaming first for better UX
      let streamSuccess = false;
      try {
        const response = await fetchWithRetry(STREAM_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: userMessage,
            history: history.slice(0, -1)
          }),
        });

        if (response.ok && response.body) {
          streamSuccess = true;
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let fullText = '';

          // Add empty bot message that we'll update
          setMessages(prev => [...prev, { type: 'bot', text: '' }]);
          setIsLoading(false);

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  break;
                }
                if (!data.startsWith('{')) {
                  // Handle newline token from backend
                  if (data === '[NEWLINE]') {
                    fullText += '\n';
                  } else {
                    fullText += data;
                  }
                  // Update the last message with streaming text
                  setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { type: 'bot', text: fullText };
                    return updated;
                  });
                }
              }
            }
          }
        }
      } catch (streamError) {
        console.log('Streaming failed, falling back to regular API:', streamError.message);
      }

      // Fallback to regular API if streaming failed
      if (!streamSuccess) {
        const response = await fetchWithRetry(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: userMessage,
            history: history.slice(0, -1)
          }),
        });

        const data = await response.json();
        setMessages(prev => [...prev, { type: 'bot', text: data.answer }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          text: "Sorry, I'm having trouble connecting right now. The AI service might be waking up - please try again in a moment, or reach out to Tejas directly at tejasgaikwad16092002@gmail.com"
        }
      ]);
    } finally {
      setIsLoading(false);
      setIsWakingUp(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    { icon: "💼", text: "What's his work experience?" },
    { icon: "🚀", text: "Tell me about his projects" },
    { icon: "🛠️", text: "What are his technical skills?" },
    { icon: "🎓", text: "What's his education background?" },
    { icon: "📧", text: "How can I contact him?" },
    { icon: "🎮", text: "What are his hobbies?" }
  ];

  const handleSuggestedQuestion = (question) => {
    setInputValue(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
  };

  const handleLoadChat = (chatId) => {
    const chat = savedChats.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
    }
  };

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    const updatedChats = savedChats.filter(c => c.id !== chatId);
    setSavedChats(updatedChats);
    localStorage.setItem('tejas-portfolio-chats', JSON.stringify(updatedChats));

    // If deleting current chat, clear messages
    if (chatId === currentChatId) {
      setMessages([]);
      setCurrentChatId(null);
    }
  };

  return (
    <>
      {/* Chat Toggle Button - Positioned below the heart */}
      <button
        className="chatbot-toggle"
        onClick={() => {
          setIsOpen(true);
          wakeUpSpace(); // Pre-warm the Space
        }}
        aria-label="Open chat"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span className="chat-label">Ask AI</span>
      </button>

      {/* Full Screen Chat Interface */}
      <div className={`chatbot-fullscreen ${isOpen ? 'open' : ''}`}>
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <div className="logo-icon">T</div>
              <span>Tejas AI</span>
            </div>
            <button className="new-chat-btn" onClick={handleNewChat}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Chat
            </button>
          </div>

          {/* Saved Chats List */}
          <div className="saved-chats-section">
            {savedChats.length > 0 && (
              <>
                <p className="saved-chats-label">Recent Chats</p>
                <div className="saved-chats-list">
                  {savedChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`saved-chat-item ${chat.id === currentChatId ? 'active' : ''}`}
                      onClick={() => handleLoadChat(chat.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <span className="saved-chat-title">{chat.title}</span>
                      <button
                        className="delete-chat-btn"
                        onClick={(e) => handleDeleteChat(e, chat.id)}
                        aria-label="Delete chat"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="sidebar-info">
            <p>Ask me anything about Tejas - his skills, projects, experience, or how to get in touch!</p>
          </div>

          <div className="sidebar-footer">
            <button className="back-to-portfolio" onClick={handleClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Portfolio
            </button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="chat-main">
          {/* Close button for mobile */}
          <button className="mobile-close-btn" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Messages Area */}
          <div className="chat-messages-area">
            {messages.length === 0 ? (
              /* Welcome Screen */
              <div className="welcome-screen">
                <div className="welcome-icon">
                  <span>T</span>
                </div>
                <h1>Hi, I'm Tejas's AI Assistant</h1>
                <p>I can answer questions about Tejas's background, skills, projects, and experience. What would you like to know?</p>

                <div className="suggestions-grid">
                  {suggestedQuestions.map((item, index) => (
                    <button
                      key={index}
                      className="suggestion-card"
                      onClick={() => handleSuggestedQuestion(item.text)}
                    >
                      <span className="suggestion-icon">{item.icon}</span>
                      <span className="suggestion-text">{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Chat Messages */
              <div className="messages-container">
                {messages.map((message, index) => (
                  <div key={index} className={`chat-message ${message.type}`}>
                    <div className="message-wrapper">
                      {message.type === 'bot' && (
                        <div className="bot-avatar">
                          <span>T</span>
                        </div>
                      )}
                      <div className="message-bubble">
                        <div className="message-content">
                          {message.text.split('\n').map((line, i) => {
                            const trimmedLine = line.trim();
                            // Check if line is a heading (wrapped in **)
                            const isHeading = trimmedLine.startsWith('**') && trimmedLine.includes('**', 2);
                            const isBullet = trimmedLine.startsWith('•');

                            if (isHeading) {
                              // Remove ** and render as heading
                              const headingText = trimmedLine.replace(/\*\*/g, '');
                              return <p key={i} className="heading-line">{headingText}</p>;
                            }
                            return (
                              <p key={i} className={isBullet ? 'bullet-line' : ''}>
                                {line || '\u00A0'}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                      {message.type === 'user' && (
                        <div className="user-avatar">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="chat-message bot">
                    <div className="message-wrapper">
                      <div className="bot-avatar">
                        <span>T</span>
                      </div>
                      <div className="message-bubble">
                        {isWakingUp ? (
                          <div className="waking-up-message">
                            <div className="typing-dots">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                            <span className="waking-text">Waking up AI service...</span>
                          </div>
                        ) : (
                          <div className="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <div className="input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message Tejas's AI..."
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="send-button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
            <p className="input-hint">AI assistant powered by Tejas's portfolio data</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
