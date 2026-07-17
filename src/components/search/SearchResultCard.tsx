import { useState, useRef } from 'react'
import type { SearchResult } from '@/types'
import useReleaseDetail from '@/hooks/useReleaseDetail'
import useAddCollection from '@/hooks/useAddCollection'
import useDeleteCollection from '@/hooks/useDeleteCollection'
import AlbumDetailModal from '@/components/AlbumDetailModal'

interface SearchResultCardProps {
  result: SearchResult
  collectionId?: string
  onError: (message: string) => void
}

const SearchResultCard = ({ result, collectionId, onError }: SearchResultCardProps) => {
  const isAdded = Boolean(collectionId)
  const { addCollection, isPending: isAdding } = useAddCollection(onError)
  const { deleteCollection, isPending: isDeleting } = useDeleteCollection(onError)
  const isPending = isAdding || isDeleting

  const handleToggle = () => {
    if (isAdded) {
      deleteCollection(collectionId!)
    } else {
      addCollection(result)
    }
  }

  const [isOpen, setIsOpen] = useState(false)
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
  }

  const handleClose = () => {
    setIsOpen(false)
    setCardRect(null)
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

      {isOpen && cardRect && (
        <AlbumDetailModal
          coverUrl={result.cover_url}
          albumName={result.album_name}
          artistName={result.artist_name}
          tracklist={tracklist}
          isTracklistLoading={isTracklistLoading}
          triggerRect={cardRect}
          onClose={handleClose}
          footer={
            <button
              onClick={handleToggle}
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
          }
        />
      )}
    </>
  )
}

export default SearchResultCard
