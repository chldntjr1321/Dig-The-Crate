import { useState, useRef } from 'react'
import type { SearchResult } from '@/types'
import useReleaseDetail from '@/hooks/useReleaseDetail'
import CloseIcon from '@/components/ui/CloseIcon'
import TrackList from './TrackList'

const MODAL_WIDTH = 480

interface SearchResultCardProps {
  result: SearchResult
  isAdded: boolean
  isPending?: boolean
  onAdd: () => void
  onRemove: () => void
}

const SearchResultCard = ({
  result,
  isAdded,
  isPending = false,
  onAdd,
  onRemove,
}: SearchResultCardProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [cardRect, setCardRect] = useState<DOMRect | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { tracklist, isLoading: isTracklistLoading } = useReleaseDetail(
    result.discogs_id,
    isOpen,
  )

  const handleOpen = () => {
    if (buttonRef.current) {
      setCardRect(buttonRef.current.getBoundingClientRect())
    }
    setIsOpen(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsAnimating(true))
    })
  }

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsOpen(false)
      setCardRect(null)
    }, 400)
  }

  const getInitialTransform = () => {
    if (!cardRect) return 'translate(0, 0) scale(0.1)'
    const dx = cardRect.left + cardRect.width / 2 - window.innerWidth / 2
    const dy = cardRect.top + cardRect.height / 2 - window.innerHeight / 2
    const scale = cardRect.width / MODAL_WIDTH
    return `translate(${dx}px, ${dy}px) scale(${scale})`
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <button
          ref={buttonRef}
          className="w-full aspect-square cursor-pointer overflow-hidden rounded-sm"
          onClick={handleOpen}
          aria-label={`${result.album_name} 상세 보기`}
        >
          <img
            src={result.cover_url}
            alt={`${result.album_name} 커버`}
            className="w-full h-full object-cover"
          />
        </button>
        <div>
          <p className="text-search-primary text-sm font-medium truncate">
            {result.album_name}
          </p>
          <p className="text-search-secondary text-xs truncate">
            {result.artist_name}
          </p>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-opacity duration-[400ms]"
          style={{ opacity: isAnimating ? 1 : 0 }}
          onClick={handleClose}
        >
          <div
            className="rounded-lg overflow-hidden flex flex-col bg-search-primary"
            style={{
              width: MODAL_WIDTH,
              transform: isAnimating
                ? 'translate(0, 0) scale(1)'
                : getInitialTransform(),
              transition: 'transform 0.4s ease, opacity 0.4s ease',
              opacity: isAnimating ? 1 : 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
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
                src={result.cover_url}
                alt={`${result.album_name} 커버`}
                className="w-40 h-40 object-cover rounded-sm"
              />
            </div>

            <div className="px-6 pt-4 text-center">
              <p className="text-primary text-base font-semibold">
                {result.album_name}
              </p>
              <p className="text-secondary text-sm mt-1">
                {result.artist_name}
              </p>
            </div>

            <div className="mx-6 mt-4 border-t border-border" />

            <div className="overflow-y-auto max-h-64 px-6 py-2">
              <TrackList tracklist={tracklist} isLoading={isTracklistLoading} />
            </div>

            {/* 컬렉션 추가/삭제 버튼 */}
            <button
              onClick={isAdded ? onRemove : onAdd}
              disabled={isPending}
              className={[
                'py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors',
                isPending
                  ? 'bg-disabled text-primary cursor-not-allowed'
                  : isAdded
                    ? 'bg-disabled text-primary cursor-pointer hover:opacity-80'
                    : 'bg-accent hover:bg-accent-hover text-primary cursor-pointer',
              ].join(' ')}
              aria-label={isAdded ? '컬렉션에서 삭제' : '컬렉션에 추가'}
            >
              {isPending
                ? '처리 중...'
                : isAdded
                  ? '✓ 컬렉션에서 삭제'
                  : '+ 컬렉션에 추가'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default SearchResultCard
