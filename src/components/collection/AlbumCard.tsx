import { useState, useRef, useEffect } from 'react'
import type { Collection } from '../../types'
import useDeleteCollection from '../../hooks/useDeleteCollection'
import useAlbumPreview from '../../hooks/useAlbumPreview'
import { usePlayer } from '../../hooks/usePlayer'
import DeleteConfirmModal from './DeleteConfirmModal'
import AlbumCardOverlay from './AlbumCardOverlay'
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
  const { play } = usePlayer()
  const [isPreviewEnabled, setIsPreviewEnabled] = useState(false)
  const { previewUrl, isLoading: isPreviewLoading } = useAlbumPreview(
    album.artist_name,
    album.album_name,
    isPreviewEnabled,
  )

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

  const handlePlayClick = () => {
    // 이미 조회된 적 있으면(재클릭) 캐시된 previewUrl을 바로 사용, 아니면 null로 먼저 열고 조회 시작
    setIsPreviewEnabled(true)
    play({
      coverUrl: album.cover_url,
      albumName: album.album_name,
      artistName: album.artist_name,
      previewUrl: isPreviewEnabled ? previewUrl : null,
    })
  }

  // previewUrl 조회가 끝나면 Context의 currentAlbum을 실제 previewUrl로 갱신
  useEffect(() => {
    if (isPreviewEnabled && !isPreviewLoading) {
      play({
        coverUrl: album.cover_url,
        albumName: album.album_name,
        artistName: album.artist_name,
        previewUrl,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewUrl, isPreviewLoading])

  return (
    <div className="album-card-wrapper relative group">
      {/* 커버 + 오버레이를 감싸는 별도 relative 컨테이너 — 메탈 라인 등 바깥 요소 높이가 섞이지 않도록 커버 크기에 정확히 맞춤 */}
      <div className="album-card relative aspect-square w-full overflow-hidden rounded-sm bg-page shadow-[0_12px_24px_rgba(0,0,0,0.4)]">
        <button
          ref={coverButtonRef}
          onClick={handleOpenDetail}
          className="absolute inset-0 w-full h-full cursor-pointer"
          aria-label={`${album.album_name} 상세 보기`}
        >
          <img
            src={album.cover_url}
            alt={`${album.album_name} - ${album.artist_name}`}
            className="w-full h-full object-cover"
          />
        </button>

        {/* 호버 오버레이 — 커버 버튼과 형제 요소로 분리(X/재생 버튼이 커버 <button> 안에 중첩되지 않도록) */}
        <AlbumCardOverlay
          artistName={album.artist_name}
          albumName={album.album_name}
          isDeletePending={isPending}
          onDeleteClick={() => setIsDeleteModalOpen(true)}
          onPlayClick={handlePlayClick}
        />
      </div>

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
