import type { Id } from './common'

export interface LoginForm {
  username: string
  password: string
  grant_type: 'password'
}

export interface TokenInfo {
  access_token: string
  token_type: string
  expires_in: string
  refresh_token: string
  scope: string
  id_token: string
}

export interface AuthRole {
  id: Id
  code: string
  name: string
  enabled: boolean
  permissions?: {
    id?: Id
    code?: string
    name?: string
    enabled?: boolean | null
  }[] | null
}

export interface AuthUser {
  id: Id
  username: string
  roles: AuthRole[]
  avatar: string
  permissionCodes?: string[]
}
