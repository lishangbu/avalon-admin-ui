import { create } from 'zustand'
import { STORAGE_KEYS } from '@/config/app'
import {
  getCurrentUserPermissions,
  getUserInfo,
  login,
  logout,
} from '@/pages/auth/login/service'
import type { AuthUser } from '@/types/auth'
import { useMenuStore } from '@/store/menu'
import { useTabsStore } from '@/store/tabs'
import { readStorage, removeStorage, writeStorage } from '@/utils/storage'

interface AuthState {
  token: string
  user: AuthUser | null
  loading: boolean
  initialized: boolean
  signIn: (username: string, password: string) => Promise<void>
  bootstrap: () => Promise<boolean>
  clearAuth: () => void
  signOut: () => Promise<void>
}

let bootstrapPromise: Promise<boolean> | null = null
let authStoreVersion = 0

export const useAuthStore = create<AuthState>((set, get) => ({
  token: readStorage(STORAGE_KEYS.token, ''),
  user: readStorage<AuthUser | null>(STORAGE_KEYS.user, null),
  loading: false,
  initialized: false,
  async signIn(username, password) {
    set({ loading: true })
    try {
      const result = await login({ username, password, grant_type: 'password' })
      writeStorage(STORAGE_KEYS.token, result.data.access_token)
      set({ token: result.data.access_token, initialized: false })
      await get().bootstrap()
    } finally {
      set({ loading: false })
    }
  },
  async bootstrap() {
    if (!get().token) {
      set({ initialized: true })
      return false
    }

    if (bootstrapPromise) {
      return bootstrapPromise
    }

    const currentVersion = authStoreVersion
    bootstrapPromise = Promise.all([getUserInfo(), getCurrentUserPermissions()])
      .then(([userResult, permissionResult]) => {
        if (authStoreVersion !== currentVersion) {
          return false
        }

        const user: AuthUser = {
          ...userResult.data,
          permissionCodes: permissionResult.data ?? [],
        }
        writeStorage(STORAGE_KEYS.user, user)
        set({ user, initialized: true })
        return true
      })
      .catch(() => {
        if (authStoreVersion === currentVersion) {
          get().clearAuth()
          set({ initialized: true })
        }
        return false
      })
      .finally(() => {
        bootstrapPromise = null
      })

    return bootstrapPromise
  },
  clearAuth() {
    authStoreVersion += 1
    bootstrapPromise = null
    removeStorage(STORAGE_KEYS.token)
    removeStorage(STORAGE_KEYS.user)
    removeStorage(STORAGE_KEYS.menus)
    removeStorage(STORAGE_KEYS.tabs)
    removeStorage(STORAGE_KEYS.redirect)
    useMenuStore.getState().reset()
    useTabsStore.getState().reset()
    set({ token: '', user: null, initialized: false })
  },
  async signOut() {
    try {
      await logout()
    } finally {
      get().clearAuth()
    }
  },
}))
