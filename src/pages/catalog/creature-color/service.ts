import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface CreatureColorRecord {
  id?: string
  name?: string | null
  internalName?: string | null
}

export interface CreatureColorQuery {
  name?: string
  internalName?: string
}

export interface CreatureColorUpsertInput {
  id?: string
  name?: string
  internalName?: string
}

const endpoint = 'creature-colors'
const scope = 'creatureColor'

export async function listRows(query: CreatureColorQuery = {}) {
  return request<CreatureColorRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: CreatureColorUpsertInput) {
  return request<CreatureColorRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: CreatureColorUpsertInput) {
  return request<CreatureColorRecord>({
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
