import { useEffect, useState } from 'react'
import { extractDominantColor } from '../utils/extractDominantColor'
import type { RgbColor } from '../types'

// 캔버스에 그릴 한 변 길이(px). 원본 해상도와 무관하게 이 크기로 맞춰서 그림
// 값이 클수록 색 분석이 더 정밀해지지만, 픽셀 수가 늘어 연산량도 커짐
const SAMPLE_SIZE = 1500

// Discogs 이미지 CDN이 CORS 허용 헤더를 보내지 않아 캔버스에서 픽셀을 읽을 수 없음.
// wsrv.nl(무료 공개 이미지 프록시)을 거쳐 access-control-allow-origin 헤더를 붙여서 받아옴.
// 화면에 보이는 <img>는 이 프록시를 거치지 않고 원본 URL을 그대로 사용함(분석용 캔버스에만 적용)
const CORS_PROXY_BASE = 'https://wsrv.nl/?url='

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
        // 원본보다 작아도 SAMPLE_SIZE까지 확대해서 그림 (Discogs 커버는 보통 500~600px 수준이라
        // 축소만 허용하면 이 값을 올려도 실제 분석 픽셀 수가 늘지 않음)
        const scale = SAMPLE_SIZE / Math.max(image.width, image.height)
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

    image.src = `${CORS_PROXY_BASE}${encodeURIComponent(coverUrl)}`

    return () => {
      cancelled = true
    }
  }, [coverUrl])

  return { color, isLoading }
}

export default useAlbumColor
