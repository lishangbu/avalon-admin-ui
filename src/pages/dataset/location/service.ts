import type { Id } from '@/types/common'
import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams, buildScopedPageParams } from '@/utils/request'
interface EntitySummary {
  id?: Id
  name?: string | null
  internalName?: string | null
}

export interface LocationRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
  region?: EntitySummary | null
}

export interface LocationQuery {
  name?: string
  internalName?: string
  regionId?: Id | null
}

export interface LocationUpsertInput {
  id?: Id
  name?: string
  internalName?: string
  regionId?: Id | null
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

export async function deleteRow(id: Id) {
  return request<void>({
    url: `/${endpoint}/${id}`,
    method: 'DELETE',
  })
}
