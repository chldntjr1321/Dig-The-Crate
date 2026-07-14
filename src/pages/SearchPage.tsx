import { useMemo, useRef, useState } from 'react'
import Header from '../components/Header'
import SearchInput from '../components/search/SearchInput'
import SearchResultList from '../components/search/SearchResultList'
import SearchResultCard from '../components/search/SearchResultCard'
import ScrollToTopButton from '../components/search/ScrollToTopButton'
import Toast from '../components/ui/Toast'
import useDiscogsSearch from '../hooks/useDiscogsSearch'
import useRecommendations from '../hooks/useRecommendations'
import useCollections from '../hooks/useCollections'
import type { Genre } from '../types'

const SearchPage = () => {
  const [query, setQuery] = useState<string>('')
  const [selectedGenre, setSelectedGenre] = useState<Genre>('All')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLElement>(null)

  const isSearching = query.length > 0

  const {
    results,
    isLoading,
    errorMessage,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDiscogsSearch(query)
  const { recommendations, isLoading: isRecommendationsLoading } =
    useRecommendations()
  const { collections } = useCollections('recently_added')

  // 결과가 하나도 없는 상태에서 실패하면 검색 자체가 실패한 것(초기 에러)이고,
  // 이미 쌓인 결과가 있는 상태에서 실패하면 다음 페이지 로드만 실패한 것이므로
  // 기존 결과는 그대로 보여주고 다음 페이지 영역에만 에러를 표시한다.
  const hasResults = results.length > 0
  const isInitialError = errorMessage !== null && !hasResults
  const nextPageErrorMessage = hasResults ? errorMessage : null

  const searchResults = useMemo(
    () =>
      selectedGenre === 'All'
        ? results
        : results.filter((r) => r.genres?.includes(selectedGenre)),
    [results, selectedGenre],
  )

  const collectionIdByDiscogsId = useMemo(
    () =>
      new Map(
        collections.map((collection) => [collection.discogs_id, collection.id]),
      ),
    [collections],
  )

  return (
    <div className="bg-search flex flex-col h-screen">
      <Header />
      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto [scrollbar-gutter:stable]"
      >
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
                  앨범 꺼내는 중...
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-8">
                  {recommendations.map((result) => (
                    <SearchResultCard
                      key={result.discogs_id}
                      result={result}
                      collectionId={collectionIdByDiscogsId.get(
                        result.discogs_id,
                      )}
                      onError={setToastMessage}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {isSearching && (
            <>
              {isInitialError && (
                <p className="text-search-secondary text-sm text-center py-16">
                  {errorMessage}
                </p>
              )}
              {!isInitialError && isLoading && (
                <p className="text-search-secondary text-sm text-center py-16">
                  검색 중...
                </p>
              )}
              {!isInitialError && !isLoading && (
                <SearchResultList
                  results={searchResults}
                  collectionIdByDiscogsId={collectionIdByDiscogsId}
                  onError={setToastMessage}
                  hasSearched={true}
                  selectedGenre={selectedGenre}
                  onGenreSelect={setSelectedGenre}
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  nextPageErrorMessage={nextPageErrorMessage}
                  onLoadMore={fetchNextPage}
                />
              )}
            </>
          )}
        </div>
      </main>

      {isSearching && (
        <ScrollToTopButton scrollContainerRef={scrollContainerRef} />
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  )
}

export default SearchPage
