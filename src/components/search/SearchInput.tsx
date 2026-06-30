import { type ChangeEvent, type KeyboardEvent, useState } from 'react'

interface SearchInputProps {
  onSearch: (value: string) => void
  placeholder?: string
}

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
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
)

const SearchInput = ({
  onSearch,
  placeholder = 'Search artists, albums, or genres...',
}: SearchInputProps) => {
  const [inputValue, setInputValue] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch(inputValue)
  }

  const handleClear = () => {
    setInputValue('')
    onSearch('')
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 items-center gap-5 border-b border-border-search pb-3 pr-3">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-search-primary placeholder:text-search-secondary text-base outline-none pl-3"
          aria-label="앨범 검색"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="text-search-secondary hover:text-search-primary cursor-pointer shrink-0"
            aria-label="검색어 지우기"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        <button
          type="button"
          onClick={() => onSearch(inputValue)}
          className="text-search-secondary hover:text-accent cursor-pointer shrink-0"
          aria-label="검색"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default SearchInput
