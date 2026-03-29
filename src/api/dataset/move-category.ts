import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listMoveCategories(query: MoveCategoryQuery = {}) {
  return request<MoveCategory[]>({
    url: '/move-category/list',
    method: 'GET',
    params: withScopedQuery('moveCategory', query),
  })
}

export async function createMoveCategory(payload: MoveCategoryFormModel) {
  return request<MoveCategory>({
    url: '/move-category',
    method: 'POST',
    data: payload,
  })
}

export async function updateMoveCategory(payload: MoveCategoryFormModel) {
  return request<MoveCategory>({
    url: '/move-category',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteMoveCategory(id: Id) {
  return request<void>({
    url: `/move-category/${id}`,
    method: 'DELETE',
  })
}
