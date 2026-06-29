export type SortOption = 'recently_added' | 'artist_name' | 'album_name' | 'release_year'

export const SORT_LABELS: Record<SortOption, string> = {
  recently_added: 'Recently Added',
  artist_name: 'Artist Name',
  album_name: 'Album Name',
  release_year: 'Release Year',
}
