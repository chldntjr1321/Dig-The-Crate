import { useState, useEffect, type ReactNode } from 'react'
import type { Track } from '@/types'
import CloseIcon from '@/components/ui/CloseIcon'
import TrackList from '@/components/ui/TrackList'
import useAlbumColor from '@/hooks/useAlbumColor'

const MODAL_WIDTH = 480

interface AlbumDetailModalProps {
  coverUrl: string
  albumName: string
  artistName: string
  tracklist: Track[]
  isTracklistLoading: boolean
  triggerRect: DOMRect
  onClose: () => void
  footer?: ReactNode
}

const AlbumDetailModal = ({
  coverUrl,
  albumName,
  artistName,
  tracklist,
  isTracklistLoading,
  triggerRect,
  onClose,
  footer,
}: AlbumDetailModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const { color } = useAlbumColor(coverUrl)

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsAnimating(true))
    })
  }, [])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(onClose, 400)
  }

  const getInitialTransform = () => {
    const dx = triggerRect.left + triggerRect.width / 2 - window.innerWidth / 2
    const dy = triggerRect.top + triggerRect.height / 2 - window.innerHeight / 2
    const scale = triggerRect.width / MODAL_WIDTH
    return `translate(${dx}px, ${dy}px) scale(${scale})`
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-opacity duration-[400ms]"
      style={{ opacity: isAnimating ? 1 : 0 }}
      onClick={handleClose}
    >
      <div
        className="relative rounded-lg overflow-hidden flex flex-col bg-search-primary"
        style={{
          width: MODAL_WIDTH,
          transform: isAnimating ? 'translate(0, 0) scale(1)' : getInitialTransform(),
          transition: 'transform 0.4s ease, opacity 0.4s ease',
          opacity: isAnimating ? 1 : 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 대표색 그라데이션 레이어 — 기본 배경(bg-search-primary) 위에 겹쳐두고,
            색상 추출이 끝나면 opacity로 서서히 페이드인 (배경이 갑자기 바뀌는 느낌 방지).
            앨범마다 달라지는 런타임 계산값이라 디자인 토큰으로 표현할 수 없어 하드코딩 색상 금지 규칙의 예외로 둠 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: color
              ? `linear-gradient(180deg, rgb(${color.r}, ${color.g}, ${color.b}) 0%, #1C1208 65%)`
              : undefined,
            opacity: color ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />

        <div className="relative flex flex-col">
          <div className="flex justify-end p-4">
            <button
              onClick={handleClose}
              className="text-secondary hover:text-primary cursor-pointer"
              aria-label="닫기"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-center px-6">
            <img
              src={coverUrl}
              alt={`${albumName} 커버`}
              className="w-40 h-40 object-cover rounded-sm"
            />
          </div>

          <div className="px-6 pt-4 text-center">
            <p className="text-primary text-base font-semibold">{albumName}</p>
            <p className="text-secondary text-sm mt-1">{artistName}</p>
          </div>

          <div className="mx-6 mt-4 border-t border-border" />

          <div className="overflow-y-auto max-h-64 px-6 py-2">
            <TrackList tracklist={tracklist} isLoading={isTracklistLoading} />
          </div>

          {footer}
        </div>
      </div>
    </div>
  )
}

export default AlbumDetailModal
