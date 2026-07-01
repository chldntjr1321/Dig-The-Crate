import { parseDiscogsTitle } from '../utils/parseDiscogsTitle'
import type { SearchResult, Track } from '../types'

const BASE_URL = 'https://api.discogs.com'

const DISCOGS_HEADERS = {
  Authorization: `Discogs token=${import.meta.env.VITE_DISCOGS_TOKEN}`,
  'User-Agent': 'DigTheCrate/1.0',
}

export class DiscogsRateLimitError extends Error {}
export class DiscogsNetworkError extends Error {}

interface DiscogsRelease {
  id: number
  title: string
  cover_image: string
  thumb: string
  year: string
  genre: string[]
  style: string[]
  country: string
}

interface DiscogsSearchResponse {
  results: DiscogsRelease[]
  pagination: {
    page: number
    pages: number
    per_page: number
    items: number
  }
}

interface DiscogsReleaseDetail {
  tracklist: {
    position: string
    title: string
    duration: string
  }[]
}

const request = async <T>(
  path: string,
  params: Record<string, string | number>,
): Promise<T> => {
  const url = new URL(`${BASE_URL}${path}`)
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, String(value)),
  )

  let response: Response
  try {
    response = await fetch(url.toString(), { headers: DISCOGS_HEADERS })
  } catch {
    throw new DiscogsNetworkError('검색 중 문제가 발생했어요')
  }

  if (response.status === 429) {
    throw new DiscogsRateLimitError('잠시 후 다시 시도해주세요')
  }
  if (!response.ok) {
    throw new DiscogsNetworkError('검색 중 문제가 발생했어요')
  }

  return response.json() as Promise<T>
}

const mapToSearchResult = (release: DiscogsRelease): SearchResult => {
  const { artist_name, album_name } = parseDiscogsTitle(release.title)
  return {
    discogs_id: String(release.id),
    album_name,
    artist_name,
    cover_url: release.cover_image,
    year: release.year,
    genres: release.genre,
  }
}

export const searchAlbums = async (
  query: string,
  page = 1,
  perPage = 20,
): Promise<SearchResult[]> => {
  const data = await request<DiscogsSearchResponse>('/database/search', {
    q: query,
    type: 'release', // artist, label 등 다른 타입 제외하고 실제 발매반(release)만 검색
    per_page: perPage,
    page,
  })
  return data.results.map(mapToSearchResult)
}

export const searchByGenre = async (
  genre: string,
  perPage = 5,
): Promise<SearchResult[]> => {
  const data = await request<DiscogsSearchResponse>('/database/search', {
    genre,
    type: 'release', // artist, label 등 다른 타입 제외하고 실제 발매반(release)만 검색
    per_page: perPage,
  })
  return data.results.map(mapToSearchResult)
}

export const getReleaseDetail = async (releaseId: string): Promise<Track[]> => {
  const data = await request<DiscogsReleaseDetail>(`/releases/${releaseId}`, {})
  return data.tracklist.map((track) => ({
    position: track.position,
    title: track.title,
    duration: track.duration,
  }))
}
