import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface GenderRecord {
  id?: string
  name?: string | null
  internalName?: string | null
}

export interface GenderQuery {
  name?: string
  internalName?: string
}

export interface GenderUpsertInput {
  id?: string
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

export async function deleteRow(id: string) {
  return request<void>({
    url: `/${endpoint}/${id}`,
    method: 'DELETE',
  })
}
