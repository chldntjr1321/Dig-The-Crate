interface MusicPlayButtonProps {
  ariaLabel: string
  size?: 'sm' | 'md'
  onClick?: () => void
}

const SIZE_MAP: Record<'sm' | 'md', { button: string; icon: number }> = {
  sm: { button: 'w-8 h-8', icon: 12 },
  md: { button: 'w-10 h-10', icon: 16 },
}

const MusicPlayButton = ({ ariaLabel, size = 'md', onClick }: MusicPlayButtonProps) => {
  const { button, icon } = SIZE_MAP[size]

  return (
    <button
      onClick={onClick}
      className={`pointer-events-auto shrink-0 ${button} rounded-full bg-accent hover:brightness-75 flex items-center justify-center cursor-pointer`}
      aria-label={ariaLabel}
    >
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 10 10"
        aria-hidden="true"
        className="text-white"
      >
        <path d="M2 1L9 5L2 9Z" fill="currentColor" />
      </svg>
    </button>
  )
}

export default MusicPlayButton
