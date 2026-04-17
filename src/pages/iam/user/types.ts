import type { RoleView } from '@/pages/iam/role/types'

export interface UserView {
  id?: string
  username?: string
  phone?: string | null
  email?: string | null
  avatar?: string | null
  enabled?: boolean | null
  roleIds?: string[]
  roles?: RoleView[] | null
}

export interface UserQuery {
  id?: string
  username?: string
  phone?: string
  email?: string
  enabled?: boolean | null
}

export interface SaveUserInput {
  username?: string
  phone?: string
  email?: string
  avatar?: string
  enabled?: boolean | null
  passwordHash?: string
  roleIds?: string[]
}

export interface UpdateUserInput extends SaveUserInput {
  id: string
}

export interface UserFormValues {
  id: string
  username: string
  phone: string
  email: string
  avatar: string
  enabled: boolean
  passwordHash: string
  roleIds: string[]
}
