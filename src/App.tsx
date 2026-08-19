import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import queryClient from './lib/queryClient'
import router from './router'
import PlayerPlayabilityCheck from './components/PlayerPlayabilityCheck'

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PlayerPlayabilityCheck />
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
