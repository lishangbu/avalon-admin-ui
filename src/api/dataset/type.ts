import { compactParams, withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listTypes(query: TypeQuery = {}) {
  return request<Type[]>({
    url: '/type/list',
    method: 'GET',
    params: withScopedQuery('type', compactParams(query)),
  })
}

export async function createType(payload: Type) {
  return request<Type>({
    url: '/type',
    method: 'POST',
    data: payload,
  })
}

export async function updateType(payload: Type) {
  return request<Type>({
    url: '/type',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteType(id: Id) {
  return request<void>({
    url: `/type/${id}`,
    method: 'DELETE',
  })
}
