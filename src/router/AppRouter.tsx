import { Spin } from 'antd'
import { useEffect, useMemo } from 'react'
import { Navigate, useLocation, useRoutes } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { STORAGE_KEYS, WHITE_LIST } from '@/config/app'
import { AppLayout } from '@/layouts/AppLayout'
import { resolvePageComponent } from '@/router/page-loader'
import { useAuthStore } from '@/store/auth'
import { useMenuStore } from '@/store/menu'
import { findFirstRoutePath, flattenRoutes } from '@/utils/menu'

const LoginPage = resolvePageComponent('auth/login/index')
const DashboardHomePage = resolvePageComponent('dashboard/home/index')
const ProfilePage = resolvePageComponent('account/profile/index')
const PasswordPage = resolvePageComponent('account/password/index')
const ToolPage = resolvePageComponent('tools/stat-calculator/index')
const Error403Page = resolvePageComponent('error/403/index')
const Error404Page = resolvePageComponent('error/404/index')
const Error500Page = resolvePageComponent('error/500/index')

function RouteBootstrap() {
  const {
    token,
    user,
    initialized,
    loading: authLoading,
    bootstrap,
  } = useAuthStore(
    useShallow((state) => ({
      token: state.token,
      user: state.user,
      initialized: state.initialized,
      loading: state.loading,
      bootstrap: state.bootstrap,
    })),
  )
  const {
    routes: menuRoutes,
    loading: menuLoading,
    loadMenus,
  } = useMenuStore(
    useShallow((state) => ({
      routes: state.routes,
      loading: state.loading,
      loadMenus: state.loadMenus,
    })),
  )
  const location = useLocation()

  useEffect(() => {
    if (token && !user && !initialized) {
      void bootstrap()
    }
  }, [bootstrap, initialized, token, user])

  useEffect(() => {
    if (token && initialized) {
      void loadMenus()
    }
  }, [initialized, loadMenus, token])

  const dynamicRoutes = useMemo<RouteObject[]>(() => {
    return flattenRoutes(menuRoutes).flatMap((item) => {
      if (item.meta.external) {
        return []
      }

      if (item.redirect) {
        return [
          {
            path: item.path,
            element: <Navigate to={item.redirect} replace />,
          },
        ]
      }

      if (!item.component) {
        return []
      }

      const Component = resolvePageComponent(item.component)

      return [
        {
          path: item.path,
          element: <Component />,
        },
      ]
    })
  }, [menuRoutes])

  const firstPath = findFirstRoutePath(menuRoutes) ?? '/dashboard'

  const routes = useMemo<RouteObject[]>(
    () => [
      {
        path: '/login',
        element: token ? <Navigate to="/" replace /> : <LoginPage />,
      },
      {
        path: '/',
        element: token ? <AppLayout /> : <NavigateToLogin />,
        children: [
          { index: true, element: <Navigate to={firstPath} replace /> },
          { path: '/dashboard', element: <DashboardHomePage /> },
          { path: '/account/profile', element: <ProfilePage /> },
          { path: '/account/password', element: <PasswordPage /> },
          { path: '/tools/stat-calculator', element: <ToolPage /> },
          ...dynamicRoutes,
        ],
      },
      { path: '/403', element: <Error403Page /> },
      { path: '/404', element: <Error404Page /> },
      { path: '/500', element: <Error500Page /> },
      {
        path: '*',
        element: <Navigate to={token ? '/404' : '/login'} replace />,
      },
    ],
    [dynamicRoutes, firstPath, token],
  )

  const routeElement = useRoutes(routes)
  const shouldShowLoading =
    token &&
    (authLoading || menuLoading) &&
    !WHITE_LIST.includes(location.pathname)

  if (shouldShowLoading) {
    return (
      <div className="page-loading">
        <Spin size="large" />
      </div>
    )
  }

  return routeElement
}

export function AppRouter() {
  return <RouteBootstrap />
}

function NavigateToLogin() {
  const location = useLocation()
  const redirect = `${location.pathname}${location.search}${location.hash}`

  if (!WHITE_LIST.includes(location.pathname)) {
    localStorage.setItem(STORAGE_KEYS.redirect, JSON.stringify(redirect))
  }

  return <Navigate to="/login" replace />
}
