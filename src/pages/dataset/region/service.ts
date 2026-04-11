import type { Id } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface RegionRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
}

export interface RegionQuery {
  name?: string
  internalName?: string
}

export interface RegionUpsertInput {
  id?: Id
  name?: string
  internalName?: string
}

const endpoint = 'region'
const scope = 'region'

export async function listRows(query: RegionQuery = {}) {
  return request<RegionRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: RegionUpsertInput) {
  return request<RegionRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: RegionUpsertInput) {
  return request<RegionRecord>({
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