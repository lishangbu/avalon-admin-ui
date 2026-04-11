import type { Id } from '@/types/common'
import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedPageParams } from '@/utils/request'
interface EntitySummary {
  id?: Id
  name?: string | null
  internalName?: string | null
}

export interface LocationAreaRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
  gameIndex?: number | null
  location?: EntitySummary | null
}

export interface LocationAreaQuery {
  name?: string
  internalName?: string
  gameIndex?: number | null
  locationId?: Id | null
}

export interface LocationAreaUpsertInput {
  id?: Id
  name?: string
  internalName?: string
  gameIndex?: number | null
  locationId?: Id | null
}

const endpoint = 'location-area'
const scope = 'locationArea'

export async function getPage(pageRequest: PageRequest<LocationAreaQuery>) {
  return request<Page<LocationAreaRecord>>({
    url: `/${endpoint}/page`,
    method: 'GET',
    params: buildScopedPageParams(scope, pageRequest),
  })
}

export async function createRow(payload: LocationAreaUpsertInput) {
  return request<LocationAreaRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: LocationAreaUpsertInput) {
  return request<LocationAreaRecord>({
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
