# 아키텍처

## 폴더 구조

```
src/
├── lib/
│   ├── supabase.ts        # Supabase 클라이언트 초기화
│   └── queryClient.ts     # TanStack Query 전역 설정
├── services/
│   ├── discogs.ts         # Discogs API 호출 함수 (미구현)
│   └── collections.ts     # Supabase collections CRUD 함수
├── hooks/
│   ├── useAuth.ts
│   ├── useCollections.ts
│   ├── useDelayedLoading.ts
│   ├── useAddCollection.ts    # 미구현
│   ├── useDeleteCollection.ts # 미구현
│   └── useDiscogsSearch.ts    # 미구현
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Modal.tsx
│   │   └── SkeletonBox.tsx
│   ├── Header.tsx
│   ├── ProtectedRoute.tsx
│   ├── auth/
│   │   ├── AuthInput.tsx
│   │   ├── LoginForm.tsx
│   │   ├── PasswordToggle.tsx
│   │   └── SignupForm.tsx
│   ├── collection/
│   │   ├── AlbumCard.tsx
│   │   ├── CollectionHeader.tsx
│   │   ├── CollectionSkeleton.tsx
│   │   ├── DeleteConfirmModal.tsx
│   │   ├── EmptyCollection.tsx
│   │   └── SortDropdown.tsx
│   └── search/
│       ├── SearchInput.tsx
│       ├── SearchResultList.tsx   # 미구현
│       └── SearchResultCard.tsx
├── pages/
│   ├── AuthPage.tsx
│   ├── MainPage.tsx
│   └── SearchPage.tsx
├── types/
│   └── index.ts
├── utils/
│   ├── cn.ts
│   ├── sortCollections.ts
│   └── sortOptions.ts
├── router.tsx
├── App.tsx
└── main.tsx
```

**폴더 구조는 임의로 변경하지 않는다. 변경이 필요하면 반드시 허락을 받는다.**

---

## API 호출 레이어

```
컴포넌트
  → 훅 호출
    → 서비스 함수 호출
      → Supabase / 외부 API
```

- DB 쿼리와 외부 API 호출은 반드시 `services/` 폴더의 함수를 통해서만 한다.
- 훅에서 직접 Supabase DB 쿼리 작성 금지.
- **인증(Auth)은 예외**: `useAuth.ts`에서 `supabase.auth`를 직접 호출한다. `services/auth.ts`는 만들지 않는다.

---

## ProtectedRoute

`ProtectedRoute` 컴포넌트는 `components/ProtectedRoute.tsx`에 위치한다.
`router.tsx`에 컴포넌트와 객체를 같이 두면 Vite Fast Refresh 경고가 발생하기 때문에 분리한다.

```tsx
const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner /> // 세션 확인 중
  if (!user) return <Navigate to="/login" /> // 비로그인 시 로그인 페이지로
  return <Outlet /> // 로그인 시 자식 라우트 렌더링
}
```

`useNavigate`로 직접 이동하지 않는다. `user`가 `null`이 되면 `ProtectedRoute`가 자동으로 로그인 페이지로 보낸다.

---

## 상태 관리

```
서버 상태 (API에서 가져오는 데이터)  → TanStack Query
로컬 상태 (UI 상태, 입력값 등)       → useState
```

Phase 2에서 LP 플레이어 전역 상태가 필요해질 경우 Context 또는 Zustand 도입을 검토한다.

---

## Optimistic Update

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

## 환경변수

`.env` 파일은 절대 건드리지 않는다.

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_DISCOGS_TOKEN
```
