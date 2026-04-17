import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface BerryFlavorRecord {
  id?: string
  name?: string | null
  internalName?: string | null
}

export interface BerryFlavorQuery {
  name?: string
  internalName?: string
}

export interface BerryFlavorUpsertInput {
  id?: string
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

export async function deleteRow(id: string) {
  return request<void>({
    url: `/${endpoint}/${id}`,
    method: 'DELETE',
  })
}
