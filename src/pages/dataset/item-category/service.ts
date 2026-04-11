import type { Id } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
interface EntitySummary {
  id?: Id
  name?: string | null
  internalName?: string | null
}

export interface ItemCategoryRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
  itemPocket?: EntitySummary | null
}

export interface ItemCategoryQuery {
  name?: string
  internalName?: string
  itemPocketId?: Id | null
}

export interface ItemCategoryUpsertInput {
  id?: Id
  name?: string
  internalName?: string
  itemPocketId?: Id | null
}

const endpoint = 'item-category'
const scope = 'itemCategory'

export async function listRows(query: ItemCategoryQuery = {}) {
  return request<ItemCategoryRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: ItemCategoryUpsertInput) {
  return request<ItemCategoryRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: ItemCategoryUpsertInput) {
  return request<ItemCategoryRecord>({
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
