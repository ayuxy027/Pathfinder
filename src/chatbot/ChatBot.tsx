import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { getAIResponse } from './utils/aiService';
import { SimpleMarkdownRenderer } from './components/SimpleMarkdownRenderer';
import { CustomToggle } from './components/CustomToggle';
import { CustomTooltip } from './components/CustomTooltip';

interface ChatMessageData {
  text: string;
  sender: 'user' | 'ai';
}

const PREDEFINED_QUESTIONS = [
  "How to switch careers?",
  "Best programming languages?",
  "Resume writing tips",
  "Interview preparation",
  "Salary negotiation advice",
  "Remote work tips",
];

interface TypewriterEffectProps {
  content: string;
  onComplete: () => void;
}

function TypewriterEffect({ content, onComplete }: TypewriterEffectProps) {
  const [displayedContent, setDisplayedContent] = useState('');

  useEffect(() => {
    let current = 0;

    const timer = setInterval(() => {
      if (current < content.length) {
        current += 1;
        setDisplayedContent(content.slice(0, current));
      } else {
        clearInterval(timer);
        onComplete();
      }
    }, 25);

    return () => clearInterval(timer);
  }, [content, onComplete]);

  return <SimpleMarkdownRenderer content={displayedContent} />;
}

const ThinkingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="flex justify-start px-4 sm:px-6"
  >
    <div className="bg-teal-50 border border-teal-100 p-3 sm:p-4 rounded-2xl max-w-[70%] shadow-sm">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="flex items-center font-medium text-teal-700"
      >
        <svg className="mr-3 -ml-1 w-5 h-5 text-teal-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm sm:text-base">Thinking...</span>
      </motion.div>
    </div>
  </motion.div>
);

interface ChatMessagesProps {
  messages: ChatMessageData[];
  isLoading: boolean;
  onComplete: () => void;
}

function ChatMessages({ messages, onComplete }: ChatMessagesProps) {
  return (
    <div className="overflow-y-auto flex-1 p-4 space-y-4 sm:p-6" role="log" aria-label="Chat messages">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={`${message.sender}-${index}-${message.text.length}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 30 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <motion.div
              className={`max-w-[85%] p-3 sm:p-4 rounded-2xl shadow-sm ${
                message.sender === 'user'
                  ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white'
                  : 'bg-white text-gray-800 border border-teal-100 shadow-sm'
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {message.sender === 'ai' ? (
                <TypewriterEffect key={message.text} content={message.text} onComplete={onComplete} />
              ) : (
                <p className="text-sm leading-relaxed sm:text-base">{message.text}</p>
              )}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
  autoSpeak: boolean;
  setAutoSpeak: (value: boolean) => void;
  predefinedQuestions: string[];
  speaking: boolean;
  cancel: () => void;
}

function ChatInput({ input, setInput, handleSendMessage, isLoading, autoSpeak, setAutoSpeak, predefinedQuestions, speaking, cancel }: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 bg-white rounded-b-2xl border-t border-teal-100 sm:p-6">
      <div className="flex mb-4 space-x-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about your career path..."
            className="flex px-4 py-2 w-full h-12 text-sm text-gray-800 bg-teal-50 rounded-xl border-2 border-teal-200 transition-colors duration-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            disabled={isLoading}
            aria-label="Type your message"
          />
        </div>

        <CustomTooltip content="Send message">
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className={`px-4 py-2 transition-all duration-200 rounded-lg font-medium text-sm flex items-center justify-center ${
              isLoading || !input.trim()
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-md hover:shadow-lg'
            }`}
            aria-label="Send message"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            )}
          </button>
        </CustomTooltip>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="mr-3 text-sm font-medium text-gray-600">Auto-speak:</span>
            <CustomToggle onChange={setAutoSpeak} checked={autoSpeak} disabled={isLoading} />
          </div>
        </div>

        {speaking && (
          <button
            onClick={cancel}
            type="button"
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
            <span>Stop Speaking</span>
          </button>
        )}
      </div>

      {predefinedQuestions && predefinedQuestions.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {predefinedQuestions.map((question, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setInput(question)}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs rounded-full border border-teal-200 transition-colors duration-200 hover:bg-teal-50 hover:border-teal-300 disabled:opacity-50 text-teal-700 font-medium"
            >
              {question}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { value: messages, setValue: setMessages } = useLocalStorage<ChatMessageData[]>('pathfinder-ai-messages', []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const autoSpeakRef = useRef(autoSpeak);
  useEffect(() => { autoSpeakRef.current = autoSpeak; }, [autoSpeak]);

  const { speak, cancel, speaking } = useSpeechSynthesis();

  const handleSendMessage = useCallback(async (): Promise<void> => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(userMessage);
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
      if (autoSpeakRef.current) {
        speak({ text: aiResponse });
      }
    } catch (error) {
      console.error('ChatBot AI response error:', error);
      setMessages(prev => [...prev, { text: "I apologize, but I'm experiencing difficulties processing your request. Could you please rephrase your question?", sender: 'ai' }]);
    }

    setIsLoading(false);
  }, [input, isLoading, setMessages, speak]);

  const handleClearChat = useCallback((): void => {
    setMessages([]);
  }, [setMessages]);

  const scrollToBottom = useCallback((): void => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, scrollToBottom]);

  const handleToggle = useCallback((): void => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsOpen(prev => !prev);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [isAnimating]);

  const handleExpand = useCallback((): void => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsExpanded(prev => !prev);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isAnimating]);

  const handleComplete = useCallback((): void => {
    // Typewriter effect completed
  }, []);

  const handleClearWithConfirm = useCallback((): void => {
    if (messages.length > 0 && !isLoading) {
      if (window.confirm('Are you sure you want to clear the chat history?')) {
        handleClearChat();
      }
    }
  }, [messages.length, isLoading, handleClearChat]);

  return (
    <>
      <div className="fixed right-4 bottom-4 z-50">
        {isOpen && (
          <div
            className={`flex overflow-hidden flex-col bg-white rounded-2xl border border-teal-100 shadow-2xl animate-scaleIn transition-all duration-300 ${
              isExpanded ? 'w-[min(95vw,700px)] h-[min(90vh,800px)]' : 'w-[min(90vw,450px)] h-[min(80vh,700px)]'
            }`}
            style={{ boxShadow: '0 20px 25px -5px rgba(13, 148, 136, 0.3), 0 10px 10px -5px rgba(13, 148, 136, 0.2)' }}
          >
            <div className="flex justify-between items-center p-4 text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-t-2xl transition-all duration-300 sm:p-5 hover:from-teal-700 hover:to-teal-800">
              <div className="flex items-center space-x-3">
                <div className="flex justify-center items-center w-10 h-10 text-base font-medium text-teal-700 bg-white rounded-xl shadow-sm transition-transform duration-200 sm:w-12 sm:h-12 sm:text-lg hover:scale-105" aria-hidden="true">
                  AI
                </div>
                <div>
                  <h3 className="text-base font-medium sm:text-lg">PathFinder AI</h3>
                  <p className="text-xs text-teal-100 sm:text-sm">
                    {isLoading ? 'Thinking...' : 'Your career companion'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2">
                <CustomTooltip content="Clear chat history">
                  <button
                    type="button"
                    onClick={handleClearWithConfirm}
                    disabled={isLoading || messages.length === 0}
                    className="p-2 text-white rounded-lg transition-colors duration-200 hover:text-teal-700 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Clear chat history"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </CustomTooltip>

                <CustomTooltip content={isExpanded ? "Minimize chat" : "Expand chat"}>
                  <button
                    type="button"
                    onClick={handleExpand}
                    disabled={isAnimating}
                    className="p-2 text-white rounded-lg transition-colors duration-200 hover:text-teal-700 hover:bg-white/20 disabled:opacity-50"
                    aria-label={isExpanded ? "Minimize chat" : "Expand chat"}
                  >
                    {isExpanded ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </CustomTooltip>

                <CustomTooltip content="Close chat">
                  <button
                    type="button"
                    onClick={handleToggle}
                    disabled={isAnimating}
                    className="p-2 text-white rounded-lg transition-colors duration-200 hover:text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                    aria-label="Close chat"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </CustomTooltip>
              </div>
            </div>

            <div className="overflow-hidden flex-1 bg-gradient-to-b to-white from-teal-50/30">
              <ChatMessages messages={messages} isLoading={isLoading} onComplete={handleComplete} />
              {isLoading && <ThinkingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            <ChatInput
              input={input}
              setInput={setInput}
              handleSendMessage={handleSendMessage}
              isLoading={isLoading}
              autoSpeak={autoSpeak}
              setAutoSpeak={setAutoSpeak}
              predefinedQuestions={PREDEFINED_QUESTIONS}
              speaking={speaking}
              cancel={cancel}
            />
          </div>
        )}

        {!isOpen && (
          <CustomTooltip content="Open PathFinder AI Chat">
            <button
              onClick={handleToggle}
              disabled={isAnimating}
              className="p-4 text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-full shadow-lg transition-all duration-300 hover:from-teal-700 hover:to-teal-800 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-scaleIn"
              aria-label="Open chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>
          </CustomTooltip>
        )}
      </div>
    </>
  );
}