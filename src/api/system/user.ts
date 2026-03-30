import { z } from 'zod'

import {
  booleanFieldSchema,
  buildScopedListParams,
  buildScopedPageParams,
  createApiObjectSchema,
  idFieldSchema,
  requestParsedEntity,
  requestParsedList,
  requestParsedPage,
} from '@/api/shared'
import request from '@/utils/request'

const roleViewSchema = createApiObjectSchema<RoleView>({
  id: idFieldSchema,
  enabled: booleanFieldSchema,
})

const userViewSchema = createApiObjectSchema<UserView>({
  id: idFieldSchema,
  roles: z.array(roleViewSchema).optional(),
})

export async function getUserById(id: Id) {
  return requestParsedEntity(userViewSchema, {
    url: `/user/${id}`,
    method: 'GET',
  })
}

export async function getUserPage(pageRequest: PageRequest<UserQuery>) {
  return requestParsedPage(userViewSchema, {
    url: '/user/page',
    method: 'GET',
    params: buildScopedPageParams('user', pageRequest),
  })
}

export async function listUsers(query: UserQuery = {}) {
  return requestParsedList(userViewSchema, {
    url: '/user/list',
    method: 'GET',
    params: buildScopedListParams('user', query),
  })
}

export async function createUser(payload: SaveUserInput) {
  return requestParsedEntity(userViewSchema, {
    url: '/user',
    method: 'POST',
    data: payload,
  })
}

export async function updateUser(payload: UpdateUserInput) {
  return requestParsedEntity(userViewSchema, {
    url: '/user',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteUser(id: Id) {
  return request<void>({
    url: `/user/${id}`,
    method: 'DELETE',
  })
}
