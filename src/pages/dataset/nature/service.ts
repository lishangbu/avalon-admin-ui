import type { Id } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
interface EntitySummary {
  id?: Id
  name?: string | null
  internalName?: string | null
}

export interface NatureRecord {
  id?: Id
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
  increasedStatId?: Id | null
  decreasedStatId?: Id | null
  likesBerryFlavorId?: Id | null
  hatesBerryFlavorId?: Id | null
}

export interface NatureUpsertInput {
  id?: Id
  name?: string
  internalName?: string
  increasedStatId?: Id | null
  decreasedStatId?: Id | null
  likesBerryFlavorId?: Id | null
  hatesBerryFlavorId?: Id | null
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

export async function deleteRow(id: Id) {
  return request<void>({
    url: `/${endpoint}/${id}`,
    method: 'DELETE',
  })
}
