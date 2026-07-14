import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  onClose: () => void
}

const TOAST_DURATION_MS = 3000
const FADE_DURATION_MS = 300

const Toast = ({ message, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const showTimer = requestAnimationFrame(() => setIsVisible(true))
    const hideTimer = setTimeout(() => setIsVisible(false), TOAST_DURATION_MS)
    return () => {
      cancelAnimationFrame(showTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  useEffect(() => {
    if (isVisible) return
    const removeTimer = setTimeout(onClose, FADE_DURATION_MS)
    return () => clearTimeout(removeTimer)
  }, [isVisible, onClose])

  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-50 rounded-lg bg-[#2A1208] px-4 py-3 text-sm text-primary shadow-xl transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {message}
    </div>
  )
}

export default Toast
