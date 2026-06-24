import { createBrowserRouter } from 'react-router'
import MainPage from './pages/MainPage'
import AuthPage from './pages/AuthPage'
import SearchPage from './pages/SearchPage'
import ProtectedRoute from './components/ProtectedRoute'

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/', element: <MainPage /> },
      { path: '/search', element: <SearchPage /> },
    ],
  },
  { path: '/login', element: <AuthPage page="login" /> },
  { path: '/signup', element: <AuthPage page="signup" /> },
])

export default router
