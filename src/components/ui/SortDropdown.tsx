import { useState, useRef, useEffect } from 'react'
import cn from '@/utils/cn'

interface SortDropdownProps<T extends string> {
  value: T
  onChange: (value: T) => void
  labels: Record<T, string>
  theme?: 'dark' | 'light'
}

const THEME_STYLES = {
  dark: {
    button: 'bg-card border-border text-primary hover:bg-border',
    panel: 'bg-card border-border',
    optionActive: 'text-accent bg-border',
    optionDefault: 'text-secondary hover:text-primary hover:bg-border',
  },
  light: {
    button: 'bg-search border-border-search text-search-primary hover:bg-border-search',
    panel: 'bg-search border-border-search',
    optionActive: 'text-accent bg-border-search',
    optionDefault: 'text-search-secondary hover:text-search-primary hover:bg-border-search',
  },
} as const

const SortDropdown = <T extends string,>({
  value,
  onChange,
  labels,
  theme = 'dark',
}: SortDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const styles = THEME_STYLES[theme]

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
        className={cn(
          'flex items-center justify-between gap-2 px-4 py-2 w-44 border rounded-lg transition-colors duration-200 cursor-pointer',
          styles.button,
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-[14px] font-semibold tracking-wide">
          {labels[value]}
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
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
          className={cn(
            'absolute top-full right-0 mt-1 border rounded-lg overflow-hidden z-10 w-44',
            styles.panel,
          )}
        >
          {(Object.keys(labels) as T[]).map((option) => (
            <li key={option} role="option" aria-selected={value === option}>
              <button
                onClick={() => {
                  onChange(option)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full text-left px-4 py-2.5 text-[13px] transition-colors cursor-pointer',
                  value === option ? styles.optionActive : styles.optionDefault,
                )}
              >
                {labels[option]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SortDropdown
