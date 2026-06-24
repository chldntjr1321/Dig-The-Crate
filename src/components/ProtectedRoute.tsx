import { Navigate, Outlet } from 'react-router'
import useAuth from '@/hooks/useAuth'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner />
  if (!user) return <Navigate to="/login" />
  return <Outlet />
}

export default ProtectedRoute
