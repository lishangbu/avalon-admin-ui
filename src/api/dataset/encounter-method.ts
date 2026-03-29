import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listEncounterMethods(query: EncounterMethodQuery = {}) {
  return request<EncounterMethod[]>({
    url: '/encounter-method/list',
    method: 'GET',
    params: withScopedQuery('encounterMethod', query),
  })
}

export async function createEncounterMethod(payload: EncounterMethodFormModel) {
  return request<EncounterMethod>({
    url: '/encounter-method',
    method: 'POST',
    data: payload,
  })
}

export async function updateEncounterMethod(payload: EncounterMethodFormModel) {
  return request<EncounterMethod>({
    url: '/encounter-method',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteEncounterMethod(id: Id) {
  return request<void>({
    url: `/encounter-method/${id}`,
    method: 'DELETE',
  })
}
