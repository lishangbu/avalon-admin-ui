import { useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed } from 'vue'

import { listCurrentRoleMenuTree } from '@/api'
import { resolveMenu, resolveRoute } from '@/router/helper'
import { resolveDynamicIconName } from '@/utils/icon'

import { pinia } from '.'

import type { MenuMixedOptions } from '@/router/interface'

function hasLegacyMenuIcon(options: MenuMixedOptions[]): boolean {
  return options.some((item) => {
    if (item.type === 'divider') {
      return false
    }

    if (
      'icon' in item &&
      typeof item.icon === 'string' &&
      item.icon.trim() &&
      !resolveDynamicIconName(item.icon)
    ) {
      return true
    }

    return Array.isArray(item.children) && hasLegacyMenuIcon(item.children)
  })
}

function sanitizeMenuIcons(options: MenuMixedOptions[]): MenuMixedOptions[] {
  return options.map((item): MenuMixedOptions => {
    if (item.type === 'divider') {
      return item
    }

    if (item.type === 'group') {
      const children = Array.isArray(item.children)
        ? (sanitizeMenuIcons(item.children as MenuMixedOptions[]) as typeof item.children)
        : item.children

      return {
        ...item,
        children,
      } as MenuMixedOptions
    }

    const children = Array.isArray(item.children) ? sanitizeMenuIcons(item.children) : item.children

    return {
      ...item,
      children,
      icon: resolveDynamicIconName(item.icon),
    } as MenuMixedOptions
  })
}

/**
 * 菜单相关的 Pinia Store
 *
 * 管理菜单选项和路由列表，支持从后端获取当前角色的菜单树，并转换为前端可用的菜单和路由结构。
 */
export const useMenuStore = defineStore('menu', () => {
  /**
   * 菜单选项，供 Naive UI 菜单组件使用
   */
  const menus = useStorage<MenuMixedOptions[]>('menus', [], localStorage, {
    serializer: {
      read: (v) => (v ? JSON.parse(v) : []),
      write: (v) => JSON.stringify(v),
    },
  })

  async function loadMenus() {
    if (menus.value.length > 0 && !hasLegacyMenuIcon(menus.value)) {
      menus.value = sanitizeMenuIcons(menus.value)
      return menus.value
    }

    const res = await listCurrentRoleMenuTree()
    menus.value = sanitizeMenuIcons(res.data)
    return menus.value
  }

  const clearMenus = function () {
    menus.value = []
  }

  const userMenu = computed(() => {
    return resolveMenu(menus.value)
  })
  const userRoute = computed(() => {
    return resolveRoute(menus.value)
  })

  return {
    menus,
    loadMenus,
    userMenu,
    userRoute,
    clearMenus,
  }
})

export function toRefsMenuStore() {
  return {
    ...storeToRefs(useMenuStore(pinia)),
  }
}

// HMR 支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
}
