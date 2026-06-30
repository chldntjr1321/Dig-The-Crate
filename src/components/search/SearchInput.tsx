import { type ChangeEvent } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const SearchInput = ({ value, onChange, placeholder = 'Search artists, albums, or genres...' }: SearchInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="flex items-center gap-5 border-b border-border-search pb-3 pr-3">
      <svg
        className="w-5 h-5 text-accent shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-search-primary placeholder:text-search-secondary text-base outline-none"
        aria-label="앨범 검색"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="text-search-secondary hover:text-search-primary cursor-pointer shrink-0"
          aria-label="검색어 지우기"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default SearchInput
