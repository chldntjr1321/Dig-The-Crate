import { useInfiniteQuery } from '@tanstack/react-query'
import {
  DiscogsNetworkError,
  DiscogsRateLimitError,
  searchAlbums,
} from '../services/discogs'
import { SEARCH_SORT_PARAMS, type SearchSortOption } from '../types'

const useDiscogsSearch = (query: string, sortBy: SearchSortOption = 'relevance') => {
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['discogs-search', query, sortBy],
    queryFn: ({ pageParam }) =>
      searchAlbums(query, pageParam, 20, SEARCH_SORT_PARAMS[sortBy]),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.pages
        ? lastPage.pagination.page + 1
        : undefined,
    enabled: query.length > 0,
  })

  const errorMessage = isError
    ? error instanceof DiscogsRateLimitError ||
      error instanceof DiscogsNetworkError
      ? error.message
      : '알 수 없는 오류가 발생했어요'
    : null

  // Discogs 검색이 정렬 파라미터를 무시하고 관련도순으로 폴백하는 경우, 페이지 경계에서
  // 같은 discogs_id가 중복 반환될 수 있어 페이지를 합칠 때 한 번 걸러냄
  const allResults = data?.pages.flatMap((page) => page.results) ?? []
  const uniqueResults = Array.from(
    new Map(allResults.map((result) => [result.discogs_id, result])).values(),
  )

  return {
    results: uniqueResults,
    isLoading: query.length > 0 && isPending,
    errorMessage,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
  }
}

export default useDiscogsSearch
