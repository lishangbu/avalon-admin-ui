import type { Id } from '@/types/common'
import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedListParams, buildScopedPageParams } from '@/utils/request'
interface EntitySummary {
  id?: Id
  name?: string | null
  internalName?: string | null
}

export interface CreatureRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
  height?: number | null
  weight?: number | null
  baseExperience?: number | null
  sortingOrder?: number | null
  creatureSpecies?: EntitySummary | null
}

export interface CreatureQuery {
  name?: string
  internalName?: string
  creatureSpeciesId?: Id | null
}

export interface CreatureUpsertInput {
  id?: Id
  name?: string
  internalName?: string
  height?: number | null
  weight?: number | null
  baseExperience?: number | null
  sortingOrder?: number | null
  creatureSpeciesId?: Id | null
}

const endpoint = 'creatures'
const scope = 'creature'

export async function getPage(pageRequest: PageRequest<CreatureQuery>) {
  return request<Page<CreatureRecord>>({
    url: `/${endpoint}/page`,
    method: 'GET',
    params: buildScopedPageParams(scope, pageRequest),
  })
}

export async function listRows(query: CreatureQuery = {}) {
  return request<CreatureRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: CreatureUpsertInput) {
  return request<CreatureRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: CreatureUpsertInput) {
  return request<CreatureRecord>({
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
