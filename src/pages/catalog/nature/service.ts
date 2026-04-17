import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
interface EntitySummary {
  id?: string
  name?: string | null
  internalName?: string | null
}

export interface NatureRecord {
  id?: string
  name?: string | null
  internalName?: string | null
  increasedStat?: EntitySummary | null
  decreasedStat?: EntitySummary | null
  likesBerryFlavor?: EntitySummary | null
  hatesBerryFlavor?: EntitySummary | null
}

export interface NatureQuery {
  name?: string
  internalName?: string
  increasedStatId?: string | null
  decreasedStatId?: string | null
  likesBerryFlavorId?: string | null
  hatesBerryFlavorId?: string | null
}

export interface NatureUpsertInput {
  id?: string
  name?: string
  internalName?: string
  increasedStatId?: string | null
  decreasedStatId?: string | null
  likesBerryFlavorId?: string | null
  hatesBerryFlavorId?: string | null
}

const endpoint = 'nature'
const scope = 'nature'

export async function listRows(query: NatureQuery = {}) {
  return request<NatureRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: NatureUpsertInput) {
  return request<NatureRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: NatureUpsertInput) {
  return request<NatureRecord>({
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
