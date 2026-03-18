import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed, shallowRef } from 'vue'

import { listCurrentRoleMenuTree } from '@/api'
import { resolveMenu, resolveRoute } from '@/router/helper'

import { pinia } from '.'

import type { MenuMixedOptions } from '@/router/interface'

/**
 * 菜单相关的 Pinia Store
 *
 * 管理菜单选项和路由列表，支持从后端获取当前角色的菜单树，并转换为前端可用的菜单和路由结构。
 */
export const useMenuStore = defineStore('menu', () => {
  /**
   * 菜单选项，供 Naive UI 菜单组件使用
   */
  const menus = shallowRef<MenuMixedOptions[]>([])

  async function loadMenus() {
    if (menus.value.length > 0) {
      return menus.value
    }

    const res = await listCurrentRoleMenuTree()
    menus.value = res.data
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
    clearMenus
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
