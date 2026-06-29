import { useQuery } from '@tanstack/react-query'
import { getCollections } from '../services/collections'
import { type SortOption } from '../utils/sortOptions'
import { sortCollections } from '../utils/sortCollections'
import useAuth from './useAuth'

const useCollections = (sortBy: SortOption) => {
  const { user } = useAuth()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['collections', user?.id],
    queryFn: () => getCollections(user!.id),
    enabled: !!user,
  })

  const collections = data ? sortCollections(data, sortBy) : []

  return { collections, isLoading, isError }
}

export default useCollections
