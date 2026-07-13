import type { Genre, SearchResult } from '@/types'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import GenreTabs from './GenreTabs'
import SearchResultCard from './SearchResultCard'

interface SearchResultListProps {
  results: SearchResult[]
  collectionIdByDiscogsId: Map<string, string>
  onError: (message: string) => void
  hasSearched: boolean
  selectedGenre: Genre
  onGenreSelect: (genre: Genre) => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  nextPageErrorMessage: string | null
  onLoadMore: () => void
}

const SearchResultList = ({
  results,
  collectionIdByDiscogsId,
  onError,
  hasSearched,
  selectedGenre,
  onGenreSelect,
  hasNextPage,
  isFetchingNextPage,
  nextPageErrorMessage,
  onLoadMore,
}: SearchResultListProps) => {
  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onIntersect: onLoadMore,
    // 다음 페이지 요청이 실패한 상태에서는 sentinel이 계속 화면에 보이는 한
    // observer가 재관찰될 때마다 fetchNextPage가 즉시 재호출되어 무한 재시도로
    // 이어질 수 있어, 에러 상태에서는 자동 재시도를 멈춘다.
    enabled: hasNextPage && !isFetchingNextPage && !nextPageErrorMessage,
  })

  if (!hasSearched) return null

  return (
    <section className="flex flex-col gap-6">
      <p className="text-xs font-medium text-search-secondary tracking-widest">
        RESULTS <span className="text-accent">({results.length})</span>
      </p>
      <GenreTabs selected={selectedGenre} onSelect={onGenreSelect} />
      {results.length === 0 ? (
        <p className="text-search-secondary text-sm text-center py-16">
          검색 결과가 없어요
        </p>
      ) : (
        <>
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
          <div ref={sentinelRef} />
          {isFetchingNextPage && (
            <p className="text-search-secondary text-sm text-center py-6">
              앨범 꺼내는 중...
            </p>
          )}
          {nextPageErrorMessage && (
            <p className="text-search-secondary text-sm text-center py-6">
              {nextPageErrorMessage}
            </p>
          )}
        </>
      )}
    </section>
  )
}

export default SearchResultList
