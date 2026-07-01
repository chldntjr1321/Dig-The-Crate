import { useQuery } from '@tanstack/react-query'
import {
  DiscogsNetworkError,
  DiscogsRateLimitError,
  searchAlbums,
} from '../services/discogs'

const useDiscogsSearch = (query: string) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['discogs-search', query],
    queryFn: () => searchAlbums(query),
    enabled: query.length > 0,
  })

  const errorMessage = isError
    ? error instanceof DiscogsRateLimitError ||
      error instanceof DiscogsNetworkError
      ? error.message
      : '알 수 없는 오류가 발생했어요'
    : null

  return {
    results: data ?? [],
    isLoading: query.length > 0 && isPending,
    errorMessage,
  }
}

export default useDiscogsSearch
