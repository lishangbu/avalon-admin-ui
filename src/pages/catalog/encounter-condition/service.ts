import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface EncounterConditionRecord {
  id?: string
  name?: string | null
  internalName?: string | null
}

export interface EncounterConditionQuery {
  name?: string
  internalName?: string
}

export interface EncounterConditionUpsertInput {
  id?: string
  name?: string
  internalName?: string
}

const endpoint = 'encounter-condition'
const scope = 'encounterCondition'

export async function listRows(query: EncounterConditionQuery = {}) {
  return request<EncounterConditionRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: EncounterConditionUpsertInput) {
  return request<EncounterConditionRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: EncounterConditionUpsertInput) {
  return request<EncounterConditionRecord>({
    url: `/${endpoint}`,
    method: 'PUT',
    data: payload,
  })
}

export async function deleteRow(id: string) {
  return request<void>({
    url: `/${endpoint}/${id}`,
    method: 'DELETE',
  })
}
