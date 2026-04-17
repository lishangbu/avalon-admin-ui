import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams, buildScopedPageParams } from '@/utils/request'
export interface BerryFirmnessRecord {
  id?: string
  name?: string | null
  internalName?: string | null
}

export interface BerryFirmnessQuery {
  name?: string
  internalName?: string
}

export interface BerryFirmnessUpsertInput {
  id?: string
  name?: string
  internalName?: string
}

const endpoint = 'berry-firmness'
const scope = 'berryFirmness'

export async function getPage(pageRequest: PageRequest<BerryFirmnessQuery>) {
  return request<Page<BerryFirmnessRecord>>({
    url: `/${endpoint}/page`,
    method: 'GET',
    params: buildScopedPageParams(scope, pageRequest),
  })
}

export async function listRows(query: BerryFirmnessQuery = {}) {
  return request<BerryFirmnessRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: BerryFirmnessUpsertInput) {
  return request<BerryFirmnessRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: BerryFirmnessUpsertInput) {
  return request<BerryFirmnessRecord>({
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
