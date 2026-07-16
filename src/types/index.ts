export type SortOption = 'recently_added' | 'artist_name' | 'album_name' | 'release_year'

export const SORT_LABELS: Record<SortOption, string> = {
  recently_added: 'Recently Added',
  artist_name: 'Artist Name',
  album_name: 'Album Name',
  release_year: 'Release Year',
}

export type SearchSortOption = 'relevance' | 'release_year' | 'album_name' | 'artist_name'

export const SEARCH_SORT_LABELS: Record<SearchSortOption, string> = {
  relevance: '관련도순',
  release_year: '발매 연도순',
  album_name: '앨범명순',
  artist_name: '아티스트명순',
}

// Discogs는 R&B를 별도 장르로 두지 않고 'Funk / Soul'로 분류하므로,
// 매핑 없이 API가 실제로 쓰는 값을 그대로 탭 라벨로 사용한다.
export const GENRES = ['All', 'Jazz', 'Rock', 'Electronic', 'Classical', 'Hip Hop', 'Funk / Soul'] as const
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

export interface SearchPagination {
  page: number
  pages: number
  items: number
}

export interface SearchAlbumsResult {
  results: SearchResult[]
  pagination: SearchPagination
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
