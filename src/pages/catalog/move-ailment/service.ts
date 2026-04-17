import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface MoveAilmentRecord {
  id?: string
  name?: string | null
  internalName?: string | null
}

export interface MoveAilmentQuery {
  name?: string
  internalName?: string
}

export interface MoveAilmentUpsertInput {
  id?: string
  name?: string
  internalName?: string
}

const endpoint = 'move-ailment'
const scope = 'moveAilment'

export async function listRows(query: MoveAilmentQuery = {}) {
  return request<MoveAilmentRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: MoveAilmentUpsertInput) {
  return request<MoveAilmentRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: MoveAilmentUpsertInput) {
  return request<MoveAilmentRecord>({
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
