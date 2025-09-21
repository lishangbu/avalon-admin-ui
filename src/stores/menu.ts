import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

import { listCurrentRoleMenuTree } from '@/api/menu'
import { type MenuMixedOptions, resolveMenu, resolveRoute } from '@/router/helper'

import type { MenuOption } from 'naive-ui'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 菜单相关的 Pinia Store
 *
 * 管理菜单选项和路由列表，支持从后端获取当前角色的菜单树，并转换为前端可用的菜单和路由结构。
 */
export const useMenuStore = defineStore('menu', () => {
  /**
   * 菜单选项，供 Naive UI 菜单组件使用
   */
  const menuOptions = ref<MenuOption[]>([])

  /**
   * 路由列表，供 vue-router 动态路由使用
   */
  const routeList = ref<RouteRecordRaw[]>([])

  /**
   * 获取并解析当前角色的菜单树，自动填充菜单和路由列表
   *
   * @returns {Promise<void>} 无返回值，自动更新 menuOptions 和 routeList
   */
  async function resolveMenuOptions() {
    try {
      const res = await listCurrentRoleMenuTree()
      // MenuItem[] 转换为 MenuMixedOptions
      const menuMixedOptions = resolveMenuMixedOptions(res?.data ?? [])
      console.log(menuMixedOptions)
      menuOptions.value = resolveMenu(menuMixedOptions) || []
      routeList.value = resolveRoute(menuMixedOptions) || []
    } catch (error) {
      menuOptions.value = []
      routeList.value = []
    }
  }

  /**
   * 将后端菜单项数组递归转换为 MenuMixedOptions 结构
   *
   * @param items 后端菜单项数组
   * @param parentId 父级菜单 id，根节点为 null
   * @returns MenuMixedOptions[]
   */
  function resolveMenuMixedOptions(
    items: MenuItem[],
    parentId: string | null = null
  ): MenuMixedOptions[] {
    return items.map(item => {
      const {
        id = null,
        disabled = false,
        show = true,
        key,
        label = '',
        icon = '',
        path = '',
        name = '',
        redirect = '',
        component = '',
        sortOrder = 0,
        extra,
        showTab,
        enableMultiTab,
        pinned,
        children = []
      } = item || {}
      const menu: MenuMixedOptions = {
        id,
        parentId,
        disabled,
        show,
        key: key || name,
        label,
        icon,
        path: path ? (path.startsWith('/') ? path : '/' + path) : '',
        name,
        redirect: redirect || '',
        component,
        sortOrder,
        meta:{
          showTab,
          enableMultiTab,
          pinned
        },
        extra: extra ? JSON.stringify(extra) : undefined,
        children: children ?? [].length > 0 ? resolveMenuMixedOptions(children ?? [], id) : undefined
      }
      return menu
    })
  }


  return {
    menuOptions,
    routeList,
    resolveMenuOptions
  }
})

// HMR 支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
}
