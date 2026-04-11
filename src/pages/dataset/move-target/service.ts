import type { Id } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface MoveTargetRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
  description?: string | null
}

export interface MoveTargetQuery {
  name?: string
  internalName?: string
  description?: string
}

export interface MoveTargetUpsertInput {
  id?: Id
  name?: string
  internalName?: string
  description?: string
}

const endpoint = 'move-target'
const scope = 'moveTarget'

export async function listRows(query: MoveTargetQuery = {}) {
  return request<MoveTargetRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: MoveTargetUpsertInput) {
  return request<MoveTargetRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: MoveTargetUpsertInput) {
  return request<MoveTargetRecord>({
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
