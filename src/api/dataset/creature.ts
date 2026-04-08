import { buildScopedPageParams, withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listCreatures(query: CreatureQuery = {}) {
  return request<Creature[]>({
    url: '/creatures/list',
    method: 'GET',
    params: withScopedQuery('creature', query),
  })
}

export async function getCreaturePage(pageRequest: PageRequest<CreatureQuery>) {
  return request<Page<Creature>>({
    url: '/creatures/page',
    method: 'GET',
    params: buildScopedPageParams('creature', pageRequest),
  })
}

export async function createCreature(payload: CreatureCrudFormModel) {
  return request<Creature>({
    url: '/creatures',
    method: 'POST',
    data: payload,
  })
}

export async function updateCreature(payload: CreatureCrudFormModel) {
  return request<Creature>({
    url: '/creatures',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteCreature(id: Id) {
  return request<void>({
    url: `/creatures/${id}`,
    method: 'DELETE',
  })
}
