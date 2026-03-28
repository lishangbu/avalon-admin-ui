import { z } from 'zod'

import {
  booleanFieldSchema,
  buildScopedListParams,
  buildScopedPageParams,
  createApiObjectSchema,
  idFieldSchema,
  nullableIdFieldSchema,
  requestParsedEntity,
  requestParsedList,
  requestParsedPage,
} from '@/api/shared'
import request from '@/utils/request'

const menuEntitySchema = createApiObjectSchema<Menu>({
  id: idFieldSchema,
  parentId: nullableIdFieldSchema,
  disabled: booleanFieldSchema,
  show: booleanFieldSchema,
  pinned: booleanFieldSchema,
  showTab: booleanFieldSchema,
  enableMultiTab: booleanFieldSchema,
})

const roleEntitySchema = createApiObjectSchema<Role>({
  id: idFieldSchema,
  enabled: booleanFieldSchema,
  menus: z.array(menuEntitySchema).optional(),
})

export async function getRoleById(id: Id) {
  return requestParsedEntity(roleEntitySchema, {
    url: `/role/${id}`,
    method: 'GET',
  })
}

export async function getRolePage(pageRequest: PageRequest<RoleQuery>) {
  return requestParsedPage(roleEntitySchema, {
    url: '/role/page',
    method: 'GET',
    params: buildScopedPageParams('role', pageRequest),
  })
}

export async function listRoles(query: RoleQuery = {}) {
  return requestParsedList(roleEntitySchema, {
    url: '/role/list',
    method: 'GET',
    params: buildScopedListParams('role', query),
  })
}

export async function createRole(payload: Role) {
  return requestParsedEntity(roleEntitySchema, {
    url: '/role',
    method: 'POST',
    data: payload,
  })
}

export async function updateRole(payload: Role) {
  return requestParsedEntity(roleEntitySchema, {
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
