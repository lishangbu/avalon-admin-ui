import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { compactParams, mapPage } from '@/utils/request'
import {
  type IamPermissionResponse,
  normalizePermission,
  toBackendPermissionPayload,
} from '@/pages/iam/shared/idm-normalizers'
import type {
  PermissionQuery,
  SavePermissionInput,
  UpdatePermissionInput,
} from './types'

const endpoint = '/iam/permissions'

export async function getPermissionById(id: string) {
  const result = await request<IamPermissionResponse>({
    url: `${endpoint}/${id}`,
    method: 'GET',
  })

  return normalizePermission(result)
}

export async function getPermissionPage(
  pageRequest: PageRequest<PermissionQuery>,
) {
  const result = await request<Page<IamPermissionResponse>>({
    url: endpoint,
    method: 'GET',
    params: compactParams({
      page: Math.max(pageRequest.page ?? 1, 1),
      size: pageRequest.size ?? 10,
      ...pageRequest.query,
    }),
  })

  return mapPage(result, normalizePermission)
}

export async function lookupPermissions(query: PermissionQuery = {}) {
  const items = await request<IamPermissionResponse[]>({
    url: `${endpoint}/lookup`,
    method: 'GET',
    params: compactParams(query),
  })

  return items.map(normalizePermission)
}

export async function createPermission(payload: SavePermissionInput) {
  const result = await request<IamPermissionResponse>({
    url: endpoint,
    method: 'POST',
    data: toBackendPermissionPayload(payload),
  })

  return normalizePermission(result)
}

export async function updatePermission(payload: UpdatePermissionInput) {
  const result = await request<IamPermissionResponse>({
    url: `${endpoint}/${payload.id}`,
    method: 'PUT',
    data: toBackendPermissionPayload(payload),
  })

  return normalizePermission(result)
}

export async function deletePermission(id: string) {
  return request<void>({
    url: `${endpoint}/${id}`,
    method: 'DELETE',
  })
}
