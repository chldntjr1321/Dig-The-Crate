import { useState, useRef } from 'react'
import type { Collection } from '../../types'
import useDeleteCollection from '../../hooks/useDeleteCollection'
import DeleteConfirmModal from './DeleteConfirmModal'
import AlbumDetailModal from '../AlbumDetailModal'

interface AlbumCardProps {
  album: Collection
  onError: (message: string) => void
}

const AlbumCard = ({ album, onError }: AlbumCardProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [cardRect, setCardRect] = useState<DOMRect | null>(null)
  const coverButtonRef = useRef<HTMLButtonElement>(null)
  const { deleteCollection, isPending } = useDeleteCollection(onError)

  const handleConfirm = () => {
    deleteCollection(album.id)
    setIsDeleteModalOpen(false)
  }

  const handleOpenDetail = () => {
    if (coverButtonRef.current) {
      setCardRect(coverButtonRef.current.getBoundingClientRect())
    }
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setCardRect(null)
  }

  return (
    <div className="album-card-wrapper relative group">
      {/* 앨범 커버 */}
      <button
        ref={coverButtonRef}
        onClick={handleOpenDetail}
        className="album-card relative aspect-square w-full overflow-hidden bg-page shadow-[0_12px_24px_rgba(0,0,0,0.4)] cursor-pointer"
        aria-label={`${album.album_name} 상세 보기`}
      >
        <img
          src={album.cover_url}
          alt={`${album.album_name} - ${album.artist_name}`}
          className="w-full h-full object-cover"
        />

        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
          {/* X 버튼(형제 요소)이 이 자리를 차지하므로 레이아웃 유지를 위한 spacer */}
          <div />

          {/* 하단 텍스트 */}
          <div>
            <p className="text-secondary text-[12px] font-medium uppercase tracking-wider mb-1 truncate">
              {album.artist_name}
            </p>
            <p className="text-primary text-[14px] font-semibold truncate">
              {album.album_name}
            </p>
          </div>
        </div>
      </button>

      {/* X 버튼 (상단 우측) — 커버 버튼과 형제 요소로 분리해 버튼 중첩을 피함 */}
      <button
        onClick={() => setIsDeleteModalOpen(true)}
        disabled={isPending}
        className="group/btn absolute top-4 right-4 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer disabled:cursor-not-allowed"
        aria-label="앨범 삭제"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
          className="text-white group-hover/btn:text-accent transition-colors"
        >
          <path
            d="M1 1L9 9M9 1L1 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* 받침대 메탈 라인 — 카드보다 좌우 8px씩 더 길게 */}
      <div className="mt-1 h-0.5 bg-metal group-hover:bg-accent transition-colors duration-300 w-[calc(100%+16px)] -ml-2" />

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          onConfirm={handleConfirm}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}

      {isDetailOpen && cardRect && (
        <AlbumDetailModal
          coverUrl={album.cover_url}
          albumName={album.album_name}
          artistName={album.artist_name}
          tracklist={album.tracklist ?? []}
          isTracklistLoading={false}
          triggerRect={cardRect}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  )
}

export default AlbumCard
