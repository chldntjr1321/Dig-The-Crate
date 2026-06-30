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
