import { useState, type ReactNode } from 'react'
import { PlayerContext, type PlayingAlbum } from '../hooks/usePlayer'
import useAlbumPreview from '../hooks/useAlbumPreview'
import type { Collection } from '../types'

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<Collection[]>([])
  // 인덱스 대신 앨범 id로 추적 — 재생 도중 큐가 삭제/재정렬되어도 위치를 안전하게 찾을 수 있음
  const [currentAlbumId, setCurrentAlbumId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackError, setPlaybackError] = useState<string | null>(null)
  // 다음/이전 버튼으로 이동한 경우에만 재생 실패 시 자동으로 다음 곡으로 넘어감
  // (재생 버튼을 눌러 새로 재생을 시작한 경우엔 그대로 에러를 보여줌)
  const [isNavigating, setIsNavigating] = useState(false)
  // 같은 앨범의 실패를 한 번만 처리하기 위한 추적 값
  const [handledKey, setHandledKey] = useState<string | null>(null)

  const currentIndex = currentAlbumId ? queue.findIndex((c) => c.id === currentAlbumId) : -1
  const currentCollection = currentIndex >= 0 ? queue[currentIndex] : null

  // currentAlbumId가 바뀌면(다음/이전 곡 이동) artist/album명도 바뀌어 자동으로 재조회됨
  const { previewUrl, isLoading: isPreviewLoading } = useAlbumPreview(
    currentCollection?.artist_name ?? '',
    currentCollection?.album_name ?? '',
    currentCollection !== null,
  )

  const currentKey = currentCollection?.id ?? null
  const isResolved = currentCollection !== null && !isPreviewLoading

  // previewUrl 조회가 끝났는데 값이 없으면(재생 불가) 처리.
  // MusicPlayer.tsx의 trackedAlbum과 동일하게 렌더 중 값 비교로 처리해 useEffect의
  // setState-in-effect 문제를 피함
  if (isResolved && currentKey !== handledKey) {
    setHandledKey(currentKey)
    if (!previewUrl) {
      if (isNavigating && currentIndex < queue.length - 1) {
        setCurrentAlbumId(queue[currentIndex + 1].id)
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
    setCurrentAlbumId(nextQueue[index]?.id ?? null)
    setIsPlaying(true)
  }

  // 컬렉션 목록이 바뀔 때마다(삭제/추가/정렬 변경 등) 큐를 최신 상태로 동기화.
  // 현재 재생 중인 앨범이 새 목록에서 사라졌으면 currentIndex가 자동으로 -1이 되어 재생이 멈춤
  const syncQueue = (nextQueue: Collection[]) => {
    setQueue(nextQueue)
  }

  const togglePlay = () => {
    setIsPlaying((current) => !current)
  }

  const closePlayer = () => {
    setQueue([])
    setCurrentAlbumId(null)
    setIsPlaying(false)
    setHandledKey(null)
  }

  const next = () => {
    setIsNavigating(true)
    if (currentIndex >= 0 && currentIndex < queue.length - 1) {
      setCurrentAlbumId(queue[currentIndex + 1].id)
    } else {
      // 큐 마지막까지 왔으면(재생 끝 자동 이동 포함) 더 넘어갈 곳이 없으니 재생을 멈춤
      setIsPlaying(false)
    }
  }

  const prev = () => {
    setIsNavigating(true)
    if (currentIndex > 0) {
      setCurrentAlbumId(queue[currentIndex - 1].id)
    }
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
        syncQueue,
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
