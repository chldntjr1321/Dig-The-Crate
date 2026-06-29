/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 메인 페이지 (다크 테마) — DESIGN_GUIDE.md 참조
        page: '#1A1108',       // bg-page
        wall: '#3D2514',       // bg-wall
        card: '#2A1E13',       // bg-card
        form: '#281E14',       // bg-form (auth 폼 카드 배경)
        field: '#1B1209',      // bg-field (인풋 필드 배경)
        header: '#120D07',     // bg-header
        primary: '#F5F0E8',    // text-primary
        secondary: '#A8A29E',  // text-secondary
        muted: '#6B5E52',      // text-muted
        accent: {
          DEFAULT: '#C4854A',  // accent
          hover: '#D4956A',    // accent-hover
        },
        border: '#3A2C22',     // border
        metal: '#71717A',      // metal

        // 검색 페이지 (라이트 테마)
        search: '#FAFAFA',              // bg-search
        'search-primary': '#1C1208',    // text-search-primary
        'search-secondary': '#78716C',  // text-search-secondary
        'border-search': '#E7E5E4',     // border-search

        // 공통
        disabled: '#4A3E35',
        'skeleton-base': '#2A1E13',
        'skeleton-shine': '#3D2F22',
      },
    },
  },
  plugins: [],
}

