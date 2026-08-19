import { create } from 'zustand'
import type { Collection } from '../types'
import type { AlbumTrack } from '../services/itunes'

interface PlayerStoreState {
  queue: Collection[]
  currentAlbumId: string | null
  currentTrackIndex: number
  isPlaying: boolean
  playbackError: string | null
  // 다음/이전 버튼(또는 자동 스킵)으로 이동한 경우에만 재생 실패 시 자동으로 다음 트랙으로 넘어감
  // (재생 버튼을 눌러 새로 재생을 시작한 경우엔 그대로 에러를 보여줌)
  isNavigating: boolean
  // 같은 (앨범, 트랙)의 실패를 한 번만 처리하기 위한 추적 값
  handledKey: string | null

  playQueue: (queue: Collection[], index: number) => void
  syncQueue: (queue: Collection[]) => void
  togglePlay: () => void
  closePlayer: () => void
  next: (tracksLength: number, isTracksLoading: boolean) => void
  prev: (isTracksLoading: boolean) => void
  notifyPlaybackError: (message: string) => void
  clearPlaybackError: () => void
  // 트랙 조회가 끝났는데 재생 불가한 상태(앨범 매칭 실패 / 해당 트랙만 미리듣기 없음) 처리.
  // tracks/isTracksLoading은 useAlbumTracks(TanStack Query)에서만 얻을 수 있어 인자로 받는다.
  resolveTrackAvailability: (tracks: AlbumTrack[], isTracksLoading: boolean) => void
}

const usePlayerStore = create<PlayerStoreState>((set, get) => ({
  queue: [],
  currentAlbumId: null,
  currentTrackIndex: 0,
  isPlaying: false,
  playbackError: null,
  isNavigating: false,
  handledKey: null,

  playQueue: (queue, index) => {
    set({
      queue,
      currentAlbumId: queue[index]?.id ?? null,
      currentTrackIndex: 0,
      isPlaying: true,
      isNavigating: false,
      handledKey: null,
    })
  },

  // 컬렉션 목록이 바뀔 때마다(삭제/추가/정렬 변경 등) 큐를 최신 상태로 동기화.
  // 현재 재생 중인 앨범이 새 목록에서 사라졌으면 findIndex가 -1이 되어 재생이 멈춤
  syncQueue: (queue) => {
    set({ queue })
  },

  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }))
  },

  closePlayer: () => {
    set({
      queue: [],
      currentAlbumId: null,
      currentTrackIndex: 0,
      isPlaying: false,
      handledKey: null,
    })
  },

  // 같은 앨범 안이면 다음 트랙, 앨범의 마지막 트랙이면 다음 앨범의 첫 트랙으로 이동
  next: (tracksLength, isTracksLoading) => {
    if (isTracksLoading) return

    const { currentTrackIndex, currentAlbumId, queue } = get()
    const currentAlbumIndex = currentAlbumId ? queue.findIndex((c) => c.id === currentAlbumId) : -1

    set({ isNavigating: true })

    if (currentTrackIndex < tracksLength - 1) {
      set({ currentTrackIndex: currentTrackIndex + 1 })
    } else if (currentAlbumIndex >= 0 && currentAlbumIndex < queue.length - 1) {
      set({ currentAlbumId: queue[currentAlbumIndex + 1].id, currentTrackIndex: 0 })
    } else {
      // 큐 마지막까지 왔으면(재생 끝 자동 이동 포함) 더 넘어갈 곳이 없으니 재생을 멈춤
      set({ isPlaying: false })
    }
  },

  // 같은 앨범 안이면 이전 트랙, 앨범의 첫 트랙이면 이전 앨범의 첫 트랙으로 이동 (next와 대칭)
  prev: (isTracksLoading) => {
    if (isTracksLoading) return

    const { currentTrackIndex, currentAlbumId, queue } = get()
    const currentAlbumIndex = currentAlbumId ? queue.findIndex((c) => c.id === currentAlbumId) : -1

    set({ isNavigating: true })

    if (currentTrackIndex > 0) {
      set({ currentTrackIndex: currentTrackIndex - 1 })
    } else if (currentAlbumIndex > 0) {
      set({ currentAlbumId: queue[currentAlbumIndex - 1].id, currentTrackIndex: 0 })
    }
  },

  notifyPlaybackError: (message) => {
    set({ playbackError: message })
  },

  clearPlaybackError: () => {
    set({ playbackError: null })
  },

  resolveTrackAvailability: (tracks, isTracksLoading) => {
    const { currentAlbumId, currentTrackIndex, handledKey, isNavigating, queue } = get()

    if (currentAlbumId === null || isTracksLoading) return

    const trackKey = `${currentAlbumId}:${currentTrackIndex}`
    if (trackKey === handledKey) return

    set({ handledKey: trackKey })

    const currentAlbumIndex = queue.findIndex((c) => c.id === currentAlbumId)
    const currentTrack = tracks[currentTrackIndex] ?? null

    if (tracks.length === 0) {
      // 앨범 자체가 iTunes 매칭 실패
      if (isNavigating && currentAlbumIndex < queue.length - 1) {
        set({ currentAlbumId: queue[currentAlbumIndex + 1].id, currentTrackIndex: 0 })
      } else if (isNavigating) {
        set({ isPlaying: false })
      } else {
        set({ playbackError: '재생할 수 없습니다.' })
      }
    } else if (!currentTrack?.previewUrl) {
      // 앨범은 매칭됐지만 이 트랙만 미리듣기가 없음 → 조용히 다음 트랙/앨범으로 스킵
      set({ isNavigating: true })
      if (currentTrackIndex < tracks.length - 1) {
        set({ currentTrackIndex: currentTrackIndex + 1 })
      } else if (currentAlbumIndex < queue.length - 1) {
        set({ currentAlbumId: queue[currentAlbumIndex + 1].id, currentTrackIndex: 0 })
      } else {
        set({ isPlaying: false })
      }
    }
  },
}))

export default usePlayerStore
