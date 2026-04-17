import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface GrowthRateRecord {
  id?: string
  name?: string | null
  internalName?: string | null
  description?: string | null
}

export interface GrowthRateQuery {
  name?: string
  internalName?: string
  description?: string
}

export interface GrowthRateUpsertInput {
  id?: string
  name?: string
  internalName?: string
  description?: string
}

const endpoint = 'growth-rate'
const scope = 'growthRate'

export async function listRows(query: GrowthRateQuery = {}) {
  return request<GrowthRateRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: GrowthRateUpsertInput) {
  return request<GrowthRateRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: GrowthRateUpsertInput) {
  return request<GrowthRateRecord>({
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
