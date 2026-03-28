import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listEggGroups(query: EggGroupQuery = {}) {
  return request<EggGroup[]>({
    url: '/egg-group/list',
    method: 'GET',
    params: withScopedQuery('eggGroup', query),
  })
}

export async function createEggGroup(payload: EggGroupFormModel) {
  return request<EggGroup>({
    url: '/egg-group',
    method: 'POST',
    data: payload,
  })
}

export async function updateEggGroup(payload: EggGroupFormModel) {
  return request<EggGroup>({
    url: '/egg-group',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteEggGroup(id: Id) {
  return request<void>({
    url: `/egg-group/${id}`,
    method: 'DELETE',
  })
}
