import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams, buildScopedPageParams } from '@/utils/request'
interface EntitySummary {
  id?: string
  name?: string | null
  internalName?: string | null
}

export interface LocationRecord {
  id?: string
  name?: string | null
  internalName?: string | null
  region?: EntitySummary | null
}

export interface LocationQuery {
  name?: string
  internalName?: string
  regionId?: string | null
}

export interface LocationUpsertInput {
  id?: string
  name?: string
  internalName?: string
  regionId?: string | null
}

const endpoint = 'location'
const scope = 'location'

export async function getPage(pageRequest: PageRequest<LocationQuery>) {
  return request<Page<LocationRecord>>({
    url: `/${endpoint}/page`,
    method: 'GET',
    params: buildScopedPageParams(scope, pageRequest),
  })
}

export async function listRows(query: LocationQuery = {}) {
  return request<LocationRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: LocationUpsertInput) {
  return request<LocationRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: LocationUpsertInput) {
  return request<LocationRecord>({
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
