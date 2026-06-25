import { Link } from 'react-router'

const EmptyCollection = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-md w-full">
      {/* LP 레코드 아이콘 */}
      <div className="mb-8 opacity-40">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          className="text-muted"
          aria-hidden="true"
        >
          <circle
            cx="40"
            cy="40"
            r="38"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            cx="40"
            cy="40"
            r="14"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="40" cy="40" r="4" fill="currentColor" />
        </svg>
      </div>

      <h2 className="text-primary text-[24px] font-semibold mb-3">
        아직 추가한 앨범이 없어요
      </h2>
      <p className="text-secondary text-[16px] mb-10">
        첫 번째 앨범을 추가해보세요!
      </p>

      <Link
        to="/search"
        className="bg-wall border border-metal rounded px-8 py-4 flex items-center gap-2 text-primary text-[14px] font-semibold tracking-wide transition-all duration-200 cursor-pointer hover:border-accent hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(196,133,74,0.1)] active:translate-y-px"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className="text-muted group-hover:text-accent transition-colors"
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
        검색하러 가기
      </Link>
    </div>
  )
}

export default EmptyCollection
