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

    // 닫기 버튼 등 특정 요소로 초기 포커스가 가면, 그 요소에 스크립트 포커스는
    // 조용히 적용되고 실제 포커스 링은 이후 첫 키보드 입력(예: Esc) 시점에야 나타나
    // "Esc 누르면 갑자기 그 요소로 옮겨간 것"처럼 보이는 문제가 있음.
    // 컨테이너 자체로 포커스를 줘서 이런 오해를 방지
    container.focus()

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
