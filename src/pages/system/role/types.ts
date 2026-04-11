import type { PermissionView } from '@/pages/system/permission/types'
import type { Id } from '@/types/common'
import type { MenuView } from '@/types/menu'

export interface RoleView {
  id?: Id
  code?: string
  name?: string
  enabled?: boolean | null
  menus?: MenuView[] | null
  permissions?: PermissionView[] | null
}

export interface RoleQuery {
  id?: Id
  code?: string
  name?: string
  enabled?: boolean | null
}

export interface SaveRoleInput {
  code?: string
  name?: string
  enabled?: boolean | null
  menuIds?: Id[]
  permissionIds?: Id[]
}

export interface UpdateRoleInput extends SaveRoleInput {
  id: Id
}
