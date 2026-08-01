import { useState, type ReactNode } from 'react'
import { PlayerContext, type PlayingAlbum } from '../hooks/usePlayer'
import useAlbumTracks from '../hooks/useAlbumTracks'
import type { Collection } from '../types'

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<Collection[]>([])
  // 인덱스 대신 앨범 id로 추적 — 재생 도중 큐가 삭제/재정렬되어도 위치를 안전하게 찾을 수 있음
  const [currentAlbumId, setCurrentAlbumId] = useState<string | null>(null)
  // 현재 앨범 안에서 몇 번째 트랙인지. 앨범이 바뀌면 0으로 리셋됨
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackError, setPlaybackError] = useState<string | null>(null)
  // 다음/이전 버튼(또는 자동 스킵)으로 이동한 경우에만 재생 실패 시 자동으로 다음 트랙으로 넘어감
  // (재생 버튼을 눌러 새로 재생을 시작한 경우엔 그대로 에러를 보여줌)
  const [isNavigating, setIsNavigating] = useState(false)
  // 같은 (앨범, 트랙)의 실패를 한 번만 처리하기 위한 추적 값
  const [handledKey, setHandledKey] = useState<string | null>(null)

  const currentAlbumIndex = currentAlbumId ? queue.findIndex((c) => c.id === currentAlbumId) : -1
  const currentCollection = currentAlbumIndex >= 0 ? queue[currentAlbumIndex] : null

  // currentAlbumId가 바뀌면(다음/이전 앨범 이동) 해당 앨범의 트랙 전체가 자동으로 재조회됨
  const { tracks, isLoading: isTracksLoading } = useAlbumTracks(
    currentCollection?.itunes_collection_id ?? null,
    currentCollection !== null,
  )

  const currentTrack = tracks[currentTrackIndex] ?? null
  const trackKey = currentCollection ? `${currentCollection.id}:${currentTrackIndex}` : null
  const isResolved = currentCollection !== null && !isTracksLoading

  // 트랙 조회가 끝났는데 재생 불가한 상태(앨범 매칭 실패 / 해당 트랙만 미리듣기 없음) 처리.
  // MusicPlayer.tsx의 trackedAlbum과 동일하게 렌더 중 값 비교로 처리해 useEffect의
  // setState-in-effect 문제를 피함
  if (isResolved && trackKey !== handledKey) {
    setHandledKey(trackKey)

    if (tracks.length === 0) {
      // 앨범 자체가 iTunes 매칭 실패
      if (isNavigating && currentAlbumIndex < queue.length - 1) {
        setCurrentAlbumId(queue[currentAlbumIndex + 1].id)
        setCurrentTrackIndex(0)
      } else if (isNavigating) {
        setIsPlaying(false)
      } else {
        setPlaybackError('재생할 수 없습니다.')
      }
    } else if (!currentTrack?.previewUrl) {
      // 앨범은 매칭됐지만 이 트랙만 미리듣기가 없음 → 조용히 다음 트랙/앨범으로 스킵
      setIsNavigating(true)
      if (currentTrackIndex < tracks.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1)
      } else if (currentAlbumIndex < queue.length - 1) {
        setCurrentAlbumId(queue[currentAlbumIndex + 1].id)
        setCurrentTrackIndex(0)
      } else {
        setIsPlaying(false)
      }
    }
  }

  const currentAlbum: PlayingAlbum | null = currentCollection
    ? {
        coverUrl: currentCollection.cover_url,
        albumName: currentCollection.album_name,
        artistName: currentCollection.artist_name,
        trackName: currentTrack?.trackName ?? null,
        previewUrl: currentTrack?.previewUrl ?? null,
        isPreviewLoading: isTracksLoading,
      }
    : null

  const playQueue = (nextQueue: Collection[], index: number) => {
    setIsNavigating(false)
    setHandledKey(null)
    setQueue(nextQueue)
    setCurrentAlbumId(nextQueue[index]?.id ?? null)
    setCurrentTrackIndex(0)
    setIsPlaying(true)
  }

  // 컬렉션 목록이 바뀔 때마다(삭제/추가/정렬 변경 등) 큐를 최신 상태로 동기화.
  // 현재 재생 중인 앨범이 새 목록에서 사라졌으면 currentAlbumIndex가 자동으로 -1이 되어 재생이 멈춤
  const syncQueue = (nextQueue: Collection[]) => {
    setQueue(nextQueue)
  }

  const togglePlay = () => {
    setIsPlaying((current) => !current)
  }

  const closePlayer = () => {
    setQueue([])
    setCurrentAlbumId(null)
    setCurrentTrackIndex(0)
    setIsPlaying(false)
    setHandledKey(null)
  }

  // 같은 앨범 안이면 다음 트랙, 앨범의 마지막 트랙이면 다음 앨범의 첫 트랙으로 이동
  const next = () => {
    if (isTracksLoading) {
      return
    }
    setIsNavigating(true)
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1)
    } else if (currentAlbumIndex >= 0 && currentAlbumIndex < queue.length - 1) {
      setCurrentAlbumId(queue[currentAlbumIndex + 1].id)
      setCurrentTrackIndex(0)
    } else {
      // 큐 마지막까지 왔으면(재생 끝 자동 이동 포함) 더 넘어갈 곳이 없으니 재생을 멈춤
      setIsPlaying(false)
    }
  }

  // 같은 앨범 안이면 이전 트랙, 앨범의 첫 트랙이면 이전 앨범의 첫 트랙으로 이동 (next와 대칭)
  const prev = () => {
    if (isTracksLoading) {
      return
    }
    setIsNavigating(true)
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1)
    } else if (currentAlbumIndex > 0) {
      setCurrentAlbumId(queue[currentAlbumIndex - 1].id)
      setCurrentTrackIndex(0)
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
