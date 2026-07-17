import { useMemo } from 'react'
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

  // data/sortBy가 실제로 바뀔 때만 새 배열을 만들어 참조 안정성을 유지
  // (그렇지 않으면 이 배열을 참조하는 useEffect들이 매 렌더링마다 재실행됨)
  const collections = useMemo(() => (data ? sortItems(data, sortBy) : []), [data, sortBy])

  return { collections, isLoading: loading || isPending, isError }
}

export default useCollections
