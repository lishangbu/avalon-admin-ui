import type { CurrentUserInfo, LoginForm, TokenInfo } from '@/types/auth'
import { request } from '@/shared/api/http'
import {
  type IamCurrentUserResponse,
  normalizeMenuTree,
  normalizePermission,
  normalizeRole,
  normalizeUser,
} from '@/pages/iam/shared/idm-normalizers'

export async function login(payload: LoginForm) {
  return request<TokenInfo>({
    url: '/auth/login',
    method: 'POST',
    skipErrorMessage: true,
    data: {
      identityType: 'USERNAME',
      principal: payload.username,
      password: payload.password,
      clientType: 'ADMIN',
      deviceName: 'Avalon Admin UI',
    },
  })
}

export async function logout() {
  return request<void>({
    url: '/auth/logout',
    method: 'POST',
  })
}

export async function getCurrentUser() {
  const result = await request<IamCurrentUserResponse>({
    url: '/auth/current-user',
    method: 'GET',
  })

  return normalizeCurrentUser(result)
}

function normalizeCurrentUser(
  response: IamCurrentUserResponse,
): CurrentUserInfo {
  return {
    sessionId: response.sessionId,
    user: normalizeUser(response.user),
    roles: response.roles.map(normalizeRole),
    permissions: response.permissions.map(normalizePermission),
    roleCodes: response.roleCodes,
    permissionCodes: response.permissionCodes,
    menuTree: normalizeMenuTree(response.menuTree),
  }
}
