import SkeletonBox from '../ui/SkeletonBox'

const SKELETON_COUNT = 6

const CollectionSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
      <div key={i} className="relative">
        <SkeletonBox className="aspect-square w-full" />
        <div className="mt-1 h-0.5 bg-skeleton-base w-[calc(100%+16px)] -ml-2" />
      </div>
    ))}
  </div>
)

export default CollectionSkeleton
