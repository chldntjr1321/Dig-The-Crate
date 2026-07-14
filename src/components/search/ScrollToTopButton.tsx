import UpIcon from '../ui/UpIcon'

const ScrollToTopButton = () => {
  return (
    <button
      type="button"
      aria-label="맨 위로 이동"
      className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary shadow-xl transition-opacity duration-200 ease-in-out hover:bg-accent-hover cursor-pointer"
    >
      <UpIcon className="h-5 w-5" />
    </button>
  )
}

export default ScrollToTopButton
