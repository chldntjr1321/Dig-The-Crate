import { useState, useEffect, useRef } from 'react'

const useDelayedLoading = (isLoading: boolean, delay = 200, minDuration = 300) => {
  const [showSkeleton, setShowSkeleton] = useState(false)
  const shownAtRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isLoading) {
      if (shownAtRef.current === null) return

      const elapsed = Date.now() - shownAtRef.current
      const remaining = Math.max(0, minDuration - elapsed)

      const timer = setTimeout(() => {
        setShowSkeleton(false)
        shownAtRef.current = null
      }, remaining)

      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      setShowSkeleton(true)
      shownAtRef.current = Date.now()
    }, delay)

    return () => clearTimeout(timer)
  }, [isLoading, delay, minDuration])

  return showSkeleton
}

export default useDelayedLoading
