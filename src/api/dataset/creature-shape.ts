import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listCreatureShapes(query: CreatureShapeQuery = {}) {
  return request<CreatureShape[]>({
    url: '/creature-shapes/list',
    method: 'GET',
    params: withScopedQuery('creatureShape', query),
  })
}

export async function createCreatureShape(payload: CreatureShapeFormModel) {
  return request<CreatureShape>({
    url: '/creature-shapes',
    method: 'POST',
    data: payload,
  })
}

export async function updateCreatureShape(payload: CreatureShapeFormModel) {
  return request<CreatureShape>({
    url: '/creature-shapes',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteCreatureShape(id: Id) {
  return request<void>({
    url: `/creature-shapes/${id}`,
    method: 'DELETE',
  })
}
