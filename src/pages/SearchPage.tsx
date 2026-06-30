import { useState } from 'react'
import Header from '../components/Header'
import SearchInput from '../components/search/SearchInput'

const SearchPage = () => {
  const [query, setQuery] = useState('')

  return (
    <div className="min-h-screen bg-search">
      <Header />
      <main className="pt-14">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <SearchInput value={query} onChange={setQuery} />
        </div>
      </main>
    </div>
  )
}

export default SearchPage
