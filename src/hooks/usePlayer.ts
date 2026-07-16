import { createContext, useContext } from 'react'

export interface PlayingAlbum {
  coverUrl: string
  albumName: string
  artistName: string
  previewUrl: string | null
}

export interface PlayerContextValue {
  currentAlbum: PlayingAlbum | null
  isPlaying: boolean
  play: (album: PlayingAlbum) => void
  togglePlay: () => void
  closePlayer: () => void
}

export const PlayerContext = createContext<PlayerContextValue | null>(null)

export const usePlayer = () => {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer는 PlayerProvider 내부에서만 사용할 수 있습니다')
  }
  return context
}
