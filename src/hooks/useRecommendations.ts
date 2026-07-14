import { useQuery } from '@tanstack/react-query'
import { searchByGenre } from '../services/discogs'
import { GENRES } from '../types'
import type { SearchResult } from '../types'

const ALBUMS_PER_GENRE = 2
// per_page=1로 요청하면 Discogs 기본 정렬 1위만 항상 고정으로 나오는 문제가 있어,
// 후보 풀을 넓게 가져온 뒤 그 중 몇 개를 랜덤으로 골라 매번 다른 결과가 나오게 한다.
const CANDIDATE_POOL_SIZE = 50

// Math.random()은 0~1이라 항상 양수 → 0.5를 빼서 -0.5~0.5로 만들어야
// 비교마다 무작위로 앞/뒤가 갈려 매번 다른 순서로 섞임
const shuffle = <T,>(items: T[]): T[] => [...items].sort(() => Math.random() - 0.5)

const useRecommendations = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['discogs-recommendations'],
    queryFn: async () => {
      const genres = GENRES.filter((genre) => genre !== 'All')
      const genrePools = await Promise.all(
        genres.map((genre) => searchByGenre(genre, CANDIDATE_POOL_SIZE)),
      )
      // 장르 순서대로 채우면 화면상 위치가 장르에 고정되므로, 채운 뒤 한 번 더 섞는다.
      const picks: SearchResult[] = genrePools.flatMap((pool) =>
        shuffle(pool).slice(0, ALBUMS_PER_GENRE),
      )
      return shuffle(picks)
    },
  })

  return { recommendations: data ?? [], isLoading: isPending, isError }
}

export default useRecommendations
