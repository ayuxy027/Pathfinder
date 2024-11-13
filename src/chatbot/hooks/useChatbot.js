// useSpeechSynthesis.js
import { useState, useCallback, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { getAIResponse } from '../aiService'

export const useSpeechSynthesis = () => {
  const [speaking, setSpeaking] = useState(false)
  const [speechSynth, setSpeechSynth] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynth(window.speechSynthesis)
    }
  }, [])

  const speak = ({ text }) => {
    if (!speechSynth) return

    // Cancel any ongoing speech
    cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    speechSynth.speak(utterance)
  }

  const cancel = () => {
    if (speechSynth) {
      setSpeaking(false)
      speechSynth.cancel()
    }
  }

  useEffect(() => {
    return () => {
      cancel()
    }
  }, [])

  return { speak, cancel, speaking }
}

// Updated useChatbot.js


export const useChatbot = () => {
  const [messages, setMessages] = useLocalStorage('homework-helper-messages', [])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true)
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [listening, setListening] = useState(false)

  const { speak, cancel, speaking } = useSpeechSynthesis()

  const predefinedQuestions = [
    "How to improve study habits?",
    "Help with math problem",
    "Essay writing tips",
    "Science project ideas",
    "Language learning strategies",
    "Exam preparation tips",
  ]

  const handleSendMessage = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    setMessages(prev => [...prev, { text: input, sender: 'user' }])
    setInput('')

    try {
      const aiResponse = await getAIResponse(input)
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }])
      if (autoSpeak) {
        speak({ text: aiResponse })
      }
      setShowConfetti(true)
    } catch (error) {
      console.error('Error getting AI response:', error)
      setMessages(prev => [...prev, { text: "I apologize, but I'm experiencing difficulties processing your request at the moment. Could you please rephrase your question or ask about a different topic?", sender: 'ai' }])
    }

    setIsLoading(false)
  }

  const handleClearChat = useCallback(() => {
    setMessages([])
    setShowWelcomeMessage(true)
  }, [setMessages])

  const handleCompletionCelebration = useCallback(() => {
    if (showConfetti) {
      // Implement confetti effect here
      setShowConfetti(false)
    }
  }, [showConfetti])

  const toggleListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. Please try using Chrome.')
      return
    }

    if (listening) {
      setListening(false)
    } else {
      const recognition = new window.webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setListening(false)
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error)
        setListening(false)
      }

      recognition.onend = () => {
        setListening(false)
      }

      recognition.start()
      setListening(true)
    }
  }, [listening])

  useEffect(() => {
    return () => {
      cancel() // Cleanup any ongoing speech when component unmounts
    }
  }, [cancel])

  return {
    messages,
    input,
    setInput,
    isLoading,
    showWelcomeMessage,
    setShowWelcomeMessage,
    autoSpeak,
    setAutoSpeak,
    showConfetti,
    listening,
    speaking,
    predefinedQuestions,
    handleSendMessage,
    handleClearChat,
    handleCompletionCelebration,
    toggleListening,
    cancel
  }
}