import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import Button from './components/Button'
import ChatMessages from './components/ChatMessages'
import ChatInput from './components/ChatInput'
import ThinkingIndicator from './components/ThinkingIndicator.jsx'
import { useChatbot } from './hooks/useChatbot'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef(null)

  const {
    messages,
    input,
    setInput,
    isLoading,
    showWelcomeMessage,
    setShowWelcomeMessage,
    autoSpeak,
    setAutoSpeak,
    listening,
    speaking,
    predefinedQuestions,
    handleSendMessage,
    handleClearChat,
    handleCompletionCelebration,
    toggleListening,
    cancel
  } = useChatbot()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && showWelcomeMessage) {
      const timer = setTimeout(() => {
        setShowWelcomeMessage(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isOpen, showWelcomeMessage, setShowWelcomeMessage])

  return (
    <div className="fixed z-50 bottom-4 right-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              width: isExpanded ? 'min(95vw, 600px)' : 'min(90vw, 400px)',
              height: isExpanded ? 'min(90vh, 750px)' : 'min(80vh, 650px)'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col overflow-hidden bg-white shadow-2xl rounded-3xl"
            style={{
              boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.5), 0 8px 10px -6px rgba(79, 70, 229, 0.3)',
            }}
          >
            <motion.div
              className="flex items-center justify-between p-4 text-white cursor-move md:p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-3xl"
              whileHover={{ backgroundImage: 'linear-gradient(to right, #6366F1, #7C3AED)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="flex items-center justify-center w-10 h-10 text-lg font-bold text-indigo-600 bg-white rounded-full shadow-inner md:w-12 md:h-12"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  AI
                </motion.div>
                <div>
                  <h3 className="text-sm font-semibold md:text-md">HomeworkHelper AI</h3>
                  <p className="text-xs text-indigo-200 md:text-sm">Your study companion</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 md:space-x-2">
                <Button variant="ghost" size="sm" onClick={handleClearChat} className="text-white hover:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="text-white hover:text-black">
                  {isExpanded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white hover:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              </div>
            </motion.div>
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              handleCompletionCelebration={handleCompletionCelebration}
            />
            {isLoading && <ThinkingIndicator />}
            <div ref={messagesEndRef} />
            <ChatInput
              input={input}
              setInput={setInput}
              handleSendMessage={handleSendMessage}
              isLoading={isLoading}
              autoSpeak={autoSpeak}
              setAutoSpeak={setAutoSpeak}
              predefinedQuestions={predefinedQuestions}
              speaking={speaking}
              cancel={cancel}
              listening={listening}
              toggleListening={toggleListening}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="p-4 text-white transition-all rounded-full shadow-lg bg-proj hover:shadow-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </motion.button>
      )}
      <Tooltip id="voice-tooltip" />
    </div>
  )
}

export default ChatBot