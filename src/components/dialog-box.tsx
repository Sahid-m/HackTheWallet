"use client"

import { useState, useEffect } from "react"

interface DialogBoxProps {
  message: string
  speaker: string
  isLoading: boolean
}

export default function DialogBox({ message, speaker, isLoading }: DialogBoxProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setDisplayedText("")
    setCurrentIndex(0)
  }, [message])

  useEffect(() => {
    if (currentIndex < message.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + message[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 30) // Speed of text appearance

      return () => clearTimeout(timer)
    }
  }, [currentIndex, message])

  return (
    <div className="bg-gray-800 border-4 border-gray-600 rounded-t-lg p-4 text-white font-pixel">
      <div className="bg-blue-900 px-4 py-1 rounded-md inline-block mb-2">{speaker}</div>
      <div className="min-h-[80px] p-2 bg-gray-700 rounded-md">
        {displayedText}
        {isLoading && currentIndex >= message.length && <span className="animate-pulse">▋</span>}
        {!isLoading && currentIndex < message.length && <span className="animate-pulse">▋</span>}
      </div>
    </div>
  )
}
