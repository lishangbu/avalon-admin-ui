import type { Id } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface MoveLearnMethodRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
  description?: string | null
}

export interface MoveLearnMethodQuery {
  name?: string
  internalName?: string
  description?: string
}

export interface MoveLearnMethodUpsertInput {
  id?: Id
  name?: string
  internalName?: string
  description?: string
}

const endpoint = 'move-learn-method'
const scope = 'moveLearnMethod'

export async function listRows(query: MoveLearnMethodQuery = {}) {
  return request<MoveLearnMethodRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: MoveLearnMethodUpsertInput) {
  return request<MoveLearnMethodRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: MoveLearnMethodUpsertInput) {
  return request<MoveLearnMethodRecord>({
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
