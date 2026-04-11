import type { AuthUser, LoginForm, TokenInfo } from '@/types/auth'
import { request } from '@/shared/api/http'

export async function login(payload: LoginForm) {
  const formData = new URLSearchParams()
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value)
  })

  return request<TokenInfo>({
    url: '/oauth2/token',
    method: 'POST',
    data: formData,
    headers: {
      Authorization: 'Basic dGVzdDp0ZXN0',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

export async function logout() {
  return request<void>({
    url: '/token/logout',
    method: 'DELETE',
  })
}

export async function getUserInfo() {
  return request<AuthUser>({
    url: '/user/info',
    method: 'GET',
  })
}

export async function getCurrentUserPermissions() {
  return request<string[]>({
    url: '/user/permissions',
    method: 'GET',
  })
}
