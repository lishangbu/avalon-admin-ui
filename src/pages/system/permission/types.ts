import type { Id } from '@/types/common'
import type { MenuView } from '@/types/menu'

export interface PermissionView {
  id?: Id
  code?: string
  name?: string
  enabled?: boolean | null
  sortingOrder?: number | null
  menu?: Pick<
    MenuView,
    'id' | 'key' | 'title' | 'name' | 'type' | 'path'
  > | null
}

export interface PermissionQuery {
  id?: Id
  menuId?: Id
  code?: string
  name?: string
  enabled?: boolean | null
}

export interface SavePermissionInput {
  menuId?: Id
  code?: string
  name?: string
  enabled?: boolean | null
  sortingOrder?: number | null
}

export interface UpdatePermissionInput extends SavePermissionInput {
  id: Id
}
