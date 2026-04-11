import type { Id } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface CreatureShapeRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
}

export interface CreatureShapeQuery {
  name?: string
  internalName?: string
}

export interface CreatureShapeUpsertInput {
  id?: Id
  name?: string
  internalName?: string
}

const endpoint = 'creature-shapes'
const scope = 'creatureShape'

export async function listRows(query: CreatureShapeQuery = {}) {
  return request<CreatureShapeRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: CreatureShapeUpsertInput) {
  return request<CreatureShapeRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: CreatureShapeUpsertInput) {
  return request<CreatureShapeRecord>({
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
