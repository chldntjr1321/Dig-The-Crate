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

const MainPage = () => {
  const { user } = useAuth()
  const nickname = user?.user_metadata?.nickname ?? ''
  const [sortBy, setSortBy] = useState<SortOption>('recently_added')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const { collections, isLoading } = useCollections(sortBy)
  const showSkeleton = useDelayedLoading(isLoading)

  return (
    <div className="bg-page relative flex flex-col h-screen">
      <Header />

      <main className="flex-1 overflow-y-auto [scrollbar-gutter:stable] relative">
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
          <div className="h-full pt-8 pb-12 px-4 md:px-16 max-w-[1440px] mx-auto w-full">
            <div
              className="bg-wall rounded-xl p-8 min-h-full"
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
