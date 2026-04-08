import { buildScopedPageParams } from '@/api/shared'
import request from '@/utils/request'

export async function getCreatureEvolutionPage(pageRequest: PageRequest<CreatureEvolutionQuery>) {
  return request<Page<CreatureEvolution>>({
    url: '/creature-evolutions/page',
    method: 'GET',
    params: buildScopedPageParams('creatureEvolution', pageRequest),
  })
}

export async function createCreatureEvolution(payload: CreatureEvolutionFormModel) {
  return request<CreatureEvolution>({
    url: '/creature-evolutions',
    method: 'POST',
    data: payload,
  })
}

export async function updateCreatureEvolution(payload: CreatureEvolutionFormModel) {
  return request<CreatureEvolution>({
    url: '/creature-evolutions',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteCreatureEvolution(id: Id) {
  return request<void>({
    url: `/creature-evolutions/${id}`,
    method: 'DELETE',
  })
}
