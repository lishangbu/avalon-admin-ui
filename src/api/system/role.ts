import { buildScopedListParams, buildScopedPageParams } from '@/api/shared'
import request from '@/utils/request'

export async function getRoleById(id: Id) {
  return request<RoleView>({
    url: `/role/${id}`,
    method: 'GET',
  })
}

export async function getRolePage(pageRequest: PageRequest<RoleQuery>) {
  return request<Page<RoleView>>({
    url: '/role/page',
    method: 'GET',
    params: buildScopedPageParams('role', pageRequest),
  })
}

export async function listRoles(query: RoleQuery = {}) {
  return request<RoleView[]>({
    url: '/role/list',
    method: 'GET',
    params: buildScopedListParams('role', query),
  })
}

export async function createRole(payload: SaveRoleInput) {
  return request<RoleView>({
    url: '/role',
    method: 'POST',
    data: payload,
  })
}

export async function updateRole(payload: UpdateRoleInput) {
  return request<RoleView>({
    url: '/role',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteRole(id: Id) {
  return request<void>({
    url: `/role/${id}`,
    method: 'DELETE',
  })
}
