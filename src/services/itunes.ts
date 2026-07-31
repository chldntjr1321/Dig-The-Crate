const BASE_URL = 'https://itunes.apple.com'

interface ItunesTrack {
  previewUrl: string | null
}

interface ItunesTrackSearchResponse {
  resultCount: number
  results: ItunesTrack[]
}

interface ItunesAlbum {
  collectionId: number
}

interface ItunesAlbumSearchResponse {
  resultCount: number
  results: ItunesAlbum[]
}

// 앨범 전곡 재생(lookup) 기준점이 되는 collectionId 조회. 매칭 실패/네트워크 에러 시 null 반환
export const findCollectionId = async (
  artistName: string,
  albumName: string,
): Promise<string | null> => {
  const url = new URL(`${BASE_URL}/search`)
  url.searchParams.set('term', `${artistName} ${albumName}`)
  url.searchParams.set('entity', 'album')
  url.searchParams.set('limit', '1')

  let response: Response
  try {
    response = await fetch(url.toString())
  } catch {
    return null
  }

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as ItunesAlbumSearchResponse
  if (data.resultCount === 0) {
    return null
  }

  return String(data.results[0].collectionId)
}

interface ItunesLookupResult {
  wrapperType: string
  trackNumber?: number
  trackName?: string
  previewUrl: string | null
}

interface ItunesLookupResponse {
  resultCount: number
  results: ItunesLookupResult[]
}

export interface AlbumTrack {
  trackName: string
  previewUrl: string | null
}

const isTrackResult = (
  result: ItunesLookupResult,
): result is ItunesLookupResult & { trackNumber: number; trackName: string } =>
  result.wrapperType === 'track' &&
  result.trackNumber !== undefined &&
  result.trackName !== undefined

// DB에 저장된 itunesCollectionId로 앨범에 속한 트랙 전체를 trackNumber 순으로 조회.
// 텍스트 검색이 아니라 ID 기반 조회라 오매칭 위험이 없음
export const getAlbumTracks = async (itunesCollectionId: string): Promise<AlbumTrack[]> => {
  const url = new URL(`${BASE_URL}/lookup`)
  url.searchParams.set('id', itunesCollectionId)
  url.searchParams.set('entity', 'song')

  let response: Response
  try {
    response = await fetch(url.toString())
  } catch {
    return []
  }

  if (!response.ok) {
    return []
  }

  const data = (await response.json()) as ItunesLookupResponse

  return data.results
    .filter(isTrackResult)
    .sort((a, b) => a.trackNumber - b.trackNumber)
    .map((track) => ({ trackName: track.trackName, previewUrl: track.previewUrl }))
}

// 매칭 실패/네트워크 에러 모두 null 반환 → 호출부에서 재생 버튼 비활성화 처리 (docs/API_GUIDE.md 참조)
export const getPreviewUrl = async (
  artistName: string,
  albumName: string,
): Promise<string | null> => {
  const url = new URL(`${BASE_URL}/search`)
  url.searchParams.set('term', `${artistName} ${albumName}`)
  url.searchParams.set('entity', 'musicTrack')
  url.searchParams.set('limit', '1')

  let response: Response
  try {
    response = await fetch(url.toString())
  } catch {
    return null
  }

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as ItunesTrackSearchResponse
  if (data.resultCount === 0) {
    return null
  }

  return data.results[0].previewUrl
}
