const BASE_URL = 'https://itunes.apple.com'

interface ItunesTrack {
  previewUrl: string | null
}

interface ItunesTrackSearchResponse {
  resultCount: number
  results: ItunesTrack[]
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
