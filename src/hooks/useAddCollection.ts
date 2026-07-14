import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addCollection, DuplicateCollectionError } from '../services/collections'
import type { Collection, SearchResult } from '../types'
import useAuth from './useAuth'

const useAddCollection = (onError: (message: string) => void) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const queryKey = ['collections', user?.id]

  const mutation = useMutation({
    mutationFn: (album: SearchResult) => addCollection(user!.id, album),
    onMutate: async (album) => {
      await queryClient.cancelQueries({ queryKey })

      const previousCollections = queryClient.getQueryData<Collection[]>(queryKey)

      const optimisticCollection: Collection = {
        id: `optimistic-${album.discogs_id}`,
        user_id: user!.id,
        discogs_id: album.discogs_id,
        album_name: album.album_name,
        artist_name: album.artist_name,
        cover_url: album.cover_url,
        year: album.year,
        genres: album.genres,
        tracklist: album.tracklist,
        added_at: new Date().toISOString(),
      }

      queryClient.setQueryData<Collection[]>(queryKey, (old) => [
        ...(old ?? []),
        optimisticCollection,
      ])

      return { previousCollections }
    },
    onError: (error, _album, context) => {
      if (context?.previousCollections) {
        queryClient.setQueryData(queryKey, context.previousCollections)
      }

      onError(
        error instanceof DuplicateCollectionError
          ? error.message
          : '추가 중 문제가 발생했어요',
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    addCollection: mutation.mutate,
    isPending: mutation.isPending,
  }
}

export default useAddCollection
