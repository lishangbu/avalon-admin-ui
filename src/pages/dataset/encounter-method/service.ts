import type { Id } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface EncounterMethodRecord {
  id?: Id
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
  id?: Id
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

export async function deleteRow(id: Id) {
  return request<void>({
    url: `/${endpoint}/${id}`,
    method: 'DELETE',
  })
}
