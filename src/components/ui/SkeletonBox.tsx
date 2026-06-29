import cn from '../../utils/cn'

interface SkeletonBoxProps {
  className?: string
}

const SkeletonBox = ({ className }: SkeletonBoxProps) => (
  <span
    role="status"
    aria-busy="true"
    aria-label="로딩 중"
    className={cn('block skeleton-shimmer', className)}
  />
)

export default SkeletonBox
