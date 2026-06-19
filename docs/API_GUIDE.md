# API Guide

## Discogs API

### 기본 정보

```
Base URL   https://api.discogs.com
인증       Personal Token (헤더에 포함)
Rate Limit 60회 / 분 (Token 사용 시)
```

### 인증 헤더

```typescript
headers: {
  'Authorization': `Discogs token=${import.meta.env.VITE_DISCOGS_TOKEN}`,
  'User-Agent': 'DigTheCrate/1.0'
}
```

> Discogs API는 `User-Agent` 헤더가 없으면 요청이 거부될 수 있다. 반드시 포함한다.

---

### 앨범 검색

```
GET /database/search
```

**파라미터**

| 파라미터   | 타입   | 설명                                       |
| ---------- | ------ | ------------------------------------------ |
| `q`        | string | 검색어 (앨범명, 아티스트명)                |
| `type`     | string | `release` 고정                             |
| `per_page` | number | 한 번에 가져올 결과 수 (기본 10, 최대 100) |
| `page`     | number | 페이지 번호                                |

**예시 요청**

```
GET /database/search?q=Miles+Davis+Kind+of+Blue&type=release&per_page=10
```

**응답 구조**

```typescript
interface DiscogsSearchResponse {
  results: DiscogsRelease[];
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    items: number;
  };
}

interface DiscogsRelease {
  id: number; // discogs_id로 저장할 값
  title: string; // "Kind of Blue" 형태 또는 "Miles Davis - Kind of Blue"
  cover_image: string; // 앨범 커버 이미지 URL
  thumb: string; // 썸네일 URL (blur placeholder용)
  year: string; // 발매 연도
  genre: string[]; // 장르 배열
  style: string[]; // 세부 스타일 배열
  country: string; // 발매 국가
}
```

---

### 장르별 추천

```
GET /database/search?genre={genre}&type=release&per_page=5
```

**사용 장르 목록** (검색 탭 하드코딩)

```typescript
const GENRES = [
  'Jazz',
  'Rock',
  'Electronic',
  'Classical',
  'Hip Hop',
  'R&B',
] as const;
```

---

### 앨범 상세 (tracklist 포함)

```
GET /releases/{release_id}
```

**응답에서 tracklist 추출**

```typescript
interface DiscogsReleaseDetail {
  tracklist: {
    position: string; // "A1", "B2" 등
    title: string; // 트랙명
    duration: string; // "5:32"
  }[];
  // ... 기타 필드
}
```

> 앨범 추가 시 검색 결과와 상세 API를 함께 호출해 tracklist까지 한 번에 저장한다.

---

## iTunes Search API

### 기본 정보

```
Base URL   https://itunes.apple.com
인증       없음 (API 키 불필요)
Rate Limit 명시적 제한 없음 (과도한 호출 자제)
```

---

### 앨범 미리듣기 URL 조회

```
GET /search
```

**파라미터**

| 파라미터 | 타입   | 설명                |
| -------- | ------ | ------------------- |
| `term`   | string | 아티스트명 + 앨범명 |
| `entity` | string | `album`             |
| `limit`  | number | 결과 수 (1~5 권장)  |

**예시 요청**

```
GET /search?term=Miles+Davis+Kind+of+Blue&entity=album&limit=3
```

**응답 구조**

```typescript
interface ItunesSearchResponse {
  resultCount: number;
  results: ItunesAlbum[];
}

interface ItunesAlbum {
  collectionId: number;
  collectionName: string; // 앨범명
  artistName: string; // 아티스트명
  artworkUrl100: string; // 앨범 커버 (100x100)
  collectionViewUrl: string; // iTunes 링크
}
```

> iTunes 앨범 검색은 `previewUrl`을 직접 반환하지 않는다.
> 미리듣기 URL은 트랙 단위 검색에서 가져온다.

---

### 트랙 미리듣기 URL 조회

```
GET /search?term={artist}+{album}&entity=musicTrack&limit=1
```

**응답에서 미리듣기 URL 추출**

```typescript
interface ItunesTrack {
  trackName: string;
  artistName: string;
  collectionName: string;
  previewUrl: string | null; // 30초 미리듣기 MP3 URL (없을 수 있음)
  artworkUrl100: string;
}
```

**주의사항**

- `previewUrl`이 `null`인 경우가 있다. 반드시 null 체크 후 사용한다.
- 매칭 실패 시 (`resultCount === 0`) 미리듣기 버튼을 비활성화한다.

---

## 에러 처리 공통 규칙

| 상황                          | 처리 방법                            |
| ----------------------------- | ------------------------------------ |
| Discogs 429 Too Many Requests | "잠시 후 다시 시도해주세요" 표시     |
| Discogs 네트워크 에러         | "검색 중 문제가 발생했어요" 표시     |
| iTunes 매칭 실패              | 미리듣기 버튼 비활성화               |
| iTunes 네트워크 에러          | 미리듣기 버튼 비활성화               |
| Supabase 401 인증 만료        | 자동 로그아웃 + 로그인 페이지 이동   |
| Supabase 네트워크 에러        | 에러 토스트 + Optimistic Update 롤백 |
