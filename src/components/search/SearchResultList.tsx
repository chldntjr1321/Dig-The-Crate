import type { Genre, SearchResult } from '@/types'
import GenreTabs from './GenreTabs'
import SearchResultCard from './SearchResultCard'

interface SearchResultListProps {
  results: SearchResult[]
  collectionIdByDiscogsId: Map<string, string>
  onError: (message: string) => void
  hasSearched: boolean
  selectedGenre: Genre
  onGenreSelect: (genre: Genre) => void
}

const SearchResultList = ({
  results,
  collectionIdByDiscogsId,
  onError,
  hasSearched,
  selectedGenre,
  onGenreSelect,
}: SearchResultListProps) => {
  if (!hasSearched) return null

  return (
    <section className="flex flex-col gap-6">
      <p className="text-xs font-medium text-search-secondary tracking-widest">
        RESULTS <span className="text-accent">({results.length})</span>
      </p>
      <GenreTabs selected={selectedGenre} onSelect={onGenreSelect} />
      {results.length === 0 ? (
        <p className="text-search-secondary text-sm text-center py-16">검색 결과가 없어요</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-8">
          {results.map((result) => (
            <SearchResultCard
              key={result.discogs_id}
              result={result}
              collectionId={collectionIdByDiscogsId.get(result.discogs_id)}
              onError={onError}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default SearchResultList
