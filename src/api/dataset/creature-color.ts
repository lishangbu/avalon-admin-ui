import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listCreatureColors(query: CreatureColorQuery = {}) {
  return request<CreatureColor[]>({
    url: '/creature-colors/list',
    method: 'GET',
    params: withScopedQuery('creatureColor', query),
  })
}

export async function createCreatureColor(payload: CreatureColorFormModel) {
  return request<CreatureColor>({
    url: '/creature-colors',
    method: 'POST',
    data: payload,
  })
}

export async function updateCreatureColor(payload: CreatureColorFormModel) {
  return request<CreatureColor>({
    url: '/creature-colors',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteCreatureColor(id: Id) {
  return request<void>({
    url: `/creature-colors/${id}`,
    method: 'DELETE',
  })
}
