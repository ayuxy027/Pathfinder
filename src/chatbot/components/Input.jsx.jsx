import React from 'react'
import { motion } from 'framer-motion'

const Input = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <motion.input
      className={`flex h-12 w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${className}`}
      ref={ref}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    />
  )
})

export default Input