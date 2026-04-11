import type { Id } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface MoveCategoryRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
  description?: string | null
}

export interface MoveCategoryQuery {
  name?: string
  internalName?: string
  description?: string
}

export interface MoveCategoryUpsertInput {
  id?: Id
  name?: string
  internalName?: string
  description?: string
}

const endpoint = 'move-category'
const scope = 'moveCategory'

export async function listRows(query: MoveCategoryQuery = {}) {
  return request<MoveCategoryRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: MoveCategoryUpsertInput) {
  return request<MoveCategoryRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: MoveCategoryUpsertInput) {
  return request<MoveCategoryRecord>({
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