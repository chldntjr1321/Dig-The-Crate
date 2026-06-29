import { type Collection } from '../types'
import { type SortOption } from './sortOptions'

export const sortCollections = (
  collections: Collection[],
  sortBy: SortOption,
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
    }
  })
}
