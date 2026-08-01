export type CollectionSortOption =
  | 'recently_added'
  | 'artist_name'
  | 'album_name'
  | 'release_year_desc'
  | 'release_year_asc'

export const SORT_LABELS: Record<CollectionSortOption, string> = {
  recently_added: '최근 추가순',
  artist_name: '아티스트명순',
  album_name: '앨범명순',
  release_year_desc: '발매 최신순',
  release_year_asc: '발매 오래된순',
}

// Discogs 검색 API는 텍스트 필드(아티스트명/앨범명) 정렬을 지원하지 않아
// 서버가 실제로 정렬 가능한 필드(year, want)로만 옵션을 구성한다 (docs/API_GUIDE.md 참조)
export type SearchSortOption = 'relevance' | 'year_desc' | 'year_asc' | 'want_desc'

export const SEARCH_SORT_LABELS: Record<SearchSortOption, string> = {
  relevance: '관련도순',
  year_desc: '최신순',
  year_asc: '오래된순',
  want_desc: '인기순',
}

// sort와 sortOrder가 항상 같이 있거나 둘 다 없거나만 가능하도록 강제
export type SearchSortParams = { sort: string; sortOrder: 'asc' | 'desc' } | Record<string, never>

export const SEARCH_SORT_PARAMS: Record<SearchSortOption, SearchSortParams> = {
  relevance: {},
  year_desc: { sort: 'year', sortOrder: 'desc' },
  year_asc: { sort: 'year', sortOrder: 'asc' },
  want_desc: { sort: 'want', sortOrder: 'desc' },
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
  itunes_collection_id: string | null
  added_at: string
}

export interface RgbColor {
  r: number
  g: number
  b: number
}
