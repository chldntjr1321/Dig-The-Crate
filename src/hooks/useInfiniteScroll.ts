import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  onIntersect: () => void
  enabled: boolean
}

// 반환된 ref를 리스트 하단 sentinel 엘리먼트에 붙이면,
// 그 엘리먼트가 화면에 보이는 순간 onIntersect가 호출된다.
const useInfiniteScroll = <T extends HTMLElement>({
  onIntersect,
  enabled,
}: UseInfiniteScrollOptions) => {
  const targetRef = useRef<T>(null)

  useEffect(() => {
    const target = targetRef.current
    if (!enabled || !target) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onIntersect()
      }
    })

    observer.observe(target)

    return () => observer.disconnect()
  }, [enabled, onIntersect])

  return targetRef
}

export default useInfiniteScroll
