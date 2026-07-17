import { useEffect, useState } from 'react'
import { extractDominantColor } from '../utils/extractDominantColor'
import type { RgbColor } from '../types'

// 캔버스에 그릴 최대 한 변 길이(px). 원본이 더 크면 이 크기로 축소해서 연산량을 제한
const SAMPLE_SIZE = 200

const useAlbumColor = (coverUrl: string) => {
  const [color, setColor] = useState<RgbColor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // coverUrl이 바뀌면(다른 앨범) 렌더 중 값 비교로 이전 결과를 리셋
  // (useEffect 안에서 직접 setState하면 react-hooks/set-state-in-effect에 걸림)
  const [trackedCoverUrl, setTrackedCoverUrl] = useState(coverUrl)
  if (coverUrl !== trackedCoverUrl) {
    setTrackedCoverUrl(coverUrl)
    setColor(null)
    setIsLoading(true)
  }

  useEffect(() => {
    let cancelled = false

    const image = new Image()
    image.crossOrigin = 'anonymous'

    image.onload = () => {
      if (cancelled) {
        return
      }
      try {
        const scale = Math.min(1, SAMPLE_SIZE / Math.max(image.width, image.height))
        const width = Math.max(1, Math.round(image.width * scale))
        const height = Math.max(1, Math.round(image.height * scale))

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          setIsLoading(false)
          return
        }

        ctx.drawImage(image, 0, 0, width, height)
        // 외부 이미지가 CORS를 허용하지 않으면 캔버스가 tainted 상태가 되어
        // getImageData 호출 시 SecurityError가 발생함 — catch에서 조용히 실패 처리
        const imageData = ctx.getImageData(0, 0, width, height)
        setColor(extractDominantColor(imageData))
      } catch {
        setColor(null)
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    image.onerror = () => {
      if (!cancelled) {
        setIsLoading(false)
      }
    }

    image.src = coverUrl

    return () => {
      cancelled = true
    }
  }, [coverUrl])

  return { color, isLoading }
}

export default useAlbumColor
