const MusicPlayButton = () => {
  return (
    <button
      className="pointer-events-auto shrink-0 w-10 h-10 rounded-full bg-accent hover:brightness-75 flex items-center justify-center cursor-pointer"
      aria-label="미리듣기 재생"
    >
      <svg
        width="16"
        height="16"
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
