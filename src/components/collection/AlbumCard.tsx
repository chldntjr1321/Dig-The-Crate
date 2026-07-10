import { useState } from 'react'
import type { Collection } from '../../types'
import useDeleteCollection from '../../hooks/useDeleteCollection'
import DeleteConfirmModal from './DeleteConfirmModal'

interface AlbumCardProps {
  album: Collection
  onError: (message: string) => void
}

const AlbumCard = ({ album, onError }: AlbumCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { deleteCollection, isPending } = useDeleteCollection(onError)

  const handleConfirm = () => {
    deleteCollection(album.id)
    setIsModalOpen(false)
  }

  return (
    <div className="album-card-wrapper relative group cursor-pointer">
      {/* 앨범 커버 */}
      <div className="album-card relative aspect-square w-full overflow-hidden bg-page shadow-[0_12px_24px_rgba(0,0,0,0.4)]">
        <img
          src={album.cover_url}
          alt={`${album.album_name} - ${album.artist_name}`}
          className="w-full h-full object-cover"
        />

        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
          {/* X 버튼 (상단 우측) */}
          <div className="flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isPending}
              className="group/btn w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
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
          </div>

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
      </div>

      {/* 받침대 메탈 라인 — 카드보다 좌우 8px씩 더 길게 */}
      <div className="mt-1 h-0.5 bg-metal group-hover:bg-accent transition-colors duration-300 w-[calc(100%+16px)] -ml-2" />

      {isModalOpen && (
        <DeleteConfirmModal
          onConfirm={handleConfirm}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

export default AlbumCard
