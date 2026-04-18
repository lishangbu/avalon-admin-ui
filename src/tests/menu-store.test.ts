import { beforeEach, expect, test, vi } from 'vitest'
import type { CurrentUserInfo } from '@/types/auth'
import { STORAGE_KEYS } from '@/config/app'

const { getCurrentUserMock, refreshMock } = vi.hoisted(() => ({
  getCurrentUserMock: vi.fn<() => Promise<CurrentUserInfo>>(),
  refreshMock: vi.fn(),
}))

vi.mock('@/pages/auth/login/service', () => ({
  getCurrentUser: getCurrentUserMock,
  refresh: refreshMock,
  login: vi.fn(),
  logout: vi.fn(),
}))

import { useAuthStore } from '@/store/auth'
import { useMenuStore } from '@/store/menu'

function buildCurrentUser(menuTitle: string): CurrentUserInfo {
  return {
    sessionId: 'session-1',
    user: {
      id: 'user-1',
      username: 'tester',
      enabled: true,
    },
    roles: [],
    permissions: [],
    roleCodes: [],
    permissionCodes: [],
    menuTree: [
      {
        key: 'dashboard',
        name: 'dashboard',
        title: menuTitle,
        path: '/dashboard',
        component: 'dashboard/index',
        type: 'menu',
      },
    ],
  }
}

beforeEach(() => {
  localStorage.clear()
  getCurrentUserMock.mockReset()
  useMenuStore.getState().reset()
  useAuthStore.getState().clearAuth()
  useAuthStore.setState({
    token: 'token-1',
    user: null,
    loading: false,
    initialized: false,
  })
})

test('loadMenus returns cached routes without refreshing by default', async () => {
  useMenuStore.getState().setTree(buildCurrentUser('缓存菜单').menuTree)

  const routes = await useMenuStore.getState().loadMenus()

  expect(getCurrentUserMock).not.toHaveBeenCalled()
  expect(routes).toHaveLength(1)
  expect(routes[0]?.meta.title).toBe('缓存菜单')
})

test('loadMenus(true) refreshes menus from current user endpoint', async () => {
  getCurrentUserMock.mockResolvedValue(buildCurrentUser('最新菜单'))

  const routes = await useMenuStore.getState().loadMenus(true)

  expect(getCurrentUserMock).toHaveBeenCalledTimes(1)
  expect(routes[0]?.meta.title).toBe('最新菜单')
  expect(useMenuStore.getState().routes[0]?.meta.title).toBe('最新菜单')
  expect(useAuthStore.getState().user?.username).toBe('tester')
  expect(localStorage.getItem(STORAGE_KEYS.user)).toContain('tester')
})

test('refreshSession updates the stored token pair', async () => {
  refreshMock.mockResolvedValue({
    accessToken: 'token-2',
    accessTokenExpiresAt: '2099-01-01T00:10:00Z',
    refreshToken: 'refresh-token-2',
    refreshTokenExpiresAt: '2099-01-02T00:00:00Z',
    sessionId: 'session-2',
  })

  useAuthStore.setState({
    token: 'token-1',
    user: null,
    loading: false,
    initialized: true,
  })
  localStorage.setItem(
    STORAGE_KEYS.refreshToken,
    JSON.stringify('refresh-token-1'),
  )

  const refreshSession = (
    useAuthStore.getState() as {
      refreshSession?: () => Promise<string | null>
    }
  ).refreshSession

  const nextToken = await refreshSession?.()

  expect(nextToken).toBe('token-2')
  expect(refreshMock).toHaveBeenCalledWith('refresh-token-1')
  expect(localStorage.getItem(STORAGE_KEYS.token)).toContain('token-2')
  expect(localStorage.getItem(STORAGE_KEYS.refreshToken)).toContain(
    'refresh-token-2',
  )
})
