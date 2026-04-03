import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listCreatureHabitats(query: CreatureHabitatQuery = {}) {
  return request<CreatureHabitat[]>({
    url: '/creature-habitats/list',
    method: 'GET',
    params: withScopedQuery('creatureHabitat', query),
  })
}

export async function createCreatureHabitat(payload: CreatureHabitatFormModel) {
  return request<CreatureHabitat>({
    url: '/creature-habitats',
    method: 'POST',
    data: payload,
  })
}

export async function updateCreatureHabitat(payload: CreatureHabitatFormModel) {
  return request<CreatureHabitat>({
    url: '/creature-habitats',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteCreatureHabitat(id: Id) {
  return request<void>({
    url: `/creature-habitats/${id}`,
    method: 'DELETE',
  })
}
