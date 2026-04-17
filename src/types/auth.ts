import type { PermissionView } from '@/pages/iam/permission/types'
import type { RoleView } from '@/pages/iam/role/types'
import type { UserView } from '@/pages/iam/user/types'
import type { MenuTreeNode } from '@/types/menu'

export interface LoginForm {
  username: string
  password: string
}

export interface TokenInfo {
  accessToken: string
  accessTokenExpiresAt: string
  refreshToken: string
  refreshTokenExpiresAt: string
  sessionId: string
}

export interface CurrentUserInfo {
  sessionId: string
  user: UserView
  roles: RoleView[]
  permissions: PermissionView[]
  roleCodes: string[]
  permissionCodes: string[]
  menuTree: MenuTreeNode[]
}

export interface AuthUser extends UserView {
  id: string
  username: string
  roles: RoleView[]
  permissions: PermissionView[]
  roleCodes: string[]
  permissionCodes?: string[]
  sessionId?: string
}
