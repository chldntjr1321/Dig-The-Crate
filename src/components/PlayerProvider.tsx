import { useState, type ReactNode } from 'react'
import { PlayerContext, type PlayingAlbum } from '../hooks/usePlayer'

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentAlbum, setCurrentAlbum] = useState<PlayingAlbum | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackError, setPlaybackError] = useState<string | null>(null)

  const play = (album: PlayingAlbum) => {
    setCurrentAlbum(album)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    setIsPlaying((prev) => !prev)
  }

  const closePlayer = () => {
    setCurrentAlbum(null)
    setIsPlaying(false)
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
        play,
        togglePlay,
        closePlayer,
        playbackError,
        notifyPlaybackError,
        clearPlaybackError,
      }}
    >
      {children}
    </PlayerContext>
  )
}
