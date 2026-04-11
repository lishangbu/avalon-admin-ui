import type { Id } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface TypeRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
}

export interface TypeQuery {
  name?: string
  internalName?: string
}

export interface TypeUpsertInput {
  id?: Id
  name?: string
  internalName?: string
}

const endpoint = 'type'
const scope = 'type'

export async function listRows(query: TypeQuery = {}) {
  return request<TypeRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: TypeUpsertInput) {
  return request<TypeRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: TypeUpsertInput) {
  return request<TypeRecord>({
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