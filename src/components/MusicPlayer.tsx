import { useState, type AnimationEvent } from 'react'
import MusicPlayButton from './collection/MusicPlayButton'
import CloseIcon from './ui/CloseIcon'
import { usePlayer } from '../hooks/usePlayer'

const MusicPlayer = () => {
  const { currentAlbum, closePlayer } = usePlayer()
  const [isClosing, setIsClosing] = useState(false)
  const [trackedAlbum, setTrackedAlbum] = useState(currentAlbum)

  // 새 앨범이 재생되면(currentAlbum이 바뀌면) 닫힘 애니메이션 상태를 리셋
  if (currentAlbum !== trackedAlbum) {
    setTrackedAlbum(currentAlbum)
    setIsClosing(false)
  }

  if (!currentAlbum) {
    return null
  }

  const { coverUrl, albumName } = currentAlbum

  const handleClose = () => {
    setIsClosing(true)
  }

  // player-exit 애니메이션이 실제로 끝난 시점에만 언마운트(closePlayer) 실행
  const handleAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === 'player-slide-down') {
      closePlayer()
    }
  }

  return (
    <div
      onAnimationEnd={handleAnimationEnd}
      className={`${isClosing ? 'player-exit' : 'player-enter'} fixed bottom-6 left-6 z-40 w-60 bg-[#1C1208] border border-border rounded-xl shadow-xl flex flex-col gap-2 px-3 py-3`}
    >
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-secondary hover:text-primary cursor-pointer"
        aria-label="닫기"
      >
        <CloseIcon className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-3">
        <img
          src={coverUrl}
          alt={`${albumName} 커버`}
          className="w-12 h-12 rounded-full object-cover shrink-0"
        />
        <div className="min-w-0 pr-4">
          <p className="text-muted text-[10px] uppercase tracking-wider">Now Playing</p>
          <div className="overflow-hidden whitespace-nowrap">
            <div className="marquee-track flex w-max">
              <p className="text-primary text-[12px] font-medium pr-8">{albumName}</p>
              <p className="text-primary text-[12px] font-medium pr-8" aria-hidden="true">
                {albumName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 진행바 (목업 — 실제 재생 위치 연동은 이후 단계) */}
      <div className="h-1 w-full rounded-full bg-border overflow-hidden mt-1">
        <div className="h-full w-1/3 bg-accent" />
      </div>

      {/* 컨트롤러 */}
      <div className="flex items-center justify-center gap-4">
        <button className="text-secondary hover:text-primary cursor-pointer" aria-label="이전 곡">
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <rect x="0" y="0" width="1.5" height="10" fill="currentColor" />
            <path d="M9 1L2 5L9 9Z" fill="currentColor" />
          </svg>
        </button>

        <MusicPlayButton ariaLabel="재생/일시정지" size="sm" />

        <button className="text-secondary hover:text-primary cursor-pointer" aria-label="다음 곡">
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M1 1L8 5L1 9Z" fill="currentColor" />
            <rect x="8.5" y="0" width="1.5" height="10" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default MusicPlayer
