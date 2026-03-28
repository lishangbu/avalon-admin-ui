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

const roleEntitySchema = createApiObjectSchema<Role>({
  id: idFieldSchema,
  enabled: booleanFieldSchema,
})

const userEntitySchema = createApiObjectSchema<User>({
  id: idFieldSchema,
  roles: z.array(roleEntitySchema).optional(),
})

export async function getUserById(id: Id) {
  return requestParsedEntity(userEntitySchema, {
    url: `/user/${id}`,
    method: 'GET',
  })
}

export async function getUserPage(pageRequest: PageRequest<UserQuery>) {
  return requestParsedPage(userEntitySchema, {
    url: '/user/page',
    method: 'GET',
    params: buildScopedPageParams('user', pageRequest),
  })
}

export async function listUsers(query: UserQuery = {}) {
  return requestParsedList(userEntitySchema, {
    url: '/user/list',
    method: 'GET',
    params: buildScopedListParams('user', query),
  })
}

export async function createUser(payload: User) {
  return requestParsedEntity(userEntitySchema, {
    url: '/user',
    method: 'POST',
    data: payload,
  })
}

export async function updateUser(payload: User) {
  return requestParsedEntity(userEntitySchema, {
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
