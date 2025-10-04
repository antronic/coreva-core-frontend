import { Navigate, Outlet, useLocation } from 'react-router'
import { useAppSelector } from '@/app/hooks'

export default function RequireAuth() {
  const isAuthed = useAppSelector(s => !!s.auth.session?.token)
  const loc = useLocation()
  return isAuthed ? <Outlet/> : <Navigate to="/login" replace state={{ from: loc }} />
}