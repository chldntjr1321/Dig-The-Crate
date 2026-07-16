import { useEffect, useRef, useState, type AnimationEvent } from 'react'
import MusicPlayButton from './collection/MusicPlayButton'
import CloseIcon from './ui/CloseIcon'
import SkeletonBox from './ui/SkeletonBox'
import Toast from './ui/Toast'
import { usePlayer } from '../hooks/usePlayer'

interface MusicPlayerProps {
  hiddenByScroll?: boolean
}

const MusicPlayer = ({ hiddenByScroll = false }: MusicPlayerProps) => {
  const { currentAlbum, closePlayer, isPlaying, togglePlay, playbackError, clearPlaybackError } =
    usePlayer()
  const [isClosing, setIsClosing] = useState(false)
  const [trackedAlbum, setTrackedAlbum] = useState(currentAlbum)
  const [progress, setProgress] = useState(0)
  const [rotation, setRotation] = useState(0)
  // 스크롤로 숨겨진 상태에서 새 앨범을 재생하면, 다음 스크롤 변화가 있기 전까지 강제로 보여줌
  const [scrollHideOverride, setScrollHideOverride] = useState(false)
  const [trackedHiddenByScroll, setTrackedHiddenByScroll] = useState(hiddenByScroll)
  const audioRef = useRef<HTMLAudioElement>(null)

  // 새 앨범이 재생되면(currentAlbum이 바뀌면) 닫힘 애니메이션 상태와 진행바를 리셋
  if (currentAlbum !== trackedAlbum) {
    setTrackedAlbum(currentAlbum)
    setIsClosing(false)
    setProgress(0)
    setScrollHideOverride(true)
  }

  // hiddenByScroll이 false로 바뀌면(스크롤을 올림) override를 해제해 다음 숨김에 대비
  if (hiddenByScroll !== trackedHiddenByScroll) {
    setTrackedHiddenByScroll(hiddenByScroll)
    if (!hiddenByScroll) {
      setScrollHideOverride(false)
    }
  }

  // isPlaying/previewUrl에 맞춰 실제 <audio> 재생 상태 동기화
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }
    // previewUrl이 없는 앨범으로 전환된 경우, 이전에 재생 중이던 오디오를 반드시 멈춤
    if (!currentAlbum?.previewUrl) {
      audio.pause()
      return
    }
    if (isPlaying) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [isPlaying, currentAlbum?.previewUrl])

  // LP 회전 애니메이션 — JS setInterval 방식 1차 구현 (메인 스레드 점유, before 성능 측정용)
  // 로딩 중/재생 불가 상태에서는 돌지 않도록 previewUrl이 있을 때만 회전
  useEffect(() => {
    if (!isPlaying || !currentAlbum?.previewUrl) {
      return
    }
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 6) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [isPlaying, currentAlbum?.previewUrl])

  if (!currentAlbum) {
    return null
  }

  const { coverUrl, albumName } = currentAlbum

  const handleClose = () => {
    setIsClosing(true)
  }

  // X 버튼으로 닫은 경우에만 애니메이션 종료 후 실제로 언마운트(closePlayer).
  // 스크롤로 숨겨진 경우(hiddenByScroll)는 재생을 유지한 채 시각적으로만 사라짐
  const handleAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === 'player-slide-down' && isClosing) {
      closePlayer()
    }
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (!audio || !audio.duration) {
      return
    }
    setProgress((audio.currentTime / audio.duration) * 100)
  }

  // 재생이 끝나면 재생 위치를 처음으로 되돌려서, 다시 눌렀을 때 처음부터 재생되게 함
  const handleEnded = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
    togglePlay()
  }

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  return (
    <div
      onAnimationEnd={handleAnimationEnd}
      className={`${isClosing || (hiddenByScroll && !scrollHideOverride) ? 'player-exit' : 'player-enter'} fixed bottom-6 left-6 z-40 w-60 bg-[#1C1208] border border-border rounded-xl shadow-xl flex flex-col gap-2 px-3 py-3`}
    >
      {/* 재생 실패 메시지 — 플레이어 바로 위에 표시 */}
      {playbackError && (
        <Toast message={playbackError} onClose={clearPlaybackError} position="anchored" />
      )}

      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-secondary hover:text-primary cursor-pointer"
        aria-label="닫기"
      >
        <CloseIcon className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 shrink-0">
          <img
            src={coverUrl}
            alt={`${albumName} 커버`}
            className="w-12 h-12 rounded-full object-cover"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
          {/* 미리듣기 조회 중 — 커버 위에 뿌옇게 오버레이 */}
          {currentAlbum.isPreviewLoading && (
            <div className="absolute inset-0 rounded-full skeleton-shimmer opacity-80" />
          )}
        </div>
        <div className="min-w-0 pr-4">
          <p className="text-muted text-[10px] uppercase tracking-wider">Now Playing</p>
          {currentAlbum.isPreviewLoading ? (
            <SkeletonBox className="h-3 w-28 mt-1 rounded" />
          ) : (
            <div className="overflow-hidden whitespace-nowrap">
              <div className="marquee-track flex w-max">
                <p className="text-primary text-[12px] font-medium pr-8">{albumName}</p>
                <p className="text-primary text-[12px] font-medium pr-8" aria-hidden="true">
                  {albumName}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 진행바 — 30초 미리듣기 재생 위치에 맞춰 갱신 */}
      <div className="h-1 w-full rounded-full bg-border overflow-hidden mt-1">
        <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
      </div>

      {/* 컨트롤러 */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleRestart}
          className="text-secondary hover:text-primary cursor-pointer"
          aria-label="처음부터 재생"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <rect x="0" y="0" width="1.5" height="10" fill="currentColor" />
            <path d="M9 1L2 5L9 9Z" fill="currentColor" />
          </svg>
        </button>

        <MusicPlayButton
          ariaLabel="재생/일시정지"
          size="sm"
          onClick={togglePlay}
          disabled={!currentAlbum.previewUrl}
          isPlaying={isPlaying}
        />

        <button className="text-secondary hover:text-primary cursor-pointer" aria-label="다음 곡">
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M1 1L8 5L1 9Z" fill="currentColor" />
            <rect x="8.5" y="0" width="1.5" height="10" fill="currentColor" />
          </svg>
        </button>
      </div>

      <audio
        ref={audioRef}
        src={currentAlbum.previewUrl ?? undefined}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        className="hidden"
      />
    </div>
  )
}

export default MusicPlayer
