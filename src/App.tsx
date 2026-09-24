import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import queryClient from './lib/queryClient'
import router from './router'
import PlayerPlayabilityCheck from './components/PlayerPlayabilityCheck'

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PlayerPlayabilityCheck />
      <RouterProvider router={router} />
      <Analytics />
      <SpeedInsights />
    </QueryClientProvider>
  )
}

export default App
