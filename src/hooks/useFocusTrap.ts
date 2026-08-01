import { useEffect, type RefObject } from 'react'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

// 모달이 열려있는 동안 Esc로 닫기, Tab/Shift+Tab 포커스 트랩, 닫힐 때 이전 포커스 복원을 담당
const useFocusTrap = (
  containerRef: RefObject<HTMLElement | null>,
  onClose: () => void,
) => {
  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const previouslyFocused = document.activeElement as HTMLElement | null

    const getFocusableElements = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))

    const focusables = getFocusableElements()
    const initialFocusTarget = focusables[0] ?? container
    initialFocusTarget.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key !== 'Tab') {
        return
      }

      const elements = getFocusableElements()
      if (elements.length === 0) {
        return
      }

      const first = elements[0]
      const last = elements[elements.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export default useFocusTrap
