import { useState, useRef, useEffect } from 'react'
import { type SortOption, SORT_LABELS } from '../../utils/sortOptions'

interface SortDropdownProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

const SortDropdown = ({ value, onChange }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between gap-2 px-4 py-2 w-44 bg-card border border-border rounded-lg text-primary hover:bg-border transition-colors duration-200 cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-[14px] font-semibold tracking-wide">
          {SORT_LABELS[value]}
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute top-full right-0 mt-1 bg-card border border-border rounded-lg overflow-hidden z-10 w-44"
        >
          {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
            <li key={option} role="option" aria-selected={value === option}>
              <button
                onClick={() => {
                  onChange(option)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors cursor-pointer ${
                  value === option
                    ? 'text-accent bg-border'
                    : 'text-secondary hover:text-primary hover:bg-border'
                }`}
              >
                {SORT_LABELS[option]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SortDropdown
