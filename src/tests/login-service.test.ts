import { beforeEach, expect, test, vi } from 'vitest'
import type { LoginForm } from '@/types/auth'

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}))

vi.mock('@/shared/api/http', () => ({
  request: requestMock,
}))

import { login, refresh } from '@/pages/auth/login/service'

beforeEach(() => {
  requestMock.mockReset()
  requestMock.mockResolvedValue({})
})

test('login suppresses the global error toast', async () => {
  const payload: LoginForm = {
    username: 'admin',
    password: '123456',
  }

  await login(payload)

  expect(requestMock).toHaveBeenCalledWith(
    expect.objectContaining({
      url: '/auth/login',
      method: 'POST',
      skipErrorMessage: true,
    }),
  )
})

test('refresh posts the refresh token without global or recursive auth handling', async () => {
  await refresh('refresh-token-1')

  expect(requestMock).toHaveBeenCalledWith(
    expect.objectContaining({
      url: '/auth/refresh',
      method: 'POST',
      skipErrorMessage: true,
      skipAuthRefresh: true,
      data: {
        refreshToken: 'refresh-token-1',
      },
    }),
  )
})
