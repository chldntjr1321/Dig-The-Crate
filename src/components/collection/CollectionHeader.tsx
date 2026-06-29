import SortDropdown from './SortDropdown'
import { type SortOption } from '../../utils/sortOptions'

interface CollectionHeaderProps {
  nickname: string
  count: number
  sortBy: SortOption
  onSortChange: (value: SortOption) => void
}

const CollectionHeader = ({ nickname, count, sortBy, onSortChange }: CollectionHeaderProps) => {
  return (
    <div className="flex justify-between items-center pb-3 mb-8 border-b border-metal/40">
      <p className="text-primary text-[20px] font-semibold ml-4">
        <span className="text-accent">{nickname}</span>'s 플레이리스트
        <span className="text-secondary text-[14px] font-normal ml-2">({count})</span>
      </p>
      <SortDropdown value={sortBy} onChange={onSortChange} />
    </div>
  )
}

export default CollectionHeader
