import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface EggGroupRecord {
  id?: string
  name?: string | null
  internalName?: string | null
  text?: string | null
  characteristics?: string | null
}

export interface EggGroupQuery {
  name?: string
  internalName?: string
  text?: string
  characteristics?: string
}

export interface EggGroupUpsertInput {
  id?: string
  name?: string
  internalName?: string
  text?: string
  characteristics?: string
}

const endpoint = 'egg-group'
const scope = 'eggGroup'

export async function listRows(query: EggGroupQuery = {}) {
  return request<EggGroupRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: EggGroupUpsertInput) {
  return request<EggGroupRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: EggGroupUpsertInput) {
  return request<EggGroupRecord>({
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
