import { useMemo, useState } from 'react'
import Header from '../components/Header'
import SearchInput from '../components/search/SearchInput'
import SearchResultList from '../components/search/SearchResultList'
import SearchResultCard from '../components/search/SearchResultCard'
import useDiscogsSearch from '../hooks/useDiscogsSearch'
import useRecommendations from '../hooks/useRecommendations'
import type { Genre } from '../types'

const SearchPage = () => {
  const [query, setQuery] = useState<string>('')
  const [selectedGenre, setSelectedGenre] = useState<Genre>('All')
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())

  const isSearching = query.length > 0

  const { results, isLoading, errorMessage } = useDiscogsSearch(query)
  const { recommendations, isLoading: isRecommendationsLoading } =
    useRecommendations()

  const searchResults = useMemo(
    () =>
      selectedGenre === 'All'
        ? results
        : results.filter((r) => r.genres?.includes(selectedGenre)),
    [results, selectedGenre],
  )

  const handleAdd = (id: string) => setAddedIds((prev) => new Set(prev).add(id))
  const handleRemove = (id: string) => {
    setAddedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  return (
    <div className="bg-search">
      <Header />
      <main className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto [scrollbar-gutter:stable]">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <SearchInput
            onSearch={(value) => {
              setQuery(value)
              setSelectedGenre('All')
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-6 pb-12 flex flex-col gap-8">
          {!isSearching && (
            <div className="flex flex-col gap-6">
              <p className="text-xs font-medium text-search-secondary tracking-widest">
                RECOMMEND
              </p>
              {isRecommendationsLoading ? (
                <p className="text-search-secondary text-sm text-center py-16">
                  불러오는 중...
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-8">
                  {recommendations.map((result) => (
                    <SearchResultCard
                      key={result.discogs_id}
                      result={result}
                      isAdded={addedIds.has(result.discogs_id)}
                      onAdd={() => handleAdd(result.discogs_id)}
                      onRemove={() => handleRemove(result.discogs_id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {isSearching && (
            <>
              {errorMessage && (
                <p className="text-search-secondary text-sm text-center py-16">
                  {errorMessage}
                </p>
              )}
              {!errorMessage && isLoading && (
                <p className="text-search-secondary text-sm text-center py-16">
                  검색 중...
                </p>
              )}
              {!errorMessage && !isLoading && (
                <SearchResultList
                  results={searchResults}
                  addedIds={addedIds}
                  onAdd={handleAdd}
                  onRemove={handleRemove}
                  hasSearched={true}
                  selectedGenre={selectedGenre}
                  onGenreSelect={setSelectedGenre}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default SearchPage
