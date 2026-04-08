import { buildScopedListParams, buildScopedPageParams } from '@/api/shared'
import request from '@/utils/request'

export async function getUserById(id: Id) {
  return request<UserView>({
    url: `/user/${id}`,
    method: 'GET',
  })
}

export async function getUserPage(pageRequest: PageRequest<UserQuery>) {
  return request<Page<UserView>>({
    url: '/user/page',
    method: 'GET',
    params: buildScopedPageParams('user', pageRequest),
  })
}

export async function listUsers(query: UserQuery = {}) {
  return request<UserView[]>({
    url: '/user/list',
    method: 'GET',
    params: buildScopedListParams('user', query),
  })
}

export async function createUser(payload: SaveUserInput) {
  return request<UserView>({
    url: '/user',
    method: 'POST',
    data: payload,
  })
}

export async function updateUser(payload: UpdateUserInput) {
  return request<UserView>({
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
