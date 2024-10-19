import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TypewriterEffect from './TypewriterEffect'

const ChatMessages = ({ messages, isLoading, handleCompletionCelebration }) => {
  return (
    <motion.div 
      className="flex-1 p-4 space-y-4 overflow-y-auto md:p-6 bg-gradient-to-b from-indigo-50 to-white"
    >
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 30 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <motion.div
              className={`max-w-[85%] p-3 md:p-4 rounded-2xl shadow-md ${
                message.sender === 'user'
                  ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {message.sender === 'ai' ? (
                <TypewriterEffect content={message.text} onComplete={handleCompletionCelebration} />
              ) : (
                message.text
              )}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

export default ChatMessages