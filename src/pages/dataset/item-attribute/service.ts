import type { Id } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface ItemAttributeRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
  description?: string | null
}

export interface ItemAttributeQuery {
  name?: string
  internalName?: string
  description?: string
}

export interface ItemAttributeUpsertInput {
  id?: Id
  name?: string
  internalName?: string
  description?: string
}

const endpoint = 'item-attribute'
const scope = 'itemAttribute'

export async function listRows(query: ItemAttributeQuery = {}) {
  return request<ItemAttributeRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: ItemAttributeUpsertInput) {
  return request<ItemAttributeRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: ItemAttributeUpsertInput) {
  return request<ItemAttributeRecord>({
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
