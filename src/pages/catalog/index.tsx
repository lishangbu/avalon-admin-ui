import { Navigate, useLocation } from 'react-router-dom'
import { useMenuStore } from '@/store/menu'
import { findFirstRoutePath } from '@/utils/menu'

export default function CatalogIndexPage() {
  const location = useLocation()
  const routes = useMenuStore((state) => state.routes)
  const currentRoute = routes.find((route) => route.path === location.pathname)
  const nextPath = currentRoute?.children
    ? findFirstRoutePath(currentRoute.children)
    : null

  return <Navigate to={nextPath ?? '/dashboard'} replace />
}
