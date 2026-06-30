import type { SearchResult } from '@/types'
import SearchResultCard from './SearchResultCard'

interface SearchResultListProps {
  results: SearchResult[]
  addedIds: Set<string>
  onAdd: (id: string) => void
  onRemove: (id: string) => void
  hasSearched: boolean
}

const SearchResultList = ({ results, addedIds, onAdd, onRemove, hasSearched }: SearchResultListProps) => {
  if (!hasSearched) return null

  if (results.length === 0) {
    return (
      <p className="text-search-secondary text-sm text-center py-16">검색 결과가 없어요</p>
    )
  }

  return (
    <section>
      <p className="text-xs font-medium text-search-secondary tracking-widest mb-4">
        RESULTS <span className="text-accent">({results.length})</span>
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-8">
        {results.map((result) => (
          <SearchResultCard
            key={result.discogs_id}
            result={result}
            isAdded={addedIds.has(result.discogs_id)}
            onAdd={() => onAdd(result.discogs_id)}
            onRemove={() => onRemove(result.discogs_id)}
          />
        ))}
      </div>
    </section>
  )
}

export default SearchResultList
