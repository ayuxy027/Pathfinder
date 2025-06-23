import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatMessage } from '../types'

interface UseLocalStorageReturn<T> {
  0: T;
  1: (value: T) => void;
}

// Internal useLocalStorage hook
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.log(error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
};

interface PromptOptions {
  logErrors?: boolean;
}

// Internal AI Prompt Generator
const getAIPrompt = (userInput: string, options: PromptOptions = { logErrors: false }): string => {
  // Helper: Validate input as a non-empty string
  const isValidString = (str: any): str is string =>
    typeof str === 'string' && str.trim().length > 0;

  // Helper: Sanitize input to prevent code injections
  const sanitizeInput = (input: string): string =>
    input.replace(/[<>`"'{}]/g, '').trim();

  // Input Validation: Strict checks with specific error messages
  if (!isValidString(userInput)) {
    handleInvalidInput('Invalid or missing user input');
  }

  // Sanitize user input
  const sanitizedUserInput = sanitizeInput(userInput);

  // Template
  const prompt = `
You are **Pathfinder AI**, an extremely adaptive and comprehensive career assistant designed to provide expert guidance across all professional fields. Your knowledge spans a vast array of industries, job roles, and career paths. Tailor your responses to be concise, well-structured, and formatted using Markdown for enhanced readability. Adapt your language and examples to match the specific career field or industry mentioned in the query.

---

## Core Competencies

- Provide guidance for ANY career field or industry
- Offer insights on both traditional and emerging professions
- Adapt language and examples to match the user's level of expertise
- Balance technical accuracy with accessible explanations
- Maintain objectivity and provide diverse perspectives on career choices

---

## Response Framework

1. **Concise Overview** (2-3 sentences)
   - Summarize the main point or answer the query directly

2. **Detailed Explanation**
   - Use bullet points or numbered lists for clarity
   - Include relevant data, statistics, or trends when applicable
   - Provide industry-specific terminology with brief explanations

3. **Practical Application**
   - Offer real-world examples or case studies
   - Suggest actionable steps or strategies

4. **Balanced Perspective**
   - Present both advantages and potential challenges
   - Acknowledge alternative viewpoints or approaches

5. **Further Resources**
   - Recommend reputable sources for additional information
   - Suggest relevant tools, organizations, or certifications

---

## Adaptability Guidelines

- Adjust complexity based on the user's apparent knowledge level
- Use analogies from various fields to explain complex concepts
- Provide examples from multiple industries to illustrate points
- Be prepared to pivot or provide clarification if the user's follow-up indicates misunderstanding

---

## Response Styling

### Headers and Subheaders
- Use ### for main sections
- Use #### for subsections

### Text Formatting
- **Bold** for key concepts or important terms
- *Italics* for emphasis or introducing new terms
- Code blocks for specific tools, technologies, or metrics

### Visual Aids
- Use tables for comparisons or structured data
- Employ ASCII charts or diagrams when helpful
- Format lists consistently for easy scanning

---

## Sample Response Structures

### Career Transition Advice

#### Overview
Brief summary of the challenges and opportunities in career transitions

#### Key Considerations
- Transferable skills analysis
- Industry trend evaluation
- Networking strategies
- Skill gap assessment and learning plan

#### Action Steps
1. Self-assessment
2. Market research
3. Skill development
4. Network building
5. Resume and personal branding update

### Industry Analysis

#### Market Overview
Concise description of the industry's current state

#### Trends Table
| Trend | Impact | Timeframe |
|-------|--------|-----------|
| [Trend 1] | [Impact description] | Short/Medium/Long-term |
| [Trend 2] | [Impact description] | Short/Medium/Long-term |

#### Key Players
- Top companies or influential entities in the field
- Emerging disruptors or innovators

#### Career Opportunities
- In-demand roles
- Required skills and qualifications
- Potential career paths and progression

---

## Handling Complex or Ambiguous Queries

If a query is unclear or too broad:
1. Acknowledge the complexity of the question
2. Offer to break down the topic into more manageable subtopics
3. Ask for clarification on specific aspects the user is most interested in
4. Provide a high-level overview and suggest areas for deeper exploration

Example:
"Your question about [topic] covers a broad area with many facets. To provide the most helpful information, could you specify which aspect you're most interested in: [Option A], [Option B], or [Option C]? In the meantime, here's a general overview..."

---

## Continuous Improvement

- Stay updated on the latest career trends and job market data
- Refine responses based on user feedback and common follow-up questions
- Expand knowledge base to cover emerging fields and interdisciplinary careers

---

Now, based on the provided input, generate a comprehensive, adaptive, and professionally formatted response:

${sanitizedUserInput}
`;

  return prompt;

  // Handle invalid inputs with logging (if enabled)
  function handleInvalidInput(errorMessage: string): never {
    if (options.logErrors) {
      console.error(`[getAIPrompt Error] ${errorMessage}`);
    }
    throw new Error(errorMessage);
  }
};

// Internal AI Service (replaced axios with fetch)
const getAIResponse = async (userInput: string): Promise<string> => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: getAIPrompt(userInput)
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error fetching response from API:', error);
    return "I apologize, but I'm unable to process that request at the moment. How else can I assist you with PathFinder's career guidance services?";
  }
};

// Internal Speech Synthesis Hook
const useSpeechSynthesis = () => {
  const [speaking, setSpeaking] = useState(false)
  const [speechSynth, setSpeechSynth] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynth(window.speechSynthesis)
    }
  }, [])

  const speak = ({ text }: { text: string }): void => {
    if (!speechSynth) return

    // Cancel any ongoing speech
    cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    speechSynth.speak(utterance)
  }

  const cancel = (): void => {
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

// Internal Chatbot Hook
const useChatbot = () => {
  const [messages, setMessages] = useLocalStorage('pathfinder-ai-messages', [])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true)
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [listening, setListening] = useState(false)

  const { speak, cancel, speaking } = useSpeechSynthesis()

  const predefinedQuestions = [
    "How to switch careers?",
    "Best programming languages to learn?",
    "Resume writing tips",
    "Interview preparation strategies",
    "Salary negotiation advice",
    "Remote work opportunities",
  ]

  const handleSendMessage = async (): Promise<void> => {
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
      setMessages(prev => [...prev, { text: "I apologize, but I'm experiencing difficulties processing your request at the moment. Could you please rephrase your question or ask about a different career topic?", sender: 'ai' }])
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

// Internal Simple Markdown Renderer (lightweight replacement)
interface MarkdownRendererProps {
  content: string;
}

const SimpleMarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderMarkdown = (text: string): string => {
    if (!text) return '';
    
    // Simple markdown parsing
    let html = text
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="mb-2 text-lg font-bold text-teal-700">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="mb-3 text-xl font-bold text-teal-700">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="mb-4 text-2xl font-bold text-teal-700">$1</h1>')
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-teal-600">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="overflow-x-auto p-3 my-2 bg-gray-100 rounded-lg"><code class="text-sm">$1</code></pre>')
      .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 text-sm bg-gray-100 rounded">$1</code>')
      // Lists
      .replace(/^\- (.*$)/gm, '<li class="mb-1 ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="mb-1 ml-4">$1</li>')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-2">')
      .replace(/\n/g, '<br>')

    return `<div class="max-w-none prose prose-sm"><p class="mb-2">${html}</p></div>`;
  };

  return (
    <div 
      className="text-sm leading-relaxed sm:text-base"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

// Internal Custom Toggle Switch (replacement for react-switch)
interface CustomToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const CustomToggle: React.FC<CustomToggleProps> = ({ checked, onChange, disabled = false }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
        checked ? 'bg-teal-600' : 'bg-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

// Internal Custom Tooltip Component (replacement for react-tooltip)
const CustomTooltip = ({ children, content, position = 'top' }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="inline-block relative">
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>
      {visible && (
        <div className={`absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap transform -translate-x-1/2 ${
          position === 'top' ? 'bottom-full mb-2 left-1/2' : 'top-full mt-2 left-1/2'
        }`}>
          {content}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 left-1/2 -translate-x-1/2 ${
            position === 'top' ? 'top-full -mt-1' : 'bottom-full -mb-1'
          }`} />
        </div>
      )}
    </div>
  );
};

// Internal Button Component (with framer-motion animations)
const Button = React.forwardRef(({ className = '', variant = 'default', size = 'default', children, ...props }, ref) => {
  const baseStyle = "inline-flex items-center justify-center text-sm font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-lg"
  const variants = {
    default: "bg-teal-600 text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-sm hover:shadow-md",
    ghost: "text-teal-600 hover:bg-teal-50 hover:text-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2",
    destructive: "bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm hover:shadow-md",
  }
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 py-1 text-xs",
    lg: "h-12 px-6 py-3 text-base",
  }

  return (
    <motion.button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      ref={ref}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  )
})

Button.displayName = 'Button'

// Internal Input Component (with framer-motion animations)
const Input = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <motion.input
      className={`flex px-4 py-2 w-full h-12 text-sm bg-white rounded-xl border-2 border-gray-200 transition-colors duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${className}`}
      ref={ref}
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileFocus={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    />
  )
})

Input.displayName = 'Input'

// Internal TypewriterEffect Component
const TypewriterEffect = ({ content, onComplete }) => {
  const [displayedContent, setDisplayedContent] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(prevContent => prevContent + content[currentIndex])
        setCurrentIndex(prevIndex => prevIndex + 1)
      }, 25) // Adjust typing speed here
      return () => clearTimeout(timer)
    } else {
      onComplete()
    }
  }, [content, currentIndex, onComplete])

  return <SimpleMarkdownRenderer content={displayedContent} />
}

// Internal ThinkingIndicator Component (with framer-motion animations)
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
        <svg className="mr-3 -ml-1 w-5 h-5 text-teal-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm sm:text-base">Thinking...</span>
      </motion.div>
    </div>
  </motion.div>
)

// Internal ChatMessages Component (with framer-motion animations)
const ChatMessages = ({ messages, isLoading, handleCompletionCelebration }) => {
  return (
    <motion.div 
      className="overflow-y-auto flex-1 p-4 space-y-4 sm:p-6"
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
              className={`max-w-[85%] p-3 sm:p-4 rounded-2xl shadow-sm ${
                message.sender === 'user'
                  ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white'
                  : 'bg-white text-gray-800 border border-teal-100 shadow-sm'
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {message.sender === 'ai' ? (
                <TypewriterEffect content={message.text} onComplete={handleCompletionCelebration} />
              ) : (
                <p className="text-sm leading-relaxed sm:text-base">{message.text}</p>
              )}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

// Internal ChatInput Component (with framer-motion animations)
const ChatInput = ({ 
  input, 
  setInput, 
  handleSendMessage, 
  isLoading, 
  autoSpeak, 
  setAutoSpeak, 
  predefinedQuestions, 
  speaking, 
  cancel,
  listening,
  toggleListening 
}) => {
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.div 
      className="p-4 bg-white rounded-b-2xl border-t border-teal-100 sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      {/* Input Row */}
      <div className="flex mb-4 space-x-3">
        <div className="relative flex-1">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about your career path..."
            className="pr-12 w-full text-gray-800 bg-teal-50 border-teal-200 placeholder:text-gray-500"
            disabled={isLoading}
          />
          
          {/* Voice Input Button */}
          {toggleListening && (
            <CustomTooltip content={listening ? "Stop listening" : "Start voice input"}>
              <Button
                type="button"
                onClick={toggleListening}
                disabled={isLoading}
                variant="ghost"
                size="sm"
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg ${
                  listening 
                    ? 'text-red-600 animate-pulse hover:bg-red-50' 
                    : 'text-teal-600 hover:bg-teal-50'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-4 h-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
                  />
                </svg>
              </Button>
            </CustomTooltip>
          )}
        </div>
        
        {/* Send Button */}
        <CustomTooltip content="Send message">
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className={`px-4 py-2 transition-all duration-200 ${
              isLoading || !input.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                  fill="none"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            )}
          </Button>
        </CustomTooltip>
      </div>
      
      {/* Controls Row */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="mr-3 text-sm font-medium text-gray-600">Auto-speak:</span>
            <CustomToggle
              onChange={setAutoSpeak}
              checked={autoSpeak}
              disabled={isLoading}
            />
          </div>
          
          {listening && (
            <div className="flex items-center text-sm text-red-600 animate-pulse">
              <div className="mr-2 w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
              Listening...
            </div>
          )}
        </div>
        
        {speaking && (
          <Button 
            onClick={cancel} 
            variant="destructive" 
            size="sm" 
            className="flex items-center space-x-2 text-white"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
            <span>Stop Speaking</span>
          </Button>
        )}
      </div>
      
      {/* Predefined Questions */}
      {predefinedQuestions && predefinedQuestions.length > 0 && (
        <motion.div 
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {predefinedQuestions.map((question, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => setInput(question)}
              disabled={isLoading}
              className="px-3 py-1 text-xs rounded-full border border-teal-200 transition-colors duration-200 hover:bg-teal-50 hover:border-teal-300 disabled:opacity-50"
            >
              {question}
            </Button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

// Main ChatBot Component (with framer-motion animations)
const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

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

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && !isAnimating) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [isAnimating])

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && showWelcomeMessage) {
      const timer = setTimeout(() => {
        setShowWelcomeMessage(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, showWelcomeMessage, setShowWelcomeMessage])

  const handleToggle = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true)
      setIsOpen(!isOpen)
      setTimeout(() => setIsAnimating(false), 500)
    }
  }, [isOpen, isAnimating])

  const handleExpand = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true)
      setIsExpanded(!isExpanded)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }, [isExpanded, isAnimating])

  const handleClearWithConfirm = useCallback(() => {
    if (messages.length > 0 && !isLoading) {
      if (window.confirm('Are you sure you want to clear the chat history?')) {
        handleClearChat()
      }
    }
  }, [messages.length, isLoading, handleClearChat])

  return (
    <>
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>

      <div className="fixed right-4 bottom-4 z-50">
        {isOpen && (
          <div
            className={`flex overflow-hidden flex-col bg-white rounded-2xl border border-teal-100 shadow-2xl animate-scaleIn transition-all duration-300 ${
              isExpanded ? 'w-[min(95vw,700px)] h-[min(90vh,800px)]':'w-[min(90vw,450px)] h-[min(80vh,700px)]'}`}
            style={{
              boxShadow: '0 20px 25px -5px rgba(13, 148, 136, 0.3), 0 10px 10px -5px rgba(13, 148, 136, 0.2)',
            }}
            ref={chatContainerRef}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-t-2xl transition-all duration-300 cursor-move sm:p-5 hover:from-teal-700 hover:to-teal-800">
              <div className="flex items-center space-x-3">
                <div className="flex justify-center items-center w-10 h-10 text-base font-medium text-teal-700 bg-white rounded-xl shadow-sm transition-transform duration-200 sm:w-12 sm:h-12 sm:text-lg hover:scale-105">
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearWithConfirm} 
                    disabled={isLoading || messages.length === 0}
                    className="p-2 text-white rounded-lg transition-colors duration-200 hover:text-teal-700 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </CustomTooltip>
                
                <CustomTooltip content={isExpanded ? "Minimize chat" : "Expand chat"}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleExpand} 
                    disabled={isAnimating}
                    className="p-2 text-white rounded-lg transition-colors duration-200 hover:text-teal-700 hover:bg-white/20 disabled:opacity-50"
                  >
                    {isExpanded ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </Button>
                </CustomTooltip>
                
                <CustomTooltip content="Close chat">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleToggle} 
                    disabled={isAnimating}
                    className="p-2 text-white rounded-lg transition-colors duration-200 hover:text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </CustomTooltip>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="overflow-hidden flex-1 bg-gradient-to-b to-white from-teal-50/30">
              <ChatMessages
                messages={messages}
                isLoading={isLoading}
                handleCompletionCelebration={handleCompletionCelebration}
              />
              {isLoading && <ThinkingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <ChatInput
              input={input}
              setInput={setInput}
              handleSendMessage={handleSendMessage}
              isLoading={isLoading}
              autoSpeak={autoSpeak}
              setAutoSpeak={setAutoSpeak}
              predefinedQuestions={predefinedQuestions || []}
              speaking={speaking}
              cancel={cancel}
              listening={listening}
              toggleListening={toggleListening}
            />
          </div>
        )}

        {/* Chat Toggle Button */}
        {!isOpen && (
          <CustomTooltip content="Open PathFinder AI Chat">
            <button
              onClick={handleToggle}
              disabled={isAnimating}
              className="p-4 text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-full shadow-lg transition-all duration-300 hover:from-teal-700 hover:to-teal-800 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-scaleIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>
          </CustomTooltip>
        )}
      </div>
    </>
  )
}

export default ChatBot