import { type Collection, type CollectionSortOption, type SearchResult, type SearchSortOption } from '../types'

export function sortItems(items: Collection[], sortBy: CollectionSortOption): Collection[]
export function sortItems(items: SearchResult[], sortBy: SearchSortOption): SearchResult[]
export function sortItems(
  items: (Collection | SearchResult)[],
  sortBy: CollectionSortOption | SearchSortOption,
): (Collection | SearchResult)[] {
  return [...items].sort((a, b) => {
    switch (sortBy) {
      case 'recently_added':
        return (
          new Date((b as Collection).added_at).getTime() -
          new Date((a as Collection).added_at).getTime()
        )
      case 'relevance':
        return 0
      case 'artist_name':
        return a.artist_name.localeCompare(b.artist_name)
      case 'album_name':
        return a.album_name.localeCompare(b.album_name)
      case 'release_year':
        return (a.year ?? '').localeCompare(b.year ?? '')
      default:
        return 0
    }
  })
}
