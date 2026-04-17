import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedPageParams } from '@/utils/request'
interface EntitySummary {
  id?: string
  name?: string | null
  internalName?: string | null
}

export interface LocationAreaRecord {
  id?: string
  name?: string | null
  internalName?: string | null
  gameIndex?: number | null
  location?: EntitySummary | null
}

export interface LocationAreaQuery {
  name?: string
  internalName?: string
  gameIndex?: number | null
  locationId?: string | null
}

export interface LocationAreaUpsertInput {
  id?: string
  name?: string
  internalName?: string
  gameIndex?: number | null
  locationId?: string | null
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

export async function deleteRow(id: string) {
  return request<void>({
    url: `/${endpoint}/${id}`,
    method: 'DELETE',
  })
}
