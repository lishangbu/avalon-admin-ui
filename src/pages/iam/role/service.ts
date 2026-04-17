import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { compactParams, mapPage } from '@/utils/request'
import {
  type IamRoleResponse,
  normalizeRole,
  toBackendRolePayload,
} from '@/pages/iam/shared/idm-normalizers'
import type { RoleQuery, SaveRoleInput, UpdateRoleInput } from './types'

const endpoint = '/iam/roles'

export async function getRoleById(id: string) {
  const result = await request<IamRoleResponse>({
    url: `${endpoint}/${id}`,
    method: 'GET',
  })

  return normalizeRole(result)
}

export async function getRolePage(pageRequest: PageRequest<RoleQuery>) {
  const result = await request<Page<IamRoleResponse>>({
    url: endpoint,
    method: 'GET',
    params: compactParams({
      page: Math.max(pageRequest.page ?? 1, 1),
      size: pageRequest.size ?? 10,
      ...pageRequest.query,
    }),
  })

  return mapPage(result, normalizeRole)
}

export async function lookupRoles(query: RoleQuery = {}) {
  const items = await request<IamRoleResponse[]>({
    url: `${endpoint}/lookup`,
    method: 'GET',
    params: compactParams(query),
  })

  return items.map(normalizeRole)
}

export async function createRole(payload: SaveRoleInput) {
  const result = await request<IamRoleResponse>({
    url: endpoint,
    method: 'POST',
    data: toBackendRolePayload(payload),
  })

  return normalizeRole(result)
}

export async function updateRole(payload: UpdateRoleInput) {
  const result = await request<IamRoleResponse>({
    url: `${endpoint}/${payload.id}`,
    method: 'PUT',
    data: toBackendRolePayload(payload),
  })

  return normalizeRole(result)
}

export async function deleteRole(id: string) {
  return request<void>({
    url: `${endpoint}/${id}`,
    method: 'DELETE',
  })
}
