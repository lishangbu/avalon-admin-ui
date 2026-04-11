import type { Id } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface AbilityRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
  effect?: string | null
  introduction?: string | null
}

export interface AbilityQuery {
  name?: string
  internalName?: string
  effect?: string
  introduction?: string
}

export interface AbilityUpsertInput {
  id?: Id
  name?: string
  internalName?: string
  effect?: string
  introduction?: string
}

const endpoint = 'ability'
const scope = 'ability'

export async function listRows(query: AbilityQuery = {}) {
  return request<AbilityRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: AbilityUpsertInput) {
  return request<AbilityRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: AbilityUpsertInput) {
  return request<AbilityRecord>({
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
