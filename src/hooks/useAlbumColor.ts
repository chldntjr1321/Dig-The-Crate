import { useEffect, useState } from 'react'
import type { RgbColor } from '../types'

// 캔버스에 그릴 최대 한 변 길이(px). 원본이 더 크면 이 크기로 축소해서 연산량을 제한
// 값이 클수록 원본 디테일을 더 많이 보존하지만(더 정확한 색 분석), 픽셀 수가 늘어 연산량도 커짐
const SAMPLE_SIZE = 500

// Discogs 이미지 CDN이 CORS 허용 헤더를 보내지 않아 캔버스에서 픽셀을 읽을 수 없음.
// wsrv.nl(무료 공개 이미지 프록시)을 거쳐 access-control-allow-origin 헤더를 붙여서 받아옴.
// 화면에 보이는 <img>는 이 프록시를 거치지 않고 원본 URL을 그대로 사용함(분석용 캔버스에만 적용)
const CORS_PROXY_BASE = 'https://wsrv.nl/?url='

const useAlbumColor = (coverUrl: string) => {
  const [colors, setColors] = useState<RgbColor[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // coverUrl이 바뀌면(다른 앨범) 렌더 중 값 비교로 이전 결과를 리셋
  // (useEffect 안에서 직접 setState하면 react-hooks/set-state-in-effect에 걸림)
  const [trackedCoverUrl, setTrackedCoverUrl] = useState(coverUrl)
  if (coverUrl !== trackedCoverUrl) {
    setTrackedCoverUrl(coverUrl)
    setColors(null)
    setIsLoading(true)
  }

  useEffect(() => {
    let cancelled = false
    let worker: Worker | null = null

    const image = new Image()
    image.crossOrigin = 'anonymous'

    image.onload = () => {
      if (cancelled) {
        return
      }

      let imageData: ImageData
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
        imageData = ctx.getImageData(0, 0, width, height)
      } catch {
        setColors(null)
        setIsLoading(false)
        return
      }

      // 무거운 대표색 계산(Median Cut)은 Worker에 위임해 메인 스레드를 막지 않음
      worker = new Worker(new URL('../workers/colorExtractor.worker.ts', import.meta.url), {
        type: 'module',
      })

      worker.onmessage = (event: MessageEvent<RgbColor[]>) => {
        if (!cancelled) {
          setColors(event.data)
          setIsLoading(false)
        }
        worker?.terminate()
      }

      worker.onerror = () => {
        if (!cancelled) {
          setColors(null)
          setIsLoading(false)
        }
        worker?.terminate()
      }

      worker.postMessage(imageData)
    }

    image.onerror = () => {
      if (!cancelled) {
        setIsLoading(false)
      }
    }

    image.src = `${CORS_PROXY_BASE}${encodeURIComponent(coverUrl)}`

    return () => {
      cancelled = true
      worker?.terminate()
    }
  }, [coverUrl])

  return { colors, isLoading }
}

export default useAlbumColor
