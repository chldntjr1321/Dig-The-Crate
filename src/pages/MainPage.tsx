import { useState } from 'react'
import Header from '../components/Header'
import AlbumCard from '../components/collection/AlbumCard'
import CollectionSkeleton from '../components/collection/CollectionSkeleton'
import EmptyCollection from '../components/collection/EmptyCollection'
import CollectionHeader from '../components/collection/CollectionHeader'
import Toast from '../components/ui/Toast'
import { type SortOption } from '../types'
import useCollections from '../hooks/useCollections'
import useAuth from '../hooks/useAuth'
import useDelayedLoading from '../hooks/useDelayedLoading'
import type { Collection } from '../types'

const MOCK_COLLECTIONS: Collection[] = [
  { id: 'm1', user_id: 'u1', discogs_id: 'd1', album_name: 'Midnight Sessions', artist_name: 'The Quintet', cover_url: 'https://picsum.photos/seed/album1/400/400', year: '2021', genres: ['Jazz'], added_at: '2024-01-01' },
  { id: 'm2', user_id: 'u1', discogs_id: 'd2', album_name: 'Analog Dreams', artist_name: 'Synthetica', cover_url: 'https://picsum.photos/seed/album2/400/400', year: '2019', genres: ['Electronic'], added_at: '2024-01-02' },
  { id: 'm3', user_id: 'u1', discogs_id: 'd3', album_name: 'Northern Woods', artist_name: 'Elias Thorne', cover_url: 'https://picsum.photos/seed/album3/400/400', year: '2022', genres: ['Classical'], added_at: '2024-01-03' },
  { id: 'm4', user_id: 'u1', discogs_id: 'd4', album_name: 'Heavy Groove', artist_name: 'The Motor City Band', cover_url: 'https://picsum.photos/seed/album4/400/400', year: '2018', genres: ['R&B'], added_at: '2024-01-04' },
  { id: 'm5', user_id: 'u1', discogs_id: 'd5', album_name: 'Blue Hour', artist_name: 'Miles & Co.', cover_url: 'https://picsum.photos/seed/album5/400/400', year: '2020', genres: ['Jazz'], added_at: '2024-01-05' },
  { id: 'm6', user_id: 'u1', discogs_id: 'd6', album_name: 'Stone Cold', artist_name: 'The Ridge', cover_url: 'https://picsum.photos/seed/album6/400/400', year: '2017', genres: ['Rock'], added_at: '2024-01-06' },
  { id: 'm7', user_id: 'u1', discogs_id: 'd7', album_name: 'Deep Current', artist_name: 'Wavform', cover_url: 'https://picsum.photos/seed/album7/400/400', year: '2023', genres: ['Electronic'], added_at: '2024-01-07' },
  { id: 'm8', user_id: 'u1', discogs_id: 'd8', album_name: 'Street Lexicon', artist_name: 'Prose & Cons', cover_url: 'https://picsum.photos/seed/album8/400/400', year: '2021', genres: ['Hip Hop'], added_at: '2024-01-08' },
]

const MainPage = () => {
  const { user } = useAuth()
  const nickname = user?.user_metadata?.nickname ?? ''
  const [sortBy, setSortBy] = useState<SortOption>('recently_added')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const { collections: realCollections, isLoading } = useCollections(sortBy)
  const collections = realCollections.length > 0 ? realCollections : MOCK_COLLECTIONS
  const showSkeleton = useDelayedLoading(isLoading)

  return (
    <div className="bg-page relative">
      <Header />

      <main className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto [scrollbar-gutter:stable] relative">
        {isLoading && !showSkeleton ? null : collections.length === 0 && !isLoading ? (
          <>
            <div
              className="absolute inset-0 bg-wall opacity-20 pointer-events-none mix-blend-overlay"
              style={{ boxShadow: 'inset 0 0 100px rgba(196, 133, 74, 0.05)' }}
            />
            <div className="flex items-center justify-center h-full px-4">
              <EmptyCollection />
            </div>
          </>
        ) : (
          <div className="pt-8 pb-12 px-4 md:px-16 max-w-[1440px] mx-auto w-full">
            <div
              className="bg-wall rounded-xl p-8 min-h-[calc(100vh-8rem)]"
              style={{ boxShadow: 'inset 0 0 40px rgba(196, 133, 74, 0.02)' }}
            >
              {showSkeleton ? (
                <CollectionSkeleton />
              ) : (
                <>
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
                        onError={setToastMessage}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  )
}

export default MainPage
