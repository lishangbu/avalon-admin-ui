import { useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'

import { pinia } from '.'

import type { RouteRecordNameGeneric } from 'vue-router'

export type Key = string | number | undefined

export interface Tab {
  id?: Key
  path: string
  icon?: string
  title?: string
  name?: RouteRecordNameGeneric
  componentName?: string
  locked?: boolean
  pinned?: boolean
  keepAlive?: boolean
}

export const useTabsStore = defineStore('tabsStore', () => {
  const tabs = useStorage<Tab[]>('tabs', [])

  const tabActivePath = useStorage<string>('tabActivePath', '')

  function findTabIndex(id: Key) {
    return tabs.value.findIndex((tab) => tab.id === id)
  }

  function sortTabs() {
    tabs.value.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return 0
    })
  }

  function createTab(tab: Tab) {
    if (!tabs.value.some(({ path }) => path === tab.path)) {
      const id = Date.now()
      tabs.value.push({ ...tab, id })

      if (tab.pinned) {
        sortTabs()
      }
    }

    setTabActivePath(tab.path)
  }

  function getTab(tabId: Key) {
    return tabs.value.find(({ id }) => id === tabId)
  }

  function updateTab(id: Key, updateProperties: Partial<Tab>) {
    const index = findTabIndex(id)

    if (index !== -1) {
      const targetTab = tabs.value[index]
      tabs.value[index] = { ...targetTab, ...updateProperties }

      if ('pinned' in updateProperties && updateProperties.pinned !== targetTab.pinned) {
        sortTabs()
      }
    }
  }

  function setTabs(value: Tab[]) {
    tabs.value = value
  }

  function removeTab(tabIds: Key | Key[]) {
    const removeIdsSet = new Set(Array.isArray(tabIds) ? tabIds : [tabIds])
    const nextTabs: Tab[] = []
    let activeIndex = -1

    for (let i = 0; i < tabs.value.length; i++) {
      const tab = tabs.value[i]
      if (tab.path === tabActivePath.value) activeIndex = i
      if (!removeIdsSet.has(tab.id)) nextTabs.push(tab)
    }

    if (activeIndex !== -1 && removeIdsSet.has(tabs.value[activeIndex].id)) {
      let nextActivePath = ''

      for (let i = activeIndex + 1; i < tabs.value.length; i++) {
        if (!removeIdsSet.has(tabs.value[i].id)) {
          nextActivePath = tabs.value[i].path
          break
        }
      }

      if (!nextActivePath) {
        for (let i = activeIndex - 1; i >= 0; i--) {
          if (!removeIdsSet.has(tabs.value[i].id)) {
            nextActivePath = tabs.value[i].path
            break
          }
        }
      }

      if (nextActivePath) {
        setTabActivePath(nextActivePath)
      } else {
        setTabActivePath('/')
      }
    }

    tabs.value = nextTabs
  }

  function clearTabs() {
    tabs.value = []
  }

  function getRemovableIdsBefore(id: Key) {
    const removableIds: Key[] = []

    for (const tab of tabs.value) {
      if (tab.id === id) break

      if (!tab.locked && !tab.pinned) {
        removableIds.push(tab.id)
      }
    }
    return removableIds
  }

  function getRemovableIdsAfter(id: Key) {
    const removableIds: Key[] = []

    for (let i = tabs.value.length - 1; i >= 0; i--) {
      if (tabs.value[i].id === id) break

      if (!tabs.value[i].locked && !tabs.value[i].pinned) {
        removableIds.push(tabs.value[i].id)
      }
    }

    return removableIds
  }

  function getRemovableIdsOther(id: Key) {
    const removableIds: Key[] = []

    for (const tab of tabs.value) {
      if (tab.id !== id && !tab.locked && !tab.pinned) {
        removableIds.push(tab.id)
      }
    }

    return removableIds
  }

  function getRemovableIds() {
    const removableIds: Key[] = []

    for (const tab of tabs.value) {
      if (!tab.locked && !tab.pinned) {
        removableIds.push(tab.id)
      }
    }

    return removableIds
  }

  function setTabActivePath(key: string) {
    tabActivePath.value = key
  }

  return {
    tabs,
    tabActivePath,
    setTabActivePath,
    getTab,
    createTab,
    updateTab,
    removeTab,
    setTabs,
    clearTabs,
    getRemovableIdsBefore,
    getRemovableIdsAfter,
    getRemovableIdsOther,
    getRemovableIds,
  }
})

export function toRefsTabsStore() {
  return {
    ...storeToRefs(useTabsStore(pinia)),
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTabsStore, import.meta.hot))
}
