import { useEffect, useState, type RefObject } from 'react'
import UpIcon from '../ui/UpIcon'

interface ScrollToTopButtonProps {
  scrollContainerRef: RefObject<HTMLElement | null>
}

const SCROLL_THRESHOLD_PX = 400

const ScrollToTopButton = ({ scrollContainerRef }: ScrollToTopButtonProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      setIsVisible(container.scrollTop > SCROLL_THRESHOLD_PX)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [scrollContainerRef])

  const handleClick = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="맨 위로 이동"
      className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary shadow-xl transition-opacity duration-200 ease-in-out hover:bg-accent-hover cursor-pointer ${
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <UpIcon className="h-5 w-5" />
    </button>
  )
}

export default ScrollToTopButton
