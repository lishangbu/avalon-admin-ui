import type { Id } from '@/types/common'
import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedPageParams } from '@/utils/request'
interface EntitySummary {
  id?: Id
  name?: string | null
  internalName?: string | null
}

export interface CreatureFormRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
  formName?: string | null
  formOrder?: number | null
  defaultForm?: boolean | null
  battleOnly?: boolean | null
  mega?: boolean | null
  creature?: EntitySummary | null
  sortingOrder?: number | null
  frontDefault?: string | null
  frontFemale?: string | null
  frontShiny?: string | null
  frontShinyFemale?: string | null
  backDefault?: string | null
  backFemale?: string | null
  backShiny?: string | null
  backShinyFemale?: string | null
}

export interface CreatureFormQuery {
  name?: string
  internalName?: string
  formName?: string
  creatureId?: Id | null
}

export interface CreatureFormUpsertInput {
  id?: Id
  backDefault?: string | null
  backFemale?: string | null
  backShiny?: string | null
  backShinyFemale?: string | null
  battleOnly?: boolean | null
  defaultForm?: boolean | null
  formName?: string | null
  formOrder?: number | null
  frontDefault?: string | null
  frontFemale?: string | null
  frontShiny?: string | null
  frontShinyFemale?: string | null
  internalName?: string
  mega?: boolean | null
  name?: string
  creatureId?: Id | null
  sortingOrder?: number | null
}

const endpoint = 'creature-variants'
const scope = 'creatureVariant'

export async function getPage(pageRequest: PageRequest<CreatureFormQuery>) {
  return request<Page<CreatureFormRecord>>({
    url: `/${endpoint}/page`,
    method: 'GET',
    params: buildScopedPageParams(scope, pageRequest),
  })
}

export async function createRow(payload: CreatureFormUpsertInput) {
  return request<CreatureFormRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: CreatureFormUpsertInput) {
  return request<CreatureFormRecord>({
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
