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

## 현재 Phase

**Phase 1 진행 중**

- 로그인 / 회원가입
- 컬렉션 조회 / 검색 / 추가 / 삭제
- 이미지 최적화

**Phase 1 작업 중 Phase 2 기능을 미리 구현하지 않는다.**

---

## 작업 전 필독 규칙

**모든 작업 전에 아래 문서 중 해당하는 것을 반드시 읽는다.**

| 작업 유형                 | 읽어야 할 문서         |
| ------------------------- | ---------------------- |
| 코딩 / 컴포넌트 작성      | `docs/CONVENTIONS.md`  |
| 폴더 구조 / 아키텍처 관련 | `docs/ARCHITECTURE.md` |
| PR / 커밋 / 브랜치 / Wiki | `docs/WORKFLOW.md`     |
| DB 관련 작업              | `docs/DB_SCHEMA.md`    |
| API 호출 함수 작성        | `docs/API_GUIDE.md`    |
| UI 컴포넌트 작성          | `DESIGN_GUIDE.md`      |

---

## 단계별 승인 절차

1. 무엇을 할지, 어떤 문서를 참조했는지 먼저 설명한다.
2. 작업자가 승인하면 그때 작업을 진행한다.
3. 작업 완료 후 무엇이 어떻게 바뀌었는지 보고한다.
4. 작업자가 승인하면 다음 단계로 넘어간다. 질문이 있으면 먼저 답한다.
5. **작업자의 승인 없이 다음 단계로 절대 넘어가지 않는다.**

---

## 절대 하면 안 되는 것

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

## 허락이 필요한 것

```
새 라이브러리 설치 → 이유와 함께 먼저 제안
폴더 구조 변경   → 이유와 함께 먼저 제안
DB 관련 변경     → 반드시 먼저 논의
```

---

## 소통 언어

모든 응답과 주석은 한국어로 작성한다.

---

## 참고 문서 전체 목록

| 문서          | 위치                   | 설명                                         |
| ------------- | ---------------------- | -------------------------------------------- |
| 코딩 컨벤션   | `docs/CONVENTIONS.md`  | 코딩 스타일, React 타입, 접근성, 디자인 규칙 |
| 아키텍처      | `docs/ARCHITECTURE.md` | 폴더 구조, API 레이어, 상태 관리             |
| 워크플로우    | `docs/WORKFLOW.md`     | 개발 방식, 커밋, 브랜치, Wiki 작성           |
| 디자인 가이드 | `DESIGN_GUIDE.md`      | 색상 토큰, 컴포넌트 스타일, UI 레퍼런스      |
| DB 스키마     | `docs/DB_SCHEMA.md`    | collections 테이블 구조, RLS 정책            |
| API 가이드    | `docs/API_GUIDE.md`    | Discogs / iTunes 엔드포인트, 응답 구조       |
