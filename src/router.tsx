import { createBrowserRouter } from 'react-router'
import MainPage from './pages/MainPage'
import AuthPage from './pages/AuthPage'
import SearchPage from './pages/SearchPage'

const router = createBrowserRouter([
  { path: '/', element: <MainPage /> },
  { path: '/login', element: <AuthPage page="login" /> },
  { path: '/signup', element: <AuthPage page="signup" /> },
  { path: '/search', element: <SearchPage /> },
])

export default router
