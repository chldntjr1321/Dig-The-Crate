# 코딩 컨벤션

## 컴포넌트 작성

```typescript
// 화살표 함수로 통일
const AlbumCard = ({ album }: AlbumCardProps) => {
  return (...)
}

export default AlbumCard
```

---

## 타입 정의

```typescript
// type 대신 interface 사용
interface AlbumCardProps {
  album: Collection
}

interface Collection {
  id: string
  user_id: string
  album_name: string
  artist_name: string
  cover_url: string
  year?: string
  genres?: string[]
  tracklist?: Track[]
  added_at: string
}
```

---

## React 타입 import

React 네임스페이스 타입(`React.FormEvent`, `React.MouseEvent` 등) 사용 금지.
반드시 named import + `import type`으로 가져온다.

```typescript
// 금지
import React from 'react'
const handleSubmit = (e: React.FormEvent) => {}

// 허용
import { useState, type FormEvent } from 'react'

// 폼 제출 이벤트는 React의 SubmitEvent 사용 (FormEvent는 deprecated)
import { type SubmitEvent } from 'react'
const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {}
```

> `SubmitEvent`는 React에서 import한다. 브라우저 네이티브 SubmitEvent와 이름이 같지만 다른 타입이다.

---

## utils와 types 구분

`utils/` 폴더에는 순수 함수만 둔다. 타입과 상수(특히 타입과 짝을 이루는 상수)는 `types/index.ts`에 둔다.

```typescript
// 금지 - utils에 타입/상수를 두는 것
// utils/sortOptions.ts
export type SortOption = ...
export const SORT_LABELS: Record<SortOption, string> = { ... }

// 허용 - types/index.ts에 타입과 짝을 이루는 상수를 함께 둘
export type SortOption = ...
export const SORT_LABELS: Record<SortOption, string> = { ... }
```

판단 기준:
- 함수 (로직) → `utils/`
- 타입, 타입과 짝을 이루는 상수 (Record, 배열 등) → `types/index.ts`
- 상수가 많아지면 (대략 5개 이상) `constants/` 폴더 분리를 제안한다.

---

## 파일 네이밍

```
컴포넌트 / 페이지   PascalCase   AlbumCard.tsx, AuthPage.tsx
훅                 camelCase    useAuth.ts, useCollections.ts
서비스 / 유틸       camelCase    collections.ts, discogs.ts, cn.ts
```

---

## 금지 사항

```
any 타입 사용 금지
console.log 커밋에 포함 금지
하드코딩된 색상값 사용 금지 → DESIGN_GUIDE.md 참조
컴포넌트에서 직접 Supabase / fetch 호출 금지
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
- 클릭 가능한 요소는 반드시 `<button>` 또는 `<a>` 태그 사용. `<div>`, `<span>`에 onClick 금지.
- 키보드 탐색 가능하도록 `tabIndex`, `onKeyDown` 고려.
- 색상 대비는 WCAG 2.1 AA 기준 준수.
