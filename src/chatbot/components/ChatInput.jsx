import React from 'react'
import { motion } from 'framer-motion'
import Button from './Button'
import Input from './Input.jsx'
import Switch from 'react-switch'

const ChatInput = ({ input, setInput, handleSendMessage, isLoading, autoSpeak, setAutoSpeak, predefinedQuestions, speaking, cancel }) => {
  return (
    <motion.div 
      className="p-4 md:p-6 bg-gradient-to-b from-white to-indigo-50 rounded-b-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="flex mb-4 space-x-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask about your homework..."
          className="flex-grow shadow-inner bg-indigo-50"
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading}
          className="transition-shadow rounded-full shadow-lg hover:shadow-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </Button>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">Auto-speak:</span>
          <Switch
            onChange={setAutoSpeak}
            checked={autoSpeak}
            onColor="#4F46E5"
            offColor="#D1D5DB"
            checkedIcon={false}
            uncheckedIcon={false}
            height={20}
            width={40}
          />
        </div>
        {speaking && (
          <Button onClick={cancel} variant="ghost" size="sm" className="text-red-500 hover:bg-red-100">
            Stop Speaking
          </Button>
        )}
      </div>
      <motion.div 
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {predefinedQuestions.map((question, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => setInput(question)}
            className="text-xs transition-colors border border-indigo-200 rounded-full hover:bg-indigo-100"
          >
            {question}
          </Button>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default ChatInput