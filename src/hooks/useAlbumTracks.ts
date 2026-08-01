import { useQuery } from '@tanstack/react-query'
import { getAlbumTracks, type AlbumTrack } from '../services/itunes'

const useAlbumTracks = (itunesCollectionId: string | null, enabled: boolean) => {
  const { data, isPending } = useQuery({
    queryKey: ['itunes-album-tracks', itunesCollectionId],
    queryFn: () => getAlbumTracks(itunesCollectionId as string),
    enabled: enabled && itunesCollectionId !== null,
  })

  // itunes_collection_id가 애초에 null이면(매칭 실패) 조회 자체를 안 하므로,
  // useQuery의 isPending(비활성 쿼리도 true로 유지됨)에 기대지 않고 즉시 로딩 종료로 처리
  if (itunesCollectionId === null) {
    return { tracks: [] as AlbumTrack[], isLoading: false }
  }

  return { tracks: data ?? [], isLoading: isPending }
}

export default useAlbumTracks
