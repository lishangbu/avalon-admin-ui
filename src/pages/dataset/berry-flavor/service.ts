import type { Id } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface BerryFlavorRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
}

export interface BerryFlavorQuery {
  name?: string
  internalName?: string
}

export interface BerryFlavorUpsertInput {
  id?: Id
  name?: string
  internalName?: string
}

const endpoint = 'berry-flavor'
const scope = 'berryFlavor'

export async function listRows(query: BerryFlavorQuery = {}) {
  return request<BerryFlavorRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: BerryFlavorUpsertInput) {
  return request<BerryFlavorRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: BerryFlavorUpsertInput) {
  return request<BerryFlavorRecord>({
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
