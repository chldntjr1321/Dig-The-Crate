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

  return {
    results: data?.pages.flatMap((page) => page.results) ?? [],
    isLoading: query.length > 0 && isPending,
    errorMessage,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
  }
}

export default useDiscogsSearch
