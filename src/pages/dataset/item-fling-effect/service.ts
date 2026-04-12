import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface ItemFlingEffectRecord {
  id?: string
  name?: string | null
  internalName?: string | null
  effect?: string | null
}

export interface ItemFlingEffectQuery {
  name?: string
  internalName?: string
  effect?: string
}

export interface ItemFlingEffectUpsertInput {
  id?: string
  name?: string
  internalName?: string
  effect?: string
}

const endpoint = 'item-fling-effect'
const scope = 'itemFlingEffect'

export async function listRows(query: ItemFlingEffectQuery = {}) {
  return request<ItemFlingEffectRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: ItemFlingEffectUpsertInput) {
  return request<ItemFlingEffectRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: ItemFlingEffectUpsertInput) {
  return request<ItemFlingEffectRecord>({
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
