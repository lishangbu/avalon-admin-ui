import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'

interface EntitySummary {
  id?: string
  name?: string | null
  internalName?: string | null
}

export interface StatRecord {
  id?: string
  name?: string | null
  internalName?: string | null
  sortingOrder?: number | null
  battleOnly?: boolean | null
  readonly?: boolean | null
  moveDamageClass?: EntitySummary | null
}

export interface StatQuery {
  name?: string
  internalName?: string
}

export interface StatUpsertInput {
  id?: string
  name?: string
  internalName?: string
  sortingOrder?: number | null
  battleOnly?: boolean | null
  readonly?: boolean | null
  moveDamageClassId?: string | null
}

const endpoint = 'stat'
const scope = 'stat'

export async function listRows(query: StatQuery = {}) {
  return request<StatRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: StatUpsertInput) {
  return request<StatRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: StatUpsertInput) {
  return request<StatRecord>({
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
