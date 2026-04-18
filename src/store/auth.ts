import { create } from 'zustand'
import { STORAGE_KEYS } from '@/config/app'
import {
  getCurrentUser,
  login,
  logout,
  refresh,
} from '@/pages/auth/login/service'
import type { AuthUser, TokenInfo } from '@/types/auth'
import { useMenuStore } from '@/store/menu'
import { useTabsStore } from '@/store/tabs'
import { readStorage, removeStorage, writeStorage } from '@/utils/storage'

interface AuthState {
  token: string
  refreshToken: string
  tokenExpiresAt: string | null
  refreshTokenExpiresAt: string | null
  user: AuthUser | null
  loading: boolean
  initialized: boolean
  signIn: (username: string, password: string) => Promise<void>
  bootstrap: (force?: boolean) => Promise<boolean>
  refreshSession: () => Promise<string | null>
  clearAuth: () => void
  signOut: () => Promise<void>
}

const storedToken = readStorage(STORAGE_KEYS.token, '')
const storedRefreshToken = readStorage(STORAGE_KEYS.refreshToken, '')
const storedTokenExpiresAt = readStorage<string | null>(
  STORAGE_KEYS.tokenExpiresAt,
  null,
)
const storedRefreshTokenExpiresAt = readStorage<string | null>(
  STORAGE_KEYS.refreshTokenExpiresAt,
  null,
)

let bootstrapPromise: Promise<boolean> | null = null
let refreshPromise: Promise<string | null> | null = null
let authStoreVersion = 0
let refreshTimer: ReturnType<typeof setTimeout> | null = null

const REFRESH_LEAD_TIME_MS = 60_000
const MAX_TIMER_DELAY_MS = 2_147_483_647

function clearRefreshTimer() {
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }
}

function persistTokenInfo(tokenInfo: TokenInfo) {
  writeStorage(STORAGE_KEYS.token, tokenInfo.accessToken)
  writeStorage(STORAGE_KEYS.tokenExpiresAt, tokenInfo.accessTokenExpiresAt)
  writeStorage(STORAGE_KEYS.refreshToken, tokenInfo.refreshToken)
  writeStorage(
    STORAGE_KEYS.refreshTokenExpiresAt,
    tokenInfo.refreshTokenExpiresAt,
  )
  writeStorage(STORAGE_KEYS.sessionId, tokenInfo.sessionId)
}

function scheduleRefresh(expiresAt: string | null | undefined) {
  clearRefreshTimer()

  const expiresAtTimestamp = expiresAt ? Date.parse(expiresAt) : Number.NaN
  if (Number.isNaN(expiresAtTimestamp)) {
    return
  }

  const delay = Math.max(
    expiresAtTimestamp - Date.now() - REFRESH_LEAD_TIME_MS,
    0,
  )

  refreshTimer = setTimeout(
    () => {
      void useAuthStore.getState().refreshSession()
    },
    Math.min(delay, MAX_TIMER_DELAY_MS),
  )
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: storedToken,
  refreshToken: storedRefreshToken,
  tokenExpiresAt: storedTokenExpiresAt,
  refreshTokenExpiresAt: storedRefreshTokenExpiresAt,
  user: readStorage<AuthUser | null>(STORAGE_KEYS.user, null),
  loading: false,
  initialized: false,
  async signIn(username, password) {
    set({ loading: true })
    try {
      const result = await login({ username, password })
      persistTokenInfo(result)
      scheduleRefresh(result.accessTokenExpiresAt)
      set({
        token: result.accessToken,
        refreshToken: result.refreshToken,
        tokenExpiresAt: result.accessTokenExpiresAt,
        refreshTokenExpiresAt: result.refreshTokenExpiresAt,
        initialized: false,
      })
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

    scheduleRefresh(get().tokenExpiresAt)

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
  async refreshSession() {
    const currentRefreshToken =
      get().refreshToken || readStorage(STORAGE_KEYS.refreshToken, '')

    if (!currentRefreshToken) {
      get().clearAuth()
      return null
    }

    if (refreshPromise) {
      return refreshPromise
    }

    const currentVersion = authStoreVersion
    refreshPromise = refresh(currentRefreshToken)
      .then((tokenInfo) => {
        if (authStoreVersion !== currentVersion) {
          return null
        }

        persistTokenInfo(tokenInfo)
        scheduleRefresh(tokenInfo.accessTokenExpiresAt)
        set({
          token: tokenInfo.accessToken,
          refreshToken: tokenInfo.refreshToken,
          tokenExpiresAt: tokenInfo.accessTokenExpiresAt,
          refreshTokenExpiresAt: tokenInfo.refreshTokenExpiresAt,
        })
        return tokenInfo.accessToken
      })
      .catch(() => {
        if (authStoreVersion === currentVersion) {
          get().clearAuth()
        }
        return null
      })
      .finally(() => {
        refreshPromise = null
      })

    return refreshPromise
  },
  clearAuth() {
    authStoreVersion += 1
    bootstrapPromise = null
    refreshPromise = null
    clearRefreshTimer()
    removeStorage(STORAGE_KEYS.token)
    removeStorage(STORAGE_KEYS.tokenExpiresAt)
    removeStorage(STORAGE_KEYS.refreshToken)
    removeStorage(STORAGE_KEYS.refreshTokenExpiresAt)
    removeStorage(STORAGE_KEYS.sessionId)
    removeStorage(STORAGE_KEYS.user)
    removeStorage(STORAGE_KEYS.menus)
    removeStorage(STORAGE_KEYS.tabs)
    removeStorage(STORAGE_KEYS.redirect)
    useMenuStore.getState().reset()
    useTabsStore.getState().reset()
    set({
      token: '',
      refreshToken: '',
      tokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      user: null,
      initialized: false,
    })
  },
  async signOut() {
    try {
      await logout()
    } finally {
      get().clearAuth()
    }
  },
}))

if (storedToken && storedRefreshToken) {
  scheduleRefresh(storedTokenExpiresAt)
}
