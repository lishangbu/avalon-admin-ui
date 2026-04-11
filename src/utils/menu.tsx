import {
  AppstoreOutlined,
  DatabaseOutlined,
  DashboardOutlined,
  KeyOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { ItemType } from 'antd/es/menu/interface'
import type { ReactNode } from 'react'
import type { AppRouteItem, MenuTreeNode } from '@/types/menu'

const iconMap: Record<string, ReactNode> = {
  dashboard: <DashboardOutlined />,
  system: <SettingOutlined />,
  user: <UserOutlined />,
  role: <SafetyCertificateOutlined />,
  permission: <KeyOutlined />,
  menu: <AppstoreOutlined />,
  oauth: <KeyOutlined />,
  dataset: <DatabaseOutlined />,
  tools: <ToolOutlined />,
  password: <LockOutlined />,
}

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, '')
}

function joinRoutePath(parentPath: string, routePath?: string | null) {
  if (!routePath) {
    return parentPath || '/'
  }

  if (routePath.startsWith('/')) {
    return routePath
  }

  const normalizedParentPath = trimSlashes(parentPath)
  const normalizedRoutePath = trimSlashes(routePath)

  if (!normalizedParentPath) {
    return `/${normalizedRoutePath}`
  }

  return `/${normalizedParentPath}/${normalizedRoutePath}`
}

export function resolveIcon(name?: string | null) {
  if (!name) {
    return undefined
  }

  if (iconMap[name]) {
    return iconMap[name]
  }

  const normalized = name.toLowerCase()

  if (normalized.includes('dashboard')) {
    return <DashboardOutlined />
  }
  if (normalized.includes('system') || normalized.includes('setting')) {
    return <SettingOutlined />
  }
  if (normalized.includes('user')) {
    return <UserOutlined />
  }
  if (normalized.includes('role') || normalized.includes('safety')) {
    return <SafetyCertificateOutlined />
  }
  if (normalized.includes('permission') || normalized.includes('key')) {
    return <KeyOutlined />
  }
  if (
    normalized.includes('menu') ||
    normalized.includes('function') ||
    normalized.includes('appstore')
  ) {
    return <AppstoreOutlined />
  }
  if (normalized.includes('dataset') || normalized.includes('database')) {
    return <DatabaseOutlined />
  }
  if (normalized.includes('tool') || normalized.includes('wrench')) {
    return <ToolOutlined />
  }
  if (normalized.includes('password') || normalized.includes('lock')) {
    return <LockOutlined />
  }
  if (normalized.includes('oauth')) {
    return <KeyOutlined />
  }

  return <AppstoreOutlined />
}

export function transformMenuTree(
  tree: MenuTreeNode[],
  parentPath = '',
): AppRouteItem[] {
  return tree
    .filter((item) => item.disabled !== true && item.type !== 'button')
    .map((item) => {
      const path = joinRoutePath(parentPath, item.path)
      const key = item.key || item.name || path
      const children = Array.isArray(item.children)
        ? transformMenuTree(item.children, path)
        : undefined

      return {
        key,
        path,
        name: item.name || key,
        component: item.component || undefined,
        redirect: item.redirect || undefined,
        disabled: Boolean(item.disabled),
        children: children?.length ? children : undefined,
        meta: {
          title: item.title || item.name || key,
          icon: item.icon || undefined,
          pinned: Boolean(item.pinned),
          showTab: item.showTab !== false,
          enableMultiTab: item.enableMultiTab !== false,
          type: item.type || 'menu',
          hidden: Boolean(item.hidden),
          hideChildrenInMenu: Boolean(item.hideChildrenInMenu),
          flatMenu: Boolean(item.flatMenu),
          activeMenu: item.activeMenu ?? null,
          external: Boolean(item.external),
          target: item.target ?? null,
        },
      }
    })
}

export function buildMenuItems(routes: AppRouteItem[]): ItemType[] {
  return routes
    .filter((route) => route.meta.hidden !== true)
    .map((route) => ({
      key: route.path,
      icon: resolveIcon(route.meta.icon),
      label: route.meta.title,
      children:
        route.meta.hideChildrenInMenu === true || !route.children
          ? undefined
          : buildMenuItems(route.children),
    }))
}

export function flattenRoutes(routes: AppRouteItem[]): AppRouteItem[] {
  return routes.flatMap((route) => [
    route,
    ...(route.children ? flattenRoutes(route.children) : []),
  ])
}

export function findFirstRoutePath(routes: AppRouteItem[]): string | null {
  for (const route of routes) {
    if (
      route.component &&
      route.meta.type !== 'button' &&
      route.meta.hidden !== true
    ) {
      return route.path
    }

    if (route.children?.length) {
      const childPath = findFirstRoutePath(route.children)
      if (childPath) {
        return childPath
      }
    }
  }

  return null
}

export function findMatchedRoute(
  routes: AppRouteItem[],
  pathname: string,
): AppRouteItem | undefined {
  const flatRoutes = flattenRoutes(routes)
  return flatRoutes.find((route) => route.path === pathname)
}
