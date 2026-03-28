import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listNatures(query: NatureQuery = {}) {
  return request<Nature[]>({
    url: '/nature/list',
    method: 'GET',
    params: withScopedQuery('nature', query),
  })
}

export async function createNature(payload: NatureFormModel) {
  return request<Nature>({
    url: '/nature',
    method: 'POST',
    data: payload,
  })
}

export async function updateNature(payload: NatureFormModel) {
  return request<Nature>({
    url: '/nature',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteNature(id: Id) {
  return request<void>({
    url: `/nature/${id}`,
    method: 'DELETE',
  })
}
