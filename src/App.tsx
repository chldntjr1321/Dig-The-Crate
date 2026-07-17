import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import queryClient from './lib/queryClient'
import router from './router'
import { PlayerProvider } from './components/PlayerProvider'

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PlayerProvider>
        <RouterProvider router={router} />
      </PlayerProvider>
    </QueryClientProvider>
  )
}

export default App
