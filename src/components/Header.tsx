import { NavLink } from 'react-router'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-[14px] transition-colors ${isActive ? 'text-accent' : 'text-secondary hover:text-primary'}`

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex gap-2 items-center h-16 px-32 bg-header border-b border-border">
      {/* 로고 */}
      <NavLink
        to="/"
        className="text-primary font-bold text-[20px] select-none mr-8"
      >
        DigTheCrate
      </NavLink>

      {/* 네비게이션 */}
      <nav className="flex items-center gap-6" aria-label="주요 메뉴">
        <NavLink to="/" end className={navLinkClass}>
          Collection
        </NavLink>

        <NavLink to="/search" className={navLinkClass}>
          Search
        </NavLink>
      </nav>

      {/* 우측 아이콘 */}
      <div className="ml-auto flex items-center gap-4">
        {/* 검색 돋보기 */}
        {/* TODO: 검색 모달 또는 인풋 구현 후 onClick 연결 */}
        <button onClick={() => {}} aria-label="검색" className="cursor-pointer">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            className="text-secondary hover:text-primary transition-colors cursor-pointer"
            aria-hidden="true"
          >
            <circle
              cx="8"
              cy="8"
              r="5.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M12.5 12.5L16 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Header
