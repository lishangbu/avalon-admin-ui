import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listEncounterConditions(query: EncounterConditionQuery = {}) {
  return request<EncounterCondition[]>({
    url: '/encounter-condition/list',
    method: 'GET',
    params: withScopedQuery('encounterCondition', query),
  })
}

export async function createEncounterCondition(payload: EncounterConditionFormModel) {
  return request<EncounterCondition>({
    url: '/encounter-condition',
    method: 'POST',
    data: payload,
  })
}

export async function updateEncounterCondition(payload: EncounterConditionFormModel) {
  return request<EncounterCondition>({
    url: '/encounter-condition',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteEncounterCondition(id: Id) {
  return request<void>({
    url: `/encounter-condition/${id}`,
    method: 'DELETE',
  })
}
