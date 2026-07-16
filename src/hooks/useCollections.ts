import { useQuery } from '@tanstack/react-query'
import { getCollections } from '../services/collections'
import { type CollectionSortOption } from '../types'
import { sortItems } from '../utils/sortItems'
import useAuth from './useAuth'

const useCollections = (sortBy: CollectionSortOption) => {
  const { user, loading } = useAuth()

  const { data, isPending, isError } = useQuery({
    queryKey: ['collections', user?.id],
    queryFn: () => getCollections(user!.id),
    enabled: !!user,
  })

  const collections = data ? sortItems(data, sortBy) : []

  return { collections, isLoading: loading || isPending, isError }
}

export default useCollections
