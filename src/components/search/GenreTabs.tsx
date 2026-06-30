import { GENRES, type Genre } from '@/types'

interface GenreTabsProps {
  selected: Genre
  onSelect: (genre: Genre) => void
}

const GenreTabs = ({ selected, onSelect }: GenreTabsProps) => {
  return (
    <div className="flex gap-6 border-b border-border-search overflow-x-auto">
      {GENRES.map((genre) => (
        <button
          key={genre}
          onClick={() => onSelect(genre)}
          className={[
            'pb-3 text-sm border-b-2 transition-colors cursor-pointer shrink-0',
            selected === genre
              ? 'text-accent border-accent'
              : 'text-search-secondary border-transparent hover:text-search-primary',
          ].join(' ')}
          aria-label={`${genre} 장르 선택`}
        >
          {genre}
        </button>
      ))}
    </div>
  )
}

export default GenreTabs
