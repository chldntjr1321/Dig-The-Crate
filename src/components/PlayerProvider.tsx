import { useState, type ReactNode } from 'react'
import { PlayerContext, type PlayingAlbum } from '../hooks/usePlayer'
import useAlbumPreview from '../hooks/useAlbumPreview'
import type { Collection } from '../types'

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<Collection[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackError, setPlaybackError] = useState<string | null>(null)
  // 다음/이전 버튼으로 이동한 경우에만 재생 실패 시 자동으로 다음 곡으로 넘어감
  // (재생 버튼을 눌러 새로 재생을 시작한 경우엔 그대로 에러를 보여줌)
  const [isNavigating, setIsNavigating] = useState(false)
  // 같은 (인덱스, 앨범) 조합의 실패를 한 번만 처리하기 위한 추적 값
  const [handledKey, setHandledKey] = useState<string | null>(null)

  const currentCollection = queue[currentIndex] ?? null

  // currentIndex가 바뀌면(다음/이전 곡 이동) artist/album명도 바뀌어 자동으로 재조회됨
  const { previewUrl, isLoading: isPreviewLoading } = useAlbumPreview(
    currentCollection?.artist_name ?? '',
    currentCollection?.album_name ?? '',
    currentCollection !== null,
  )

  const currentKey = currentCollection ? `${currentIndex}:${currentCollection.id}` : null
  const isResolved = currentCollection !== null && !isPreviewLoading

  // previewUrl 조회가 끝났는데 값이 없으면(재생 불가) 처리.
  // MusicPlayer.tsx의 trackedAlbum과 동일하게 렌더 중 값 비교로 처리해 useEffect의
  // setState-in-effect 문제를 피함
  if (isResolved && currentKey !== handledKey) {
    setHandledKey(currentKey)
    if (!previewUrl) {
      if (isNavigating && currentIndex < queue.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        setPlaybackError('재생할 수 없습니다.')
      }
    }
  }

  const currentAlbum: PlayingAlbum | null = currentCollection
    ? {
        coverUrl: currentCollection.cover_url,
        albumName: currentCollection.album_name,
        artistName: currentCollection.artist_name,
        previewUrl,
        isPreviewLoading,
      }
    : null

  const playQueue = (nextQueue: Collection[], index: number) => {
    setIsNavigating(false)
    setHandledKey(null)
    setQueue(nextQueue)
    setCurrentIndex(index)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    setIsPlaying((current) => !current)
  }

  const closePlayer = () => {
    setQueue([])
    setCurrentIndex(0)
    setIsPlaying(false)
    setHandledKey(null)
  }

  const next = () => {
    setIsNavigating(true)
    setCurrentIndex((current) => (current < queue.length - 1 ? current + 1 : current))
  }

  const prev = () => {
    setIsNavigating(true)
    setCurrentIndex((current) => (current > 0 ? current - 1 : current))
  }

  const notifyPlaybackError = (message: string) => {
    setPlaybackError(message)
  }

  const clearPlaybackError = () => {
    setPlaybackError(null)
  }

  return (
    <PlayerContext
      value={{
        currentAlbum,
        isPlaying,
        playQueue,
        togglePlay,
        closePlayer,
        next,
        prev,
        playbackError,
        notifyPlaybackError,
        clearPlaybackError,
      }}
    >
      {children}
    </PlayerContext>
  )
}
