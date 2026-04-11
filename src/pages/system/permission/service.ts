import type { Id } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
import type {
  PermissionQuery,
  PermissionView,
  SavePermissionInput,
  UpdatePermissionInput,
} from './types'

export async function getPermissionById(id: Id) {
  return request<PermissionView>({
    url: `/permission/${id}`,
    method: 'GET',
  })
}

export async function listPermissions(query: PermissionQuery = {}) {
  return request<PermissionView[]>({
    url: '/permission/list',
    method: 'GET',
    params: buildScopedListParams('permission', query),
  })
}

export async function createPermission(payload: SavePermissionInput) {
  return request<PermissionView>({
    url: '/permission',
    method: 'POST',
    data: payload,
  })
}

export async function updatePermission(payload: UpdatePermissionInput) {
  return request<PermissionView>({
    url: '/permission',
    method: 'PUT',
    data: payload,
  })
}

export async function deletePermission(id: Id) {
  return request<void>({
    url: `/permission/${id}`,
    method: 'DELETE',
  })
}
