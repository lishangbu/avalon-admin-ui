import { create } from 'zustand'
import { STORAGE_KEYS } from '@/config/app'
import type { AppRouteItem, MenuTreeNode } from '@/types/menu'
import { transformMenuTree } from '@/utils/menu'
import { readStorage, writeStorage } from '@/utils/storage'

interface MenuState {
  tree: MenuTreeNode[]
  routes: AppRouteItem[]
  loading: boolean
  setTree: (tree: MenuTreeNode[]) => AppRouteItem[]
  loadMenus: (force?: boolean) => Promise<AppRouteItem[]>
  reset: () => void
}

const cachedTree = readStorage<MenuTreeNode[]>(STORAGE_KEYS.menus, [])

export const useMenuStore = create<MenuState>((set, get) => ({
  tree: cachedTree,
  routes: transformMenuTree(cachedTree),
  loading: false,
  setTree(tree) {
    const routes = transformMenuTree(tree)
    writeStorage(STORAGE_KEYS.menus, tree)
    set({ tree, routes, loading: false })
    return routes
  },
  async loadMenus(force = false): Promise<AppRouteItem[]> {
    const cached = get().routes
    if (!force) {
      if (cached.length === 0 && get().tree.length > 0) {
        const routes = transformMenuTree(get().tree)
        set({ routes, loading: false })
        return routes
      }

      return cached
    }

    set({ loading: true })

    try {
      const { useAuthStore } = await import('@/store/auth')
      await useAuthStore.getState().bootstrap(true)
      return get().routes
    } finally {
      set({ loading: false })
    }
  },
  reset() {
    set({ tree: [], routes: [], loading: false })
  },
}))
