import { useQuery } from '@tanstack/react-query'
import { searchByGenre } from '../services/discogs'
import { GENRES } from '../types'

const RECOMMEND_COUNT = 4

const pickRandomGenres = () =>
  GENRES.filter((genre) => genre !== 'All')
    // Math.random()은 0~1이라 항상 양수 → 0.5를 빼서 -0.5~0.5로 만들어야
    // 비교마다 무작위로 앞/뒤가 갈려 매번 다른 순서로 섞임
    .sort(() => Math.random() - 0.5)
    .slice(0, RECOMMEND_COUNT)

const useRecommendations = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['discogs-recommendations'],
    queryFn: async () => {
      const results = await Promise.all(
        pickRandomGenres().map((genre) => searchByGenre(genre, 1)),
      )
      return results.flat()
    },
  })

  return { recommendations: data ?? [], isLoading: isPending, isError }
}

export default useRecommendations
