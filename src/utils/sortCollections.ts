import { type Collection, type CollectionSortOption } from '../types'

export const sortCollections = (
  collections: Collection[],
  sortBy: CollectionSortOption,
): Collection[] => {
  return [...collections].sort((a, b) => {
    switch (sortBy) {
      case 'recently_added':
        return new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
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
