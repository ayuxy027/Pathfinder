import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { ArrowRight, Briefcase, Compass, Lightbulb, GraduationCap, Users, Target, TrendingUp, BookOpen, Laptop, Presentation, Award, Clipboard, FileText, Zap, Rocket, Brain, Sparkles} from 'lucide-react'

const dynamicWords = ["AI-Powered", "Personalized", "Future-Ready"]

export default function Component() {
  const [dynamicText, setDynamicText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const controls = useAnimation()

  const handleTyping = useCallback(() => {
    const currentWord = dynamicWords[wordIndex]
    const shouldDelete = isDeleting && dynamicText === ''
    const shouldChangeWord = !isDeleting && dynamicText === currentWord

    if (shouldDelete) {
      setIsDeleting(false)
      setWordIndex((prevIndex) => (prevIndex + 1) % dynamicWords.length)
    } else if (shouldChangeWord) {
      setIsDeleting(true)
    } else {
      setDynamicText(prevText =>
        isDeleting ? currentWord.slice(0, prevText.length - 1) : currentWord.slice(0, prevText.length + 1)
      )
    }
  }, [dynamicText, isDeleting, wordIndex])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleTyping()
    }, isDeleting ? 120 : 180)
    return () => clearTimeout(timer)
  }, [handleTyping, isDeleting])

  useEffect(() => {
    controls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    })
  }, [controls])

  return (
    <section className="relative py-0 overflow-hidden bg-white sm:py-20 lg:py-20 font-body">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              "radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(200,200,255,0.3) 100%)",
              "radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(255,200,200,0.3) 100%)",
              "radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(200,255,200,0.3) 100%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>
      <div className="relative flex flex-col items-center px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:flex-row">
        <motion.div 
          className="text-center lg:text-left lg:w-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
        >
          <motion.h1 
            className="text-4xl font-bold leading-tight text-transparent bg-proj bg-clip-text sm:text-5xl sm:leading-tight lg:leading-tight lg:text-6xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Navigate Your Career with, <br />
            <motion.span 
              className="text-transparent bg-yellow-500 bg-clip-text" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {dynamicText}
              <span className="animate-blink">|</span>
            </motion.span>
            <br />
            <span className="text-transparent bg-yellow-500 bg-clip-text">Guidance</span>
          </motion.h1>
          <motion.p 
            className="mt-4 text-xl text-transparent bg-proj bg-clip-text sm:mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Unlock your potential with our AI-powered career guidance platform.
            Discover tailored paths and seize opportunities for success.
          </motion.p>
          <motion.div 
            className="flex flex-col justify-center mt-8 space-y-4 sm:flex-row lg:justify-start sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button to="/get-started">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
        <AnimatePresence>
          {typeof window !== 'undefined' && window.innerWidth >= 640 && (
            <motion.div
              key="animations"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:w-1/2 h-[500px] mt-12 lg:mt-0 relative"
            >
              <FloatingIcon Icon={Briefcase} size={120} top="50%" left="50%" scale={[1, 1.1, 1]} rotate={[0, 5, -5, 0]} />
              <FloatingIcon Icon={Compass} size={64} top="25%" left="25%" y={[0, -20, 0]} />
              <FloatingIcon Icon={Lightbulb} size={64} top="75%" left="75%" y={[0, 20, 0]} />
              <FloatingIcon Icon={GraduationCap} size={48} top="66%" left="33%" x={[0, 30, 0]} y={[0, -30, 0]} />
              <FloatingIcon Icon={Users} size={56} top="16%" left="75%" rotate={[0, 360]} duration={10} />
              <FloatingIcon Icon={Target} size={52} top="83%" left="25%" scale={[1, 1.2, 1]} />
              <FloatingIcon Icon={TrendingUp} size={60} top="50%" left="83%" x={[0, 20, 0]} />
              <FloatingIcon Icon={BookOpen} size={44} top="75%" left="16%" y={[0, -15, 0]} duration={2} />
              <FloatingIcon Icon={Laptop} size={40} top="33%" left="66%" rotate={[0, -10, 10, 0]} duration={3} />
              <FloatingIcon Icon={Presentation} size={48} top="10%" left="40%" scale={[1, 1.15, 1]} duration={4} />
              <FloatingIcon Icon={Award} size={52} top="60%" left="10%" y={[0, 25, 0]} duration={3.5} />
              <FloatingIcon Icon={Clipboard} size={56} top="40%" left="90%" rotate={[0, -15, 15, 0]} duration={4.5} />
              <FloatingIcon Icon={FileText} size={44} top="5%" left="60%" rotate={[0, 360]} duration={8} />
              <FloatingIcon Icon={Zap} size={48} top="85%" left="45%" scale={[1, 1.1, 1]} duration={3} />
              <FloatingIcon Icon={Rocket} size={36} top="45%" left="70%" rotate={[0, -10, 10, 0]} duration={3.5} />
              <FloatingIcon Icon={Brain} size={32} top="70%" left="5%" y={[0, 20, 0]} duration={4} />
              <FloatingIcon Icon={Sparkles} size={28} top="15%" left="90%" rotate={[0, 360]} duration={9} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ParticleBackground />
    </section>
  )
}

function Button({ children, variant = "primary", className = "", to = "" }) {
  const baseClasses = "flex items-center justify-center px-6 py-3 text-base font-medium rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
  const variantClasses = variant === "primary" 
    ? "bg-proj hover:bg-proj-hover text-white" 
    : "bg-white hover:bg-gray-100 text-proj border border-proj"

  const MotionLink = motion(Link);

  return (
    <MotionLink
      to={to}
      className={`${baseClasses} ${variantClasses} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </MotionLink>
  )
}

function FloatingIcon({ Icon, size, top, left, ...motionProps }) {
  return (
    <motion.div 
      className="absolute text-proj"
      style={{ top, left }}
      animate={{
        y: [0, -10, 0],
        ...motionProps.animate
      }}
      transition={{
        duration: 5,
        ease: "easeInOut",
        times: [0, 0.5, 1],
        repeat: Infinity,
        ...motionProps.transition
      }}
    >
      <Icon size={size} />
    </motion.div>
  )
}

function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-proj opacity-20"
          style={{
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}