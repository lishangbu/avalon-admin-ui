import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listEvolutionTriggers(query: EvolutionTriggerQuery = {}) {
  return request<EvolutionTrigger[]>({
    url: '/evolution-trigger/list',
    method: 'GET',
    params: withScopedQuery('evolutionTrigger', query),
  })
}

export async function createEvolutionTrigger(payload: EvolutionTriggerFormModel) {
  return request<EvolutionTrigger>({
    url: '/evolution-trigger',
    method: 'POST',
    data: payload,
  })
}

export async function updateEvolutionTrigger(payload: EvolutionTriggerFormModel) {
  return request<EvolutionTrigger>({
    url: '/evolution-trigger',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteEvolutionTrigger(id: Id) {
  return request<void>({
    url: `/evolution-trigger/${id}`,
    method: 'DELETE',
  })
}
