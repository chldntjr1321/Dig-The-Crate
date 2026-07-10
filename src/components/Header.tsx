import { NavLink } from 'react-router'
import useAuth from '../hooks/useAuth'

const Header = () => {
  const { signOut } = useAuth()

  return (
    <header className="sticky top-0 z-10 flex gap-2 items-center h-16 px-4 md:px-16 bg-header border-b border-border">
      {/* 로고 */}
      <NavLink
        to="/"
        className="text-primary font-bold text-[20px] select-none mr-8"
      >
        DigTheCrate
      </NavLink>

      {/* 우측 아이콘 */}
      <div className="ml-auto flex items-center gap-6">
        {/* 검색 돋보기 → 검색 페이지 이동 */}
        <NavLink to="/search" aria-label="검색 페이지로 이동">
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
        </NavLink>

        <button onClick={signOut} aria-label="로그아웃" className="cursor-pointer">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            className="text-secondary hover:text-primary transition-colors"
            aria-hidden="true"
          >
            <path
              d="M7 3H3C2.44772 3 2 3.44772 2 4V14C2 14.5523 2.44772 15 3 15H7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12 12L16 9L12 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 9H7"
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
