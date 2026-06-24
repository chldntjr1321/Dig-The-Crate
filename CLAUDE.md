# DigTheCrate - CLAUDE.md

## 프로젝트 개요

LP 컬렉션을 디지털로 관리하는 개인 웹앱.
Discogs API로 앨범 정보와 커버 이미지를 가져오고, iTunes API로 30초 미리듣기를 제공한다.
앨범 커버 이미지 최적화(Phase 1)와 LP 플레이어 애니메이션 최적화(Phase 2)가 핵심 기술 포인트.

---

## 기술 스택

```
프레임워크   Vite + React 18 + TypeScript
스타일링     TailwindCSS
서버 상태    TanStack Query
백엔드/인증  Supabase (Auth + DB)
라우팅       react-router
코드 품질    ESLint + Prettier (eslint-config-prettier로 역할 분리)
배포         Vercel
```

---

## Phase 구분

### Phase 1 (현재)

- 로그인 / 회원가입
- 컬렉션 조회 / 검색 / 추가 / 삭제
- 이미지 최적화 (Intersection Observer, blur placeholder, CLS 방지)

### Phase 2 (이후)

- LP 플레이어 UI
- 카드 뒤집기 애니메이션
- LP 회전 애니메이션 최적화

**Phase 1 작업 중 Phase 2 기능을 미리 구현하지 않는다.**

---

## 폴더 구조

```
src/
├── lib/
│   ├── supabase.ts        # Supabase 클라이언트 초기화
│   └── queryClient.ts     # TanStack Query 전역 설정
├── services/
│   ├── discogs.ts         # Discogs API 호출 함수
│   └── collections.ts     # Supabase collections CRUD 함수
├── hooks/
│   ├── useAuth.ts
│   ├── useCollections.ts
│   ├── useAddCollection.ts
│   ├── useDeleteCollection.ts
│   └── useDiscogsSearch.ts
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── PasswordToggle.tsx
│   ├── Header.tsx
│   ├── ProtectedRoute.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── collection/
│   │   ├── AlbumCard.tsx
│   │   └── EmptyCollection.tsx
│   └── search/
│       ├── SearchInput.tsx
│       ├── SearchResultList.tsx
│       └── SearchResultCard.tsx
├── pages/
│   ├── AuthPage.tsx
│   ├── MainPage.tsx
│   └── SearchPage.tsx
├── types/
│   └── index.ts
├── utils/
│   └── cn.ts
├── router.tsx
├── App.tsx
└── main.tsx
```

**폴더 구조는 임의로 변경하지 않는다. 변경이 필요하면 반드시 허락을 받는다.**

---

## 코딩 컨벤션

### 컴포넌트 작성

```typescript
// 화살표 함수로 통일
const AlbumCard = ({ album }: AlbumCardProps) => {
  return (...)
}

export default AlbumCard
```

### 타입 정의

```typescript
// type 대신 interface 사용
interface AlbumCardProps {
  album: Collection;
}

interface Collection {
  id: string;
  user_id: string;
  album_name: string;
  artist_name: string;
  cover_url: string;
  year?: string;
  genres?: string[];
  tracklist?: Track[];
  added_at: string;
}
```

### React 타입 import

React 네임스페이스 타입(`React.FormEvent`, `React.MouseEvent`, `React.ReactNode` 등) 사용 금지.
반드시 `import type`으로 named import한다.

```typescript
// 금지
import React from 'react'
const handleSubmit = (e: React.FormEvent) => {}

// 허용
import { type SubmitEvent } from 'react'
const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {}
```

> `FormEvent`는 React 19에서 deprecated. 폼 제출 이벤트는 React의 `SubmitEvent<HTMLFormElement>` 사용.

### 파일 네이밍

```
컴포넌트 / 페이지   PascalCase   AlbumCard.tsx, AuthPage.tsx
훅                 camelCase    useAuth.ts, useCollections.ts
서비스 / 유틸       camelCase    collections.ts, discogs.ts, cn.ts
```

### 금지 사항

```
any 타입 사용 금지
console.log 커밋에 포함 금지
하드코딩된 색상값 사용 금지 → DESIGN_GUIDE.md 참조
컴포넌트에서 직접 Supabase / fetch 호출 금지
인증 외의 Supabase 호출을 훅에서 직접 작성 금지 (services/ 경유)
```

---

## 아키텍처 규칙

### API 호출 레이어

```
컴포넌트
  → 훅 호출
    → 서비스 함수 호출      ← DB 쿼리 / 외부 API
      → Supabase / 외부 API
```

- DB 쿼리와 외부 API 호출은 반드시 `services/` 폴더의 함수를 통해서만 한다.
- 훅에서 직접 Supabase DB 쿼리 작성 금지.
- **인증(Auth)은 예외**: `useAuth.ts`에서 `supabase.auth`를 직접 호출한다. `services/auth.ts`는 만들지 않는다.

### ProtectedRoute

`ProtectedRoute` 컴포넌트는 `components/ProtectedRoute.tsx`로 분리한다.
`router.tsx`에 컴포넌트와 객체를 같이 두면 Vite Fast Refresh 경고가 발생하기 때문이다.

```tsx
const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner />      // 세션 확인 중
  if (!user) return <Navigate to="/login" />  // 비로그인 시 로그인 페이지로
  return <Outlet />                           // 로그인 시 자식 라우트 렌더링
}
```

`useNavigate`로 직접 이동하지 않는다. `user`가 `null`이 되면 `ProtectedRoute`가 자동으로 로그인 페이지로 보낸다.

### 상태 관리

```
서버 상태 (API에서 가져오는 데이터)  → TanStack Query
로컬 상태 (UI 상태, 입력값 등)       → useState
```

### Optimistic Update

추가 / 삭제는 TanStack Query의 `onMutate / onError / onSettled` 패턴으로 구현한다.

```typescript
useMutation({
  mutationFn: ...,
  onMutate: async () => {
    // 1. 진행 중인 쿼리 취소
    // 2. 현재 데이터 백업
    // 3. UI 즉각 반영
    // 4. 백업 반환
  },
  onError: (err, variables, context) => {
    // 백업으로 롤백
    // 에러 토스트 표시
  },
  onSettled: () => {
    // 서버 상태 재확인
  }
})
```

---

## 개발 방식

### UI 먼저, 로직 나중에

1. 목업 데이터로 UI 완성
2. 실제 API / 훅 연결

### 이슈 기반 작업

- Phase 시작 전 해당 Phase의 작업을 이슈로 먼저 등록한다.
- 이슈 하나 = 작업 하나 (크게 묶지 않는다)
- 이슈 단위로 브랜치 생성 → 작업 → PR → 머지
- PR 생성 시 GitHub Wiki도 함께 업데이트한다.

### 최적화 시점

- 이미지 최적화는 의도적으로 나중에 진행한다.
- Phase 1 초기에는 `<img src={cover_url} />` 그대로 사용.
- 성능 문제를 직접 체감한 후에 최적화 작업을 시작한다.
- 처음부터 LazyImage 컴포넌트를 만들지 않는다.

---

## Wiki 작성 규칙

PR을 올릴 때 반드시 Wiki를 함께 업데이트한다.

### 작성 형식

```markdown
## {이슈 번호} - {작업 제목}

### 작업 요약
한 두 줄로 무엇을 했는지 작성

### 기술적 결정
| 결정 | 이유 |
|------|------|
| 선택한 것 | 선택한 이유 |
| 선택하지 않은 것 | 선택하지 않은 이유 |

### 구현 상세
핵심 구현 내용만 간단하게

### 트러블슈팅
문제가 있었을 경우에만 작성
- 문제:
- 원인:
- 해결:

### 참고
관련 링크나 문서 (있을 경우에만)
```

### 작성 기준
- "무엇을" 했는지보다 "왜 이렇게 했는지"를 중심으로 작성
- 기술적 결정은 선택한 것과 선택하지 않은 것 모두 기록
- 트러블슈팅은 문제가 있었을 경우에만 작성
- 너무 길게 쓰지 않아도 됨. 작업 요약 + 결정 이유 + 트러블슈팅이 핵심

---

## 커밋 컨벤션

```
feat     새로운 기능
fix      버그 수정
design   UI / 스타일 작업
refactor 기능 변경 없는 코드 개선
docs     문서 작업
chore    설정, 패키지 등 기타
remove   파일 / 코드 삭제
```

```
예시
feat: 앨범 검색 기능 구현
design: AlbumCard 호버 스타일 적용
fix: 컬렉션 삭제 시 Optimistic Update 롤백 오류 수정
```

---

## 브랜치 전략

```
main    배포용 (직접 커밋 금지)
dev     개발 통합 브랜치
feature 기능 단위 작업 브랜치
```

### 브랜치 네이밍

```
type/작업명/이슈번호

예시
feat/login-ui/3
feat/album-search/7
fix/delete-rollback/12
design/album-card-hover/9
```

### 작업 흐름

```
feature 브랜치 생성
→ 작업
→ PR to dev
→ 코드 리뷰
→ dev 머지
→ dev to main PR
→ 배포
```

---

## Claude Code 규칙

### 작업 범위

- 구현은 Claude Code가 담당하고, 작업자가 코드를 검토하고 질문하는 형태로 진행한다.
- 한 번에 너무 많이 구현하지 않는다. 이슈 단위로 작게 작업한다.

### 단계별 승인 절차

1. 무엇을 할지 먼저 설명한다.
2. 작업자가 승인하면 그때 작업을 진행한다.
3. 작업 완료 후 무엇이 어떻게 바뀌었는지 보고한다.
4. 작업자가 승인하면 다음 단계로 넘어간다. 질문이 있으면 먼저 답한다.
5. **작업자의 승인 없이 다음 단계로 절대 넘어가지 않는다.**

### 소통 언어

- 모든 응답과 주석은 한국어로 작성한다.

### 절대 하면 안 되는 것

```
DB 스키마 변경
.env 파일 접근 또는 수정
허락 없이 새 라이브러리 / 패키지 설치
폴더 구조 임의 변경
Phase 1 작업 중 Phase 2 기능 미리 구현
이미지 최적화 미리 적용 (LazyImage 등)
하드코딩된 색상값 사용
컴포넌트에서 직접 Supabase / API 호출
any 타입 사용
console.log 커밋
```

### 허락이 필요한 것

```
새 라이브러리 설치가 필요한 경우 → 이유와 함께 먼저 제안
폴더 구조 변경이 필요한 경우 → 이유와 함께 먼저 제안
DB 관련 변경이 필요한 경우 → 반드시 먼저 논의
```

---

## 디자인 규칙

- 색상, 컴포넌트 스타일은 반드시 `DESIGN_GUIDE.md`를 참조한다.
- 임의의 색상값(`#ffffff`, `rgb(...)` 등) 직접 사용 금지.
- 모든 버튼에 `cursor-pointer` 포함. disabled 상태에서는 `cursor-not-allowed`.

---

## 접근성

- 이미지에 항상 `alt` 속성 포함.
- 버튼과 인터랙티브 요소에 적절한 `aria-label` 작성.
- 시맨틱 HTML 사용 (`button`, `nav`, `main`, `section` 등).
- 키보드 탐색 가능하도록 `tabIndex`, `onKeyDown` 고려.
- 색상 대비는 WCAG 2.1 AA 기준 준수 (DESIGN_GUIDE.md 색상 토큰 사용 시 충족).

---

## 환경변수

`.env` 파일은 절대 건드리지 않는다.
필요한 환경변수 목록만 참고한다.

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_DISCOGS_TOKEN
```

---

## 참고 문서

| 문서          | 위치                | 설명                                             |
| ------------- | ------------------- | ------------------------------------------------ |
| 디자인 가이드 | `DESIGN_GUIDE.md`   | 색상 토큰, 컴포넌트 스타일, 애니메이션 규칙      |
| DB 스키마     | `docs/DB_SCHEMA.md` | collections 테이블 구조, RLS 정책, SQL           |
| API 가이드    | `docs/API_GUIDE.md` | Discogs / iTunes 엔드포인트, 파라미터, 응답 구조 |

**컴포넌트 작성 전 반드시 `DESIGN_GUIDE.md`를 참조한다.**
**서비스 함수 작성 전 반드시 `docs/API_GUIDE.md`를 참조한다.**
**DB 관련 작업 전 반드시 `docs/DB_SCHEMA.md`를 참조한다.**
