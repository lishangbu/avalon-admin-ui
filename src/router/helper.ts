import { Icon } from '@iconify/vue'
import { isFunction, omit, isString, pickBy } from 'es-toolkit'
import { isEmpty } from 'es-toolkit/compat'
import { h } from 'vue'
import { RouterLink } from 'vue-router'

import { resolveDynamicIconName } from '@/utils/icon'

import type { MenuMixedOptions, MenuOption } from './interface'
import type { MenuProps } from 'naive-ui'
import type { RouteRecordRaw } from 'vue-router'

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, '')
}

function joinRoutePath(parentPath: string, routePath: string) {
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

  if (!normalizedRoutePath) {
    return `/${normalizedParentPath}`
  }

  return `/${normalizedParentPath}/${normalizedRoutePath}`
}

export function findFirstAccessibleRoutePath(
  routes: RouteRecordRaw[],
  parentPath = '',
): string | null {
  for (const route of routes) {
    const currentPath = joinRoutePath(parentPath, route.path)

    if (route.component || route.components) {
      return currentPath
    }

    if (Array.isArray(route.children) && !isEmpty(route.children)) {
      const childPath = findFirstAccessibleRoutePath(route.children, currentPath)

      if (childPath) {
        return childPath
      }
    }
  }

  return null
}

export function resolveMenu(
  options: MenuMixedOptions[],
  parentDisabled = false,
): NonNullable<MenuProps['options']> {
  const menuOptions: NonNullable<MenuProps['options']> = []

  options.forEach((item) => {
    if (!item.type || item.type === 'group') {
      const { children, name, path, label, icon, key, disabled, extra, props, show, type } =
        item as MenuOption

      const mergedDisabled = parentDisabled || disabled
      const iconName = resolveDynamicIconName(icon)

      const renderIcon = iconName ? () => h(Icon, { icon: iconName }) : null

      const menu = pickBy(
        {
          key: key || name || path,
          icon: renderIcon,
          label,
          disabled: mergedDisabled,
          extra,
          props,
          show,
          type,
          name,
        },
        (v) => v !== undefined,
      ) as NonNullable<MenuProps['options']>[number]

      if (Array.isArray(children) && !isEmpty(children)) {
        menu.children = resolveMenu(children, mergedDisabled)
      } else {
        menu.label =
          mergedDisabled || isFunction(label)
            ? label
            : () => h(RouterLink, { to: { name } }, { default: () => label })
      }

      menuOptions.push(menu)
    } else {
      menuOptions.push(item)
    }
  })

  return menuOptions
}

export function resolveRoute(options: MenuMixedOptions[]) {
  const modules = import.meta.glob('@/views/**/*.vue')

  function buildRoutes(items: MenuMixedOptions[], parentPath = ''): RouteRecordRaw[] {
    return items.flatMap((item) => {
      if (item.type === 'divider') {
        return []
      }

      if (item.type === 'group') {
        return Array.isArray(item.children) && !isEmpty(item.children)
          ? buildRoutes(item.children)
          : []
      }

      const {
        label,
        icon,
        meta,
        component,
        redirect,
        children,
        disabled,
        pinned,
        showTab,
        enableMultiTab,
        ...rest
      } = item as MenuOption

      if (disabled) {
        return []
      }

      const iconName = resolveDynamicIconName(icon)

      let componentModule: RouteRecordRaw['component'] | null = null

      if (!isEmpty(component) && isString(component)) {
        const extractName = component.replace(/^\/|\.vue$/g, '')
        const modulePath = `/src/views/${extractName}.vue`
        if (modules[modulePath]) {
          componentModule = modules[modulePath]
        }
      }

      const currentPath = joinRoutePath(parentPath, rest.path)
      const childRoutes =
        Array.isArray(children) && !isEmpty(children)
          ? buildRoutes(children, currentPath)
          : undefined

      const routeSource = {
        ...rest,
        label,
        icon,
        disabled,
        ...(componentModule ? { component: componentModule } : {}),
        ...(isString(redirect) && redirect.trim() ? { redirect } : {}),
        meta: {
          ...meta,
          title: meta?.title || label,
          icon: iconName,
          pinned: pinned ?? meta?.pinned,
          showTab: showTab ?? meta?.showTab,
          enableMultiTab: enableMultiTab ?? meta?.enableMultiTab,
        },
      }

      const route = omit(routeSource, [
        'type',
        'label',
        'icon',
        'disabled',
        'extra',
        'props',
        'show',
        'key',
      ]) as RouteRecordRaw

      if (childRoutes?.length) {
        route.children = childRoutes

        if (!route.component && !route.components && !route.redirect) {
          const fallbackChildPath = findFirstAccessibleRoutePath(childRoutes, currentPath)

          if (fallbackChildPath) {
            route.redirect = fallbackChildPath
          }
        }
      }

      return [route]
    })
  }

  return buildRoutes(options)
}
