import { compactParams, withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listMoveDamageClasses(query: MoveDamageClassQuery = {}) {
  return request<MoveDamageClass[]>({
    url: '/move-damage-class/list',
    method: 'GET',
    params: withScopedQuery('moveDamageClass', compactParams(query)),
  })
}

export async function createMoveDamageClass(payload: MoveDamageClass) {
  return request<MoveDamageClass>({
    url: '/move-damage-class',
    method: 'POST',
    data: payload,
  })
}

export async function updateMoveDamageClass(payload: MoveDamageClass) {
  return request<MoveDamageClass>({
    url: '/move-damage-class',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteMoveDamageClass(id: Id) {
  return request<void>({
    url: `/move-damage-class/${id}`,
    method: 'DELETE',
  })
}
