import { create } from 'zustand'
import { STORAGE_KEYS } from '@/config/app'
import type { AppRouteMeta } from '@/types/menu'
import { readStorage, writeStorage } from '@/utils/storage'

export interface TabItem {
  key: string
  path: string
  title: string
  closable: boolean
}

interface TabsState {
  tabs: TabItem[]
  activeKey: string
  sync: (path: string, meta?: AppRouteMeta) => void
  setActive: (key: string) => void
  remove: (key: string) => string | null
  reset: () => void
}

const initialTabs = readStorage<TabItem[]>(STORAGE_KEYS.tabs, [])

export const useTabsStore = create<TabsState>((set, get) => ({
  tabs: initialTabs,
  activeKey: initialTabs[0]?.key ?? '',
  sync(path, meta) {
    if (!meta || meta.showTab === false) {
      set({ activeKey: path })
      return
    }

    const nextTabs = [...get().tabs]
    const existing = nextTabs.find((item) => item.key === path)

    if (!existing) {
      nextTabs.push({
        key: path,
        path,
        title: meta.title,
        closable: !meta.pinned,
      })
    }

    writeStorage(STORAGE_KEYS.tabs, nextTabs)
    set({ tabs: nextTabs, activeKey: path })
  },
  setActive(key) {
    set({ activeKey: key })
  },
  remove(key) {
    const nextTabs = get().tabs.filter((item) => item.key !== key)
    writeStorage(STORAGE_KEYS.tabs, nextTabs)
    const fallback = nextTabs.at(-1)?.path ?? null
    set({ tabs: nextTabs, activeKey: fallback ?? '' })
    return fallback
  },
  reset() {
    writeStorage(STORAGE_KEYS.tabs, [])
    set({ tabs: [], activeKey: '' })
  },
}))
