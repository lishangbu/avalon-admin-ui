import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listAbilities(query: AbilityQuery = {}) {
  return request<Ability[]>({
    url: '/ability/list',
    method: 'GET',
    params: withScopedQuery('ability', query),
  })
}

export async function createAbility(payload: AbilityFormModel) {
  return request<Ability>({
    url: '/ability',
    method: 'POST',
    data: payload,
  })
}

export async function updateAbility(payload: AbilityFormModel) {
  return request<Ability>({
    url: '/ability',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteAbility(id: Id) {
  return request<void>({
    url: `/ability/${id}`,
    method: 'DELETE',
  })
}
