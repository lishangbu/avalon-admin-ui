import { request } from '@/shared/api/http'
import { buildScopedListParams } from '@/utils/request'
export interface EvolutionTriggerRecord {
  id?: string
  name?: string | null
  internalName?: string | null
}

export interface EvolutionTriggerQuery {
  name?: string
  internalName?: string
}

export interface EvolutionTriggerUpsertInput {
  id?: string
  name?: string
  internalName?: string
}

const endpoint = 'evolution-trigger'
const scope = 'evolutionTrigger'

export async function listRows(query: EvolutionTriggerQuery = {}) {
  return request<EvolutionTriggerRecord[]>({
    url: `/${endpoint}/list`,
    method: 'GET',
    params: buildScopedListParams(scope, query),
  })
}

export async function createRow(payload: EvolutionTriggerUpsertInput) {
  return request<EvolutionTriggerRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: EvolutionTriggerUpsertInput) {
  return request<EvolutionTriggerRecord>({
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
