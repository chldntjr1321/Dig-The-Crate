import { useQuery } from '@tanstack/react-query'
import { getReleaseDetail } from '../services/discogs'

const useReleaseDetail = (releaseId: string, enabled: boolean) => {
  const { data, isPending } = useQuery({
    queryKey: ['discogs-release-detail', releaseId],
    queryFn: () => getReleaseDetail(releaseId),
    enabled,
  })

  return { tracklist: data ?? [], isLoading: isPending }
}

export default useReleaseDetail
