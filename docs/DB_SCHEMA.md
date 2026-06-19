# DB Schema

## 개요

Supabase Auth가 사용자 관리를 전담한다.
별도의 users 테이블 없이 `auth.users`를 그대로 참조한다.

---

## collections 테이블

### SQL

```sql
CREATE TABLE collections (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  discogs_id TEXT        NOT NULL,
  album_name TEXT        NOT NULL,
  artist_name TEXT       NOT NULL,
  cover_url  TEXT        NOT NULL,
  year       TEXT,
  genres     TEXT[],
  tracklist  JSONB,
  added_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE (user_id, discogs_id)
);
```

### 컬럼 설명

| 컬럼          | 타입        | 설명                                |
| ------------- | ----------- | ----------------------------------- |
| `id`          | UUID        | PK, 자동 생성                       |
| `user_id`     | UUID        | auth.users 참조, 누구의 컬렉션인지  |
| `discogs_id`  | TEXT        | Discogs release ID (중복 방지 기준) |
| `album_name`  | TEXT        | 앨범명                              |
| `artist_name` | TEXT        | 아티스트명                          |
| `cover_url`   | TEXT        | Discogs 앨범 커버 이미지 URL        |
| `year`        | TEXT        | 발매 연도 (없을 수 있음)            |
| `genres`      | TEXT[]      | 장르 배열 (예: ["Jazz", "Soul"])    |
| `tracklist`   | JSONB       | 수록곡 목록 (Phase 2 LP 뒷면용)     |
| `added_at`    | TIMESTAMPTZ | 컬렉션 추가 시각                    |

### UNIQUE 제약

```sql
UNIQUE (user_id, discogs_id)
```

같은 유저가 같은 Discogs 앨범을 중복 추가할 수 없다.

### tracklist JSONB 구조

```json
[
  { "position": "A1", "title": "So What", "duration": "9:22" },
  { "position": "A2", "title": "Freddie Freeloader", "duration": "9:46" },
  { "position": "B1", "title": "All Blues", "duration": "11:33" }
]
```

---

## RLS (Row Level Security)

RLS를 활성화하고 본인 데이터만 접근 가능하도록 정책을 설정한다.

```sql
-- RLS 활성화
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- 조회: 본인 데이터만
CREATE POLICY "본인 컬렉션만 조회 가능"
  ON collections FOR SELECT
  USING (auth.uid() = user_id);

-- 추가: 본인 데이터만
CREATE POLICY "본인 컬렉션만 추가 가능"
  ON collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 삭제: 본인 데이터만
CREATE POLICY "본인 컬렉션만 삭제 가능"
  ON collections FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 주의사항

- DB 스키마는 임의로 변경하지 않는다.
- 변경이 필요한 경우 반드시 우석님의 허락을 받는다.
- Supabase 대시보드에서 직접 수정하지 않는다.
