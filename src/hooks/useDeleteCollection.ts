import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCollection } from '../services/collections'
import type { Collection } from '../types'
import useAuth from './useAuth'

const useDeleteCollection = (onError: (message: string) => void) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const queryKey = ['collections', user?.id]

  const mutation = useMutation({
    mutationFn: deleteCollection,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey })

      const previousCollections = queryClient.getQueryData<Collection[]>(queryKey)

      queryClient.setQueryData<Collection[]>(queryKey, (old) =>
        old?.filter((collection) => collection.id !== id),
      )

      return { previousCollections }
    },
    onError: (_error, _id, context) => {
      if (context?.previousCollections) {
        queryClient.setQueryData(queryKey, context.previousCollections)
      }
      onError('삭제 중 문제가 발생했어요')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    deleteCollection: mutation.mutate,
    isPending: mutation.isPending,
  }
}

export default useDeleteCollection
