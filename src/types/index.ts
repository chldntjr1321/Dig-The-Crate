export type SortOption = 'recently_added' | 'artist_name' | 'album_name' | 'release_year'

export const SORT_LABELS: Record<SortOption, string> = {
  recently_added: 'Recently Added',
  artist_name: 'Artist Name',
  album_name: 'Album Name',
  release_year: 'Release Year',
}

export const GENRES = ['All', 'Jazz', 'Rock', 'Electronic', 'Classical', 'Hip Hop', 'R&B'] as const
export type Genre = (typeof GENRES)[number]

export interface Track {
  position: string
  title: string
  duration?: string
}

export interface SearchResult {
  discogs_id: string
  album_name: string
  artist_name: string
  cover_url: string
  year?: string
  genres?: string[]
  tracklist?: Track[]
}

export interface Collection {
  id: string
  user_id: string
  discogs_id: string
  album_name: string
  artist_name: string
  cover_url: string
  year?: string
  genres?: string[]
  tracklist?: Track[]
  added_at: string
}
