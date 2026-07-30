import type { Track } from '@/types'
import SkeletonBox from '@/components/ui/SkeletonBox'
import cn from '@/utils/cn'

// 실제 트랙 제목처럼 길이가 들쭉날쭉해 보이도록 폭을 다르게 순환
const SKELETON_WIDTHS = ['w-48', 'w-32', 'w-40', 'w-52', 'w-36']

interface TrackListProps {
  tracklist: Track[]
  isLoading: boolean
}

const TrackList = ({ tracklist, isLoading }: TrackListProps) => {
  if (isLoading) {
    return (
      <>
        {SKELETON_WIDTHS.map((width, i) => (
          <div key={i} className="py-2.5">
            <SkeletonBox className={cn('h-3.5 rounded-sm', width)} />
          </div>
        ))}
      </>
    )
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
