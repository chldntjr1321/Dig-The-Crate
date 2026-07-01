import type { Track } from '@/types'

interface TrackListProps {
  tracklist: Track[]
  isLoading: boolean
}

const TrackList = ({ tracklist, isLoading }: TrackListProps) => {
  if (isLoading) {
    return <p className="text-muted text-sm text-center py-4">불러오는 중...</p>
  }

  if (tracklist.length === 0) {
    return (
      <p className="text-muted text-sm text-center py-4">
        수록곡 정보가 없어요
      </p>
    )
  }

  return (
    <>
      {tracklist.map((track, i) => (
        <div key={i} className="flex justify-between items-center py-2.5">
          <div className="flex items-center gap-3">
            <span className="text-muted text-xs w-5 shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-primary text-sm">{track.title}</span>
          </div>
          {track.duration && (
            <span className="text-muted text-xs shrink-0">
              {track.duration}
            </span>
          )}
        </div>
      ))}
    </>
  )
}

export default TrackList
