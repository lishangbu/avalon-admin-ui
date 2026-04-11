import { create } from 'zustand'
import { STORAGE_KEYS } from '@/config/app'
import { listCurrentRoleMenuTree } from '@/pages/system/menu/service'
import type { AppRouteItem, MenuTreeNode } from '@/types/menu'
import { transformMenuTree } from '@/utils/menu'
import { readStorage, writeStorage } from '@/utils/storage'

interface MenuState {
  tree: MenuTreeNode[]
  routes: AppRouteItem[]
  loading: boolean
  loadMenus: (force?: boolean) => Promise<AppRouteItem[]>
  reset: () => void
}

const cachedTree = readStorage<MenuTreeNode[]>(STORAGE_KEYS.menus, [])
let loadMenusPromise: Promise<AppRouteItem[]> | null = null
let menuStoreVersion = 0

export const useMenuStore = create<MenuState>((set, get) => ({
  tree: cachedTree,
  routes: transformMenuTree(cachedTree),
  loading: false,
  async loadMenus(force = false) {
    const cached = get().routes
    if (!force && cached.length > 0) {
      return cached
    }

    if (loadMenusPromise) {
      return loadMenusPromise
    }

    const currentVersion = menuStoreVersion
    set({ loading: true })
    loadMenusPromise = listCurrentRoleMenuTree()
      .then((result) => {
        const tree = result.data ?? []
        const routes = transformMenuTree(tree)

        if (menuStoreVersion !== currentVersion) {
          return get().routes
        }

        writeStorage(STORAGE_KEYS.menus, tree)
        set({ tree, routes })
        return routes
      })
      .finally(() => {
        loadMenusPromise = null

        if (menuStoreVersion === currentVersion) {
          set({ loading: false })
        }
      })

    return loadMenusPromise
  },
  reset() {
    menuStoreVersion += 1
    loadMenusPromise = null
    set({ tree: [], routes: [], loading: false })
  },
}))
