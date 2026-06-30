import { useState } from 'react'
import Header from '../components/Header'
import SearchInput from '../components/search/SearchInput'
import SearchResultList from '../components/search/SearchResultList'
import GenreTabs from '../components/search/GenreTabs'
import type { Genre } from '../utils/genres'
import SearchResultCard from '../components/search/SearchResultCard'
import type { SearchResult } from '@/types'

const MOCK_RECOMMENDATIONS: Record<string, SearchResult[]> = {
  All: [
    {
      discogs_id: 'r1',
      album_name: 'Midnight Sessions',
      artist_name: 'The Quintet',
      cover_url: 'https://picsum.photos/seed/album1/400/400',
      year: '2021',
      genres: ['Jazz'],
      tracklist: [
        { position: '1', title: 'Black Focus', duration: '4:28' },
        { position: '2', title: 'Strings of Light', duration: '3:55' },
        { position: '3', title: 'Remembrance', duration: '5:12' },
      ],
    },
    {
      discogs_id: 'r2',
      album_name: 'Analog Dreams',
      artist_name: 'Synthetica',
      cover_url: 'https://picsum.photos/seed/album2/400/400',
      year: '2019',
      genres: ['Electronic'],
      tracklist: [
        { position: '1', title: 'Voltage', duration: '5:30' },
        { position: '2', title: 'Drift', duration: '4:10' },
      ],
    },
    {
      discogs_id: 'r3',
      album_name: 'Northern Woods',
      artist_name: 'Elias Thorne',
      cover_url: 'https://picsum.photos/seed/album3/400/400',
      year: '2022',
      genres: ['Classical'],
      tracklist: [],
    },
    {
      discogs_id: 'r4',
      album_name: 'Heavy Groove',
      artist_name: 'The Motor City Band',
      cover_url: 'https://picsum.photos/seed/album4/400/400',
      year: '2018',
      genres: ['R&B'],
      tracklist: [
        { position: '1', title: 'Engine Room', duration: '3:44' },
        { position: '2', title: 'Funky Town', duration: '4:20' },
      ],
    },
  ],
  Jazz: [
    {
      discogs_id: 'r1',
      album_name: 'Midnight Sessions',
      artist_name: 'The Quintet',
      cover_url: 'https://picsum.photos/seed/album1/400/400',
      year: '2021',
      genres: ['Jazz'],
      tracklist: [
        { position: '1', title: 'Black Focus', duration: '4:28' },
        { position: '2', title: 'Strings of Light', duration: '3:55' },
      ],
    },
    {
      discogs_id: 'r5',
      album_name: 'Blue Hour',
      artist_name: 'Miles & Co.',
      cover_url: 'https://picsum.photos/seed/album5/400/400',
      year: '2020',
      genres: ['Jazz'],
      tracklist: [{ position: '1', title: 'Twilight', duration: '6:10' }],
    },
  ],
  Rock: [
    {
      discogs_id: 'r6',
      album_name: 'Stone Cold',
      artist_name: 'The Ridge',
      cover_url: 'https://picsum.photos/seed/album6/400/400',
      year: '2017',
      genres: ['Rock'],
      tracklist: [
        { position: '1', title: 'Broken Glass', duration: '3:50' },
        { position: '2', title: 'Mountain High', duration: '4:30' },
      ],
    },
  ],
  Electronic: [
    {
      discogs_id: 'r2',
      album_name: 'Analog Dreams',
      artist_name: 'Synthetica',
      cover_url: 'https://picsum.photos/seed/album2/400/400',
      year: '2019',
      genres: ['Electronic'],
      tracklist: [
        { position: '1', title: 'Voltage', duration: '5:30' },
        { position: '2', title: 'Neon Pulse', duration: '6:02' },
      ],
    },
    {
      discogs_id: 'r7',
      album_name: 'Deep Current',
      artist_name: 'Wavform',
      cover_url: 'https://picsum.photos/seed/album7/400/400',
      year: '2023',
      genres: ['Electronic'],
      tracklist: [{ position: '1', title: 'Undertow', duration: '7:15' }],
    },
  ],
  Classical: [
    {
      discogs_id: 'r3',
      album_name: 'Northern Woods',
      artist_name: 'Elias Thorne',
      cover_url: 'https://picsum.photos/seed/album3/400/400',
      year: '2022',
      genres: ['Classical'],
      tracklist: [],
    },
  ],
  'Hip Hop': [
    {
      discogs_id: 'r8',
      album_name: 'Street Lexicon',
      artist_name: 'Prose & Cons',
      cover_url: 'https://picsum.photos/seed/album8/400/400',
      year: '2021',
      genres: ['Hip Hop'],
      tracklist: [
        { position: '1', title: 'First Word', duration: '3:20' },
        { position: '2', title: 'Block Theory', duration: '4:05' },
      ],
    },
  ],
  'R&B': [
    {
      discogs_id: 'r4',
      album_name: 'Heavy Groove',
      artist_name: 'The Motor City Band',
      cover_url: 'https://picsum.photos/seed/album4/400/400',
      year: '2018',
      genres: ['R&B'],
      tracklist: [
        { position: '1', title: 'Engine Room', duration: '3:44' },
        { position: '2', title: 'Funky Town', duration: '4:20' },
      ],
    },
  ],
}

const ALL_MOCK_RESULTS: SearchResult[] = Array.from(
  new Map(
    Object.values(MOCK_RECOMMENDATIONS).flat().map((r) => [r.discogs_id, r]),
  ).values(),
)

const MOCK_ADDED_IDS = new Set(['r2'])

const matchesGenre = (result: SearchResult, genre: Genre) =>
  genre === 'All' || result.genres?.includes(genre)

const SearchPage = () => {
  const [query, setQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<Genre>('All')
  const [addedIds, setAddedIds] = useState<Set<string>>(MOCK_ADDED_IDS)

  const isSearching = query.length > 0

  const recommendations = (MOCK_RECOMMENDATIONS[selectedGenre] ?? [])

  const searchResults = ALL_MOCK_RESULTS.filter(
    (r) =>
      matchesGenre(r, selectedGenre) &&
      (r.album_name.toLowerCase().includes(query.toLowerCase()) ||
        r.artist_name.toLowerCase().includes(query.toLowerCase())),
  )

  const handleAdd = (id: string) => setAddedIds((prev) => new Set(prev).add(id))
  const handleRemove = (id: string) => {
    setAddedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  return (
    <div className="bg-search">
      <Header />
      <main className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto [scrollbar-gutter:stable]">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <SearchInput value={query} onChange={setQuery} />
        </div>

        <div className="max-w-5xl mx-auto px-6 pb-12 flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <GenreTabs selected={selectedGenre} onSelect={setSelectedGenre} />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-8">
              {recommendations.map((result) => (
                <SearchResultCard
                  key={result.discogs_id}
                  result={result}
                  isAdded={addedIds.has(result.discogs_id)}
                  onAdd={() => handleAdd(result.discogs_id)}
                  onRemove={() => handleRemove(result.discogs_id)}
                />
              ))}
            </div>
          </div>

          {isSearching && (
            <>
              <hr className="border-border-search" />
              <SearchResultList
                results={searchResults}
                addedIds={addedIds}
                onAdd={handleAdd}
                onRemove={handleRemove}
                hasSearched={true}
              />
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default SearchPage
