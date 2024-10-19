import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useAuth0 } from "@auth0/auth0-react"
import { motion } from 'framer-motion'

export default function LoginComponent() {
  const { loginWithRedirect, isAuthenticated } = useAuth0()

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      loginWithRedirect()
    }
  }

  return (
    <motion.div 
      className="flex items-start justify-center min-h-screen px-4 py-16 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-5xl mx-auto mt-8 overflow-hidden bg-white rounded-lg shadow-2xl">
        <div className="md:flex md:items-stretch">
          <motion.div 
            className="p-8 space-y-6 md:w-3/5"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-5xl font-semibold text-transparent bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text">
              Welcome to PathFinder
            </h1>
            <p className="text-2xl leading-relaxed text-gray-600">
              Embark on your career journey with personalized guidance
            </p>
            <ul className="space-y-5">
              <FeatureItem text="Discover tailored career paths" />
              <FeatureItem text="Connect with industry mentors" />
              <FeatureItem text="Access exclusive job opportunities" />
            </ul>
          </motion.div>

          <motion.div 
            className="flex flex-col justify-center p-8 md:w-2/5 bg-gray-50"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">Log In or Sign Up</h2>
            <motion.button 
              className="w-full px-6 py-4 text-lg font-semibold text-white transition duration-300 bg-teal-500 rounded-lg hover:bg-teal-600"
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
            <p className="mt-6 text-base text-center text-gray-600">
              You are seeing this page because you have not logged in.
              <br />
              <br />
              Sign in or sign up to continue.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

function FeatureItem({ text }) {
  return (
    <motion.li 
      className="flex items-center space-x-4 text-lg text-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <ArrowRight className="flex-shrink-0 w-6 h-6 text-teal-500" />
      <span>{text}</span>
    </motion.li>
  )
}