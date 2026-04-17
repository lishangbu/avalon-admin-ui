import { beforeEach, expect, test, vi } from 'vitest'
import type { CurrentUserInfo } from '@/types/auth'
import { STORAGE_KEYS } from '@/config/app'

const { getCurrentUserMock } = vi.hoisted(() => ({
  getCurrentUserMock: vi.fn<() => Promise<CurrentUserInfo>>(),
}))

vi.mock('@/pages/auth/login/service', () => ({
  getCurrentUser: getCurrentUserMock,
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
      nickname: 'Tester',
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
