import { useQuery } from '@tanstack/react-query'
import { searchByGenre } from '../services/discogs'
import { GENRES } from '../types'
import type { SearchResult } from '../types'

const RECOMMEND_COUNT = 4
// per_page=1로 요청하면 Discogs 기본 정렬 1위만 항상 고정으로 나오는 문제가 있어,
// 후보 풀을 넓게 가져온 뒤 그 중 1개를 랜덤으로 골라 매번 다른 결과가 나오게 한다.
const CANDIDATE_POOL_SIZE = 50

const pickRandomGenres = () =>
  GENRES.filter((genre) => genre !== 'All')
    // Math.random()은 0~1이라 항상 양수 → 0.5를 빼서 -0.5~0.5로 만들어야
    // 비교마다 무작위로 앞/뒤가 갈려 매번 다른 순서로 섞임
    .sort(() => Math.random() - 0.5)
    .slice(0, RECOMMEND_COUNT)

const pickRandomItem = (items: SearchResult[]): SearchResult | undefined =>
  items[Math.floor(Math.random() * items.length)]

const useRecommendations = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['discogs-recommendations'],
    queryFn: async () => {
      const genrePools = await Promise.all(
        pickRandomGenres().map((genre) =>
          searchByGenre(genre, CANDIDATE_POOL_SIZE),
        ),
      )
      return genrePools
        .map(pickRandomItem)
        .filter((result): result is SearchResult => result !== undefined)
    },
  })

  return { recommendations: data ?? [], isLoading: isPending, isError }
}

export default useRecommendations
