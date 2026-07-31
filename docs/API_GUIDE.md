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
| `sort`     | string | 정렬 기준 (아래 "정렬 파라미터" 참조)      |
| `sort_order` | string | `asc` \| `desc`                          |

**예시 요청**

```
GET /database/search?q=Miles+Davis+Kind+of+Blue&type=release&per_page=10
```

---

### 정렬 파라미터 (`sort`, `sort_order`)

> ⚠️ **비공식 동작**: `sort`/`sort_order`는 Discogs 공식 API 문서(discogs.com/developers)에 문서화되어 있지 않은 파라미터다. 실제 요청/응답을 반복 테스트해서 검증한 결과이며, Discogs가 내부 구현을 바꾸면 예고 없이 동작이 달라지거나 깨질 수 있다.

**실제로 정렬되는 값** (직접 검증 완료)

| 값     | 설명                       |
| ------ | -------------------------- |
| `year` | 발매 연도                  |
| `want` | 위시리스트에 담은 사용자 수 |
| `have` | 소장 등록한 사용자 수       |

**파라미터는 받지만 실제로 정렬 안 되는 값** (관련도순으로 조용히 폴백됨)

```
artist, title, release_title, label, catno, format,
added_date, id, master_id, num_for_sale, country, barcode, format_quantity
```

텍스트 필드(`artist`, `title` 등)는 검색엔진에 정렬 가능한 형태로 인덱싱되어 있지 않아서 발생하는 것으로 추정된다. 즉 **아티스트명순 / 앨범명순 정렬은 서버에서 지원 불가능**하다.

**복합 정렬 불가**: `sort=want,year`처럼 여러 필드를 조합하는 시도(콤마, 파이프, 공백, 세미콜론, 배열 문법, 파라미터 반복 등)는 전부 실패한다. 한 번에 하나의 필드만 정렬 기준으로 지정 가능하다.

**예시 요청**

```
GET /database/search?q=Miles+Davis&type=release&sort=year&sort_order=desc
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

### 앨범 전곡 조회 (Lookup API)

트랙 단위 텍스트 검색(`entity=musicTrack`)은 검색어가 모호하면 전혀 다른 아티스트/앨범의 곡이 1등으로 매칭될 수 있다 (예: `"한요한 범퍼카"` 검색 시 무관한 아티스트의 곡이 반환됨). 이를 피하기 위해 앨범 전곡 재생은 텍스트 검색 대신 **collectionId 기반 Lookup**을 사용한다.

**저장 시점** — 컬렉션에 앨범을 추가할 때 `entity=album` 검색으로 `collectionId`를 1회 확보해 `collections.itunes_collection_id`에 저장한다 (`services/itunes.ts`의 `findCollectionId`). 매칭 실패 시 `null`을 저장하고, 이후 재생 버튼을 비활성화한다.

**재생 시점** — 저장된 `itunes_collection_id`로 Lookup API를 호출해 그 앨범에 속한 트랙만 정확히 조회한다 (`services/itunes.ts`의 `getAlbumTracks`).

```
GET /lookup?id={collectionId}&entity=song
```

**응답 구조**

```typescript
interface ItunesLookupResponse {
  resultCount: number;
  results: ItunesLookupResult[]; // 첫 번째 원소는 앨범 자체(wrapperType: "collection"), 이후 트랙들(wrapperType: "track")
}

interface ItunesLookupResult {
  wrapperType: string;
  trackNumber?: number; // 트랙에만 존재
  trackName?: string; // 트랙에만 존재
  previewUrl: string | null;
}
```

**주의사항**

- `wrapperType === "track"`인 항목만 걸러서 사용한다.
- `trackNumber` 오름차순으로 정렬해 재생 순서를 보장한다.
- 텍스트 매칭이 아니라 ID 기반 조회라 오매칭 위험이 없다.

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
