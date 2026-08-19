import { useEffect } from 'react'
import usePlayerStore from '../stores/usePlayerStore'
import useAlbumTracks from '../hooks/useAlbumTracks'

// 화면에 아무것도 그리지 않는 컴포넌트. currentAlbumId가 바뀔 때마다 트랙을 조회해서
// 재생 가능 여부를 판별하고, 필요하면 스토어를 갱신해 다음 트랙/앨범으로 넘기거나 에러를 표시한다.
// useAlbumTracks(TanStack Query 훅)는 컴포넌트 안에서만 호출 가능해 Zustand 스토어에 못 넣는다.
const PlayerPlayabilityCheck = () => {
  const queue = usePlayerStore((state) => state.queue)
  const currentAlbumId = usePlayerStore((state) => state.currentAlbumId)
  // 같은 앨범 안에서 트랙만 이동하는 경우에도 재판별이 필요해 구독한다.
  // (queue/currentAlbumId만 구독하면 트랙 이동 시 이 컴포넌트가 리렌더링되지 않아 판별이 누락됨)
  const currentTrackIndex = usePlayerStore((state) => state.currentTrackIndex)
  const resolveTrackAvailability = usePlayerStore((state) => state.resolveTrackAvailability)

  const currentCollection = currentAlbumId ? (queue.find((c) => c.id === currentAlbumId) ?? null) : null

  const { tracks, isLoading: isTracksLoading } = useAlbumTracks(
    currentCollection?.itunes_collection_id ?? null,
    currentCollection !== null,
  )

  // 렌더링 도중 스토어를 갱신하면 같은 스토어를 구독하는 다른 컴포넌트(MusicPlayer 등)를
  // 렌더링 도중에 갱신하게 되어 순서에 의존하는 문제가 생긴다. 커밋 이후(useEffect)에 처리한다.
  useEffect(() => {
    resolveTrackAvailability(tracks, isTracksLoading)
  }, [tracks, isTracksLoading, currentAlbumId, currentTrackIndex, resolveTrackAvailability])

  return null
}

export default PlayerPlayabilityCheck
