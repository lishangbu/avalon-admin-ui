import type { RoleView } from '@/pages/system/role/types'
import type { Id } from '@/types/common'

export interface UserView {
  id?: Id
  username?: string
  phone?: string | null
  email?: string | null
  avatar?: string | null
  enabled?: boolean | null
  roles?: RoleView[] | null
}

export interface UserQuery {
  id?: Id
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
  hashedPassword?: string
  roleIds?: Id[]
}

export interface UpdateUserInput extends SaveUserInput {
  id: Id
}

export interface UserFormValues {
  id: string
  username: string
  phone: string
  email: string
  avatar: string
  enabled: boolean
  hashedPassword: string
  roleIds: string[]
}
