import type { Id } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface GenderRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
}

export interface GenderQuery {
  name?: string
  internalName?: string
}

export interface GenderUpsertInput {
  id?: Id
  name?: string
  internalName?: string
}

const endpoint = 'gender'
const scope = 'gender'

export async function listRows(query: GenderQuery = {}) {
  return request<GenderRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: GenderUpsertInput) {
  return request<GenderRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: GenderUpsertInput) {
  return request<GenderRecord>({
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
