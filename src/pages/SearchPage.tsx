import { useState } from 'react'
import Header from '../components/Header'
import SearchInput from '../components/search/SearchInput'
import SearchResultCard from '../components/search/SearchResultCard'
import type { SearchResult } from '@/types'

const MOCK_RESULTS: SearchResult[] = [
  {
    discogs_id: '1',
    album_name: 'Midnight Sessions',
    artist_name: 'The Quintet',
    cover_url: 'https://picsum.photos/seed/album1/400/400',
    year: '2021',
    genres: ['Jazz'],
    tracklist: [
      { position: '1', title: 'Black Focus', duration: '4:28' },
      { position: '2', title: 'Strings of Light', duration: '3:55' },
      { position: '3', title: 'Remembrance', duration: '5:12' },
      { position: '4', title: 'Yo Chavez', duration: '4:01' },
      { position: '5', title: "Aida's Theme", duration: '2:45' },
    ],
  },
  {
    discogs_id: '2',
    album_name: 'Analog Dreams',
    artist_name: 'Synthetica',
    cover_url: 'https://picsum.photos/seed/album2/400/400',
    year: '2019',
    genres: ['Electronic'],
    tracklist: [
      { position: '1', title: 'Voltage', duration: '5:30' },
      { position: '2', title: 'Drift', duration: '4:10' },
      { position: '3', title: 'Neon Pulse', duration: '6:02' },
    ],
  },
  {
    discogs_id: '3',
    album_name: 'Northern Woods',
    artist_name: 'Elias Thorne',
    cover_url: 'https://picsum.photos/seed/album3/400/400',
    year: '2022',
    genres: ['Classical'],
    tracklist: [],
  },
  {
    discogs_id: '4',
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
]

const MOCK_ADDED_IDS = new Set(['2'])

const SearchPage = () => {
  const [query, setQuery] = useState('')
  const [addedIds, setAddedIds] = useState<Set<string>>(MOCK_ADDED_IDS)

  const handleAdd = (id: string) => setAddedIds((prev) => new Set(prev).add(id))
  const handleRemove = (id: string) => {
    setAddedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-search">
      <Header />
      <main className="pt-14">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <SearchInput value={query} onChange={setQuery} />
        </div>

        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-medium text-search-secondary tracking-widest mb-4">RESULTS</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-8">
            {MOCK_RESULTS.map((result) => (
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
      </main>
    </div>
  )
}

export default SearchPage
