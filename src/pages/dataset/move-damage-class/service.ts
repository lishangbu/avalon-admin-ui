import type { Id, Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams, buildScopedPageParams } from '@/utils/request'
export interface MoveDamageClassRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
  description?: string | null
}

export interface MoveDamageClassQuery {
  name?: string
  internalName?: string
  description?: string
}

export interface MoveDamageClassUpsertInput {
  id?: Id
  name?: string
  internalName?: string
  description?: string
}

const endpoint = 'move-damage-class'
const scope = 'moveDamageClass'

export async function getPage(pageRequest: PageRequest<MoveDamageClassQuery>) {
  return request<Page<MoveDamageClassRecord>>({
    url: `/${endpoint}/page`,
    method: 'GET',
    params: buildScopedPageParams(scope, pageRequest),
  })
}

export async function listRows(query: MoveDamageClassQuery = {}) {
  return request<MoveDamageClassRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: MoveDamageClassUpsertInput) {
  return request<MoveDamageClassRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: MoveDamageClassUpsertInput) {
  return request<MoveDamageClassRecord>({
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
