import { useState, type ReactNode } from 'react'
import { PlayerContext, type PlayingAlbum } from '../hooks/usePlayer'

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentAlbum, setCurrentAlbum] = useState<PlayingAlbum | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const play = (album: PlayingAlbum) => {
    setCurrentAlbum(album)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    setIsPlaying((prev) => !prev)
  }

  return (
    <PlayerContext value={{ currentAlbum, isPlaying, play, togglePlay }}>
      {children}
    </PlayerContext>
  )
}
