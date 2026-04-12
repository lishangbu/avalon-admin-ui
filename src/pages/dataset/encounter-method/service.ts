import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface EncounterMethodRecord {
  id?: string
  name?: string | null
  internalName?: string | null
  sortingOrder?: number | null
}

export interface EncounterMethodQuery {
  name?: string
  internalName?: string
  sortingOrder?: number | null
}

export interface EncounterMethodUpsertInput {
  id?: string
  name?: string
  internalName?: string
  sortingOrder?: number | null
}

const endpoint = 'encounter-method'
const scope = 'encounterMethod'

export async function listRows(query: EncounterMethodQuery = {}) {
  return request<EncounterMethodRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: EncounterMethodUpsertInput) {
  return request<EncounterMethodRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: EncounterMethodUpsertInput) {
  return request<EncounterMethodRecord>({
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
