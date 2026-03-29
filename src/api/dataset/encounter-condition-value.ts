import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listEncounterConditionValues(query: EncounterConditionValueQuery = {}) {
  return request<EncounterConditionValue[]>({
    url: '/encounter-condition-value/list',
    method: 'GET',
    params: withScopedQuery('encounterConditionValue', query),
  })
}

export async function createEncounterConditionValue(payload: EncounterConditionValueFormModel) {
  return request<EncounterConditionValue>({
    url: '/encounter-condition-value',
    method: 'POST',
    data: payload,
  })
}

export async function updateEncounterConditionValue(payload: EncounterConditionValueFormModel) {
  return request<EncounterConditionValue>({
    url: '/encounter-condition-value',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteEncounterConditionValue(id: Id) {
  return request<void>({
    url: `/encounter-condition-value/${id}`,
    method: 'DELETE',
  })
}
