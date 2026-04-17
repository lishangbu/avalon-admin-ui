import type { PermissionView } from '@/pages/iam/permission/types'
import type { MenuView } from '@/types/menu'

export interface RoleView {
  id?: string
  code?: string
  name?: string
  enabled?: boolean | null
  menuIds?: string[]
  permissionIds?: string[]
  menus?: MenuView[] | null
  permissions?: PermissionView[] | null
}

export interface RoleQuery {
  id?: string
  code?: string
  name?: string
  enabled?: boolean | null
}

export interface SaveRoleInput {
  code?: string
  name?: string
  enabled?: boolean | null
  menuIds?: string[]
  permissionIds?: string[]
}

export interface UpdateRoleInput extends SaveRoleInput {
  id: string
}
