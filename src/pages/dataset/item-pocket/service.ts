import type { Id } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface ItemPocketRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
}

export interface ItemPocketQuery {
  name?: string
  internalName?: string
}

export interface ItemPocketUpsertInput {
  id?: Id
  name?: string
  internalName?: string
}

const endpoint = 'item-pocket'
const scope = 'itemPocket'

export async function listRows(query: ItemPocketQuery = {}) {
  return request<ItemPocketRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: ItemPocketUpsertInput) {
  return request<ItemPocketRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: ItemPocketUpsertInput) {
  return request<ItemPocketRecord>({
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