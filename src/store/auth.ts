import { create } from 'zustand'
import { STORAGE_KEYS } from '@/config/app'
import { getCurrentUser, login, logout } from '@/pages/auth/login/service'
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
  bootstrap: (force?: boolean) => Promise<boolean>
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
      const result = await login({ username, password })
      writeStorage(STORAGE_KEYS.token, result.accessToken)
      writeStorage(STORAGE_KEYS.refreshToken, result.refreshToken)
      writeStorage(STORAGE_KEYS.sessionId, result.sessionId)
      set({ token: result.accessToken, initialized: false })
      await get().bootstrap()
    } finally {
      set({ loading: false })
    }
  },
  async bootstrap(force = false) {
    if (!get().token) {
      set({ initialized: true })
      return false
    }

    if (bootstrapPromise && !force) {
      return bootstrapPromise
    }

    const currentVersion = authStoreVersion
    bootstrapPromise = getCurrentUser()
      .then((currentUserResult) => {
        if (authStoreVersion !== currentVersion) {
          return false
        }

        const currentUser = currentUserResult
        const user: AuthUser = {
          ...currentUser.user,
          id: currentUser.user.id ?? '',
          username: currentUser.user.username ?? '',
          roles: currentUser.roles,
          permissions: currentUser.permissions,
          roleCodes: currentUser.roleCodes,
          permissionCodes: currentUser.permissionCodes,
          sessionId: currentUser.sessionId,
        }
        writeStorage(STORAGE_KEYS.user, user)
        writeStorage(STORAGE_KEYS.sessionId, currentUser.sessionId)
        useMenuStore.getState().setTree(currentUser.menuTree)
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
    removeStorage(STORAGE_KEYS.refreshToken)
    removeStorage(STORAGE_KEYS.sessionId)
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
