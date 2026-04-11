import type { Id } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface CreatureHabitatRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
}

export interface CreatureHabitatQuery {
  name?: string
  internalName?: string
}

export interface CreatureHabitatUpsertInput {
  id?: Id
  name?: string
  internalName?: string
}

const endpoint = 'creature-habitats'
const scope = 'creatureHabitat'

export async function listRows(query: CreatureHabitatQuery = {}) {
  return request<CreatureHabitatRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: CreatureHabitatUpsertInput) {
  return request<CreatureHabitatRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: CreatureHabitatUpsertInput) {
  return request<CreatureHabitatRecord>({
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
