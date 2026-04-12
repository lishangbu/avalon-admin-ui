import type { MenuView } from '@/types/menu'

export interface PermissionView {
  id?: string
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
  id?: string
  menuId?: string
  code?: string
  name?: string
  enabled?: boolean | null
}

export interface SavePermissionInput {
  menuId?: string
  code?: string
  name?: string
  enabled?: boolean | null
  sortingOrder?: number | null
}

export interface UpdatePermissionInput extends SavePermissionInput {
  id: string
}
