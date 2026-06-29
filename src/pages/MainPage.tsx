import { useState } from 'react'
import Header from '../components/Header'
import AlbumCard from '../components/collection/AlbumCard'
import EmptyCollection from '../components/collection/EmptyCollection'
import DeleteConfirmModal from '../components/collection/DeleteConfirmModal'
import CollectionHeader from '../components/collection/CollectionHeader'
import { type SortOption } from '../utils/sortOptions'
import type { Collection } from '../types'

const MOCK_COLLECTIONS: Collection[] = [
  {
    id: '1',
    user_id: 'mock',
    discogs_id: '368562',
    album_name: 'Kind of Blue',
    artist_name: 'Miles Davis',
    cover_url: 'https://picsum.photos/seed/album1/400/400',
    year: '1959',
    added_at: '2024-01-04T00:00:00Z',
  },
  {
    id: '2',
    user_id: 'mock',
    discogs_id: '10362',
    album_name: 'The Dark Side of the Moon',
    artist_name: 'Pink Floyd',
    cover_url: 'https://picsum.photos/seed/album2/400/400',
    year: '1973',
    added_at: '2024-01-03T00:00:00Z',
  },
  {
    id: '3',
    user_id: 'mock',
    discogs_id: '2748800',
    album_name: 'Thriller',
    artist_name: 'Michael Jackson',
    cover_url: 'https://picsum.photos/seed/album3/400/400',
    year: '1982',
    added_at: '2024-01-02T00:00:00Z',
  },
  {
    id: '4',
    user_id: 'mock',
    discogs_id: '24047',
    album_name: 'Abbey Road',
    artist_name: 'The Beatles',
    cover_url: 'https://picsum.photos/seed/album4/400/400',
    year: '1969',
    added_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    user_id: 'mock',
    discogs_id: '249504',
    album_name: 'Innervisions',
    artist_name: 'Stevie Wonder',
    cover_url: 'https://picsum.photos/seed/album5/400/400',
    year: '1973',
    added_at: '2023-12-31T00:00:00Z',
  },
  {
    id: '6',
    user_id: 'mock',
    discogs_id: '1505817',
    album_name: 'Blue',
    artist_name: 'Joni Mitchell',
    cover_url: 'https://picsum.photos/seed/album6/400/400',
    year: '1971',
    added_at: '2023-12-30T00:00:00Z',
  },
  {
    id: '7',
    user_id: 'mock',
    discogs_id: '3575028',
    album_name: 'Rumours',
    artist_name: 'Fleetwood Mac',
    cover_url: 'https://picsum.photos/seed/album7/400/400',
    year: '1977',
    added_at: '2023-12-29T00:00:00Z',
  },
  {
    id: '8',
    user_id: 'mock',
    discogs_id: '370637',
    album_name: 'In the Wee Small Hours',
    artist_name: 'Frank Sinatra',
    cover_url: 'https://picsum.photos/seed/album8/400/400',
    year: '1955',
    added_at: '2023-12-28T00:00:00Z',
  },
  {
    id: '9',
    user_id: 'mock',
    discogs_id: '534685',
    album_name: 'Nevermind',
    artist_name: 'Nirvana',
    cover_url: 'https://picsum.photos/seed/album9/400/400',
    year: '1991',
    added_at: '2023-12-27T00:00:00Z',
  },
]

const sortCollections = (
  collections: Collection[],
  sortBy: SortOption,
): Collection[] => {
  return [...collections].sort((a, b) => {
    switch (sortBy) {
      case 'recently_added':
        return new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
      case 'artist_name':
        return a.artist_name.localeCompare(b.artist_name)
      case 'album_name':
        return a.album_name.localeCompare(b.album_name)
      case 'release_year':
        return (a.year ?? '').localeCompare(b.year ?? '')
    }
  })
}

const MainPage = () => {
  const nickname = '우석' // TODO: useAuth에서 실제 유저 닉네임으로 교체
  const [sortBy, setSortBy] = useState<SortOption>('recently_added')
  const [albumToDelete, setAlbumToDelete] = useState<string | null>(null)

  const collections = sortCollections(MOCK_COLLECTIONS, sortBy)

  return (
    <div className="min-h-screen bg-page relative">
      <Header />

      {collections.length === 0 ? (
        <>
          <div
            className="absolute inset-0 bg-wall opacity-20 pointer-events-none mix-blend-overlay"
            style={{ boxShadow: 'inset 0 0 100px rgba(196, 133, 74, 0.05)' }}
          />
          <main className="flex items-center justify-center min-h-screen px-4">
            <EmptyCollection />
          </main>
        </>
      ) : (
        <main className="pt-24 pb-12 px-4 md:px-16 max-w-[1440px] mx-auto w-full">
          <div
            className="bg-wall rounded-xl p-8 min-h-[calc(100vh-160px)]"
            style={{ boxShadow: 'inset 0 0 40px rgba(196, 133, 74, 0.02)' }}
          >
            <CollectionHeader
              nickname={nickname}
              count={collections.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {collections.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onDeleteClick={() => setAlbumToDelete(album.id)}
                />
              ))}
            </div>
          </div>
        </main>
      )}

      {albumToDelete !== null && (
        <DeleteConfirmModal
          onConfirm={() => setAlbumToDelete(null)}
          onCancel={() => setAlbumToDelete(null)}
        />
      )}
    </div>
  )
}

export default MainPage
