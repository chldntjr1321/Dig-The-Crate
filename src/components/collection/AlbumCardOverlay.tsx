import AlbumInfo from './AlbumInfo'
import MusicPlayButton from './MusicPlayButton'

interface AlbumCardOverlayProps {
  artistName: string
  albumName: string
  isDeletePending: boolean
  onDeleteClick: () => void
}

const AlbumCardOverlay = ({
  artistName,
  albumName,
  isDeletePending,
  onDeleteClick,
}: AlbumCardOverlayProps) => {
  return (
    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
      <div className="flex justify-end">
        <button
          onClick={onDeleteClick}
          disabled={isDeletePending}
          className="group/btn pointer-events-auto w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
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

      <div className="flex items-end justify-between gap-2">
        <AlbumInfo artistName={artistName} albumName={albumName} />
        <MusicPlayButton ariaLabel="미리듣기 재생" />
      </div>
    </div>
  )
}

export default AlbumCardOverlay
