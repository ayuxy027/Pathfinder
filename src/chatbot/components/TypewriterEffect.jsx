import React, { useState, useEffect } from 'react'
import MarkdownRenderer from '../MarkdownRenderer'

const TypewriterEffect = ({ content, onComplete }) => {
  const [displayedContent, setDisplayedContent] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(prevContent => prevContent + content[currentIndex])
        setCurrentIndex(prevIndex => prevIndex + 1)
      }, 60) // Adjust typing speed here
      return () => clearTimeout(timer)
    } else {
      onComplete()
    }
  }, [content, currentIndex, onComplete])

  return <MarkdownRenderer content={displayedContent} />
}

export default TypewriterEffect