import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { type MenuMixedOptions, resolveMenu, resolveRoute } from '@/router/helper'
import type { RouteRecordRaw } from 'vue-router'
import { listCurrentRoleMenuTree } from '@/api/menu'
import type { MenuItem } from '@/types/modules/menu'
import type { MenuOption } from 'naive-ui'

export const useMenuStore = defineStore('menu', () => {
  const menuOptions = ref<MenuOption[]>([])

  const routeList = ref<RouteRecordRaw[]>([])

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
        showTab = true,
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
          showTab: showTab ?? true
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

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
}
