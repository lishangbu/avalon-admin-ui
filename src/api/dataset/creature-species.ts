import { buildScopedPageParams } from '@/api/shared'
import request from '@/utils/request'

export async function getCreatureSpeciesPage(pageRequest: PageRequest<CreatureSpeciesQuery>) {
  return request<Page<CreatureSpecies>>({
    url: '/creature-species/page',
    method: 'GET',
    params: buildScopedPageParams('creatureSpecies', pageRequest),
  })
}

export async function createCreatureSpecies(payload: CreatureSpeciesFormModel) {
  return request<CreatureSpecies>({
    url: '/creature-species',
    method: 'POST',
    data: payload,
  })
}

export async function updateCreatureSpecies(payload: CreatureSpeciesFormModel) {
  return request<CreatureSpecies>({
    url: '/creature-species',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteCreatureSpecies(id: Id) {
  return request<void>({
    url: `/creature-species/${id}`,
    method: 'DELETE',
  })
}
