import { useQuery } from '@tanstack/react-query'
import { getPreviewUrl } from '../services/itunes'

const useAlbumPreview = (artistName: string, albumName: string, enabled: boolean) => {
  const { data, isPending } = useQuery({
    queryKey: ['itunes-preview', artistName, albumName],
    queryFn: () => getPreviewUrl(artistName, albumName),
    enabled,
  })

  return { previewUrl: data ?? null, isLoading: isPending }
}

export default useAlbumPreview
