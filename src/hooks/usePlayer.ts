import { createContext, useContext } from 'react'
import type { Collection } from '../types'

export interface PlayingAlbum {
  coverUrl: string
  albumName: string
  artistName: string
  previewUrl: string | null
  isPreviewLoading: boolean
}

export interface PlayerContextValue {
  currentAlbum: PlayingAlbum | null
  isPlaying: boolean
  playQueue: (queue: Collection[], index: number) => void
  syncQueue: (queue: Collection[]) => void
  togglePlay: () => void
  closePlayer: () => void
  next: () => void
  prev: () => void
  playbackError: string | null
  notifyPlaybackError: (message: string) => void
  clearPlaybackError: () => void
}

export const PlayerContext = createContext<PlayerContextValue | null>(null)

export const usePlayer = () => {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer는 PlayerProvider 내부에서만 사용할 수 있습니다')
  }
  return context
}
