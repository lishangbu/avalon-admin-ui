import type { Id } from '@/types/common'
import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedPageParams } from '@/utils/request'
interface EntitySummary {
  id?: Id
  name?: string | null
  internalName?: string | null
}

export interface MoveRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
  type?: EntitySummary | null
  power?: number | null
  accuracy?: number | null
  pp?: number | null
  priority?: number | null
  effectChance?: number | null
  moveDamageClass?: EntitySummary | null
  moveTarget?: EntitySummary | null
  moveCategory?: EntitySummary | null
  moveAilment?: EntitySummary | null
  text?: string | null
  shortEffect?: string | null
  effect?: string | null
  minHits?: number | null
  maxHits?: number | null
  minTurns?: number | null
  maxTurns?: number | null
  drain?: number | null
  healing?: number | null
  critRate?: number | null
  ailmentChance?: number | null
  flinchChance?: number | null
  statChance?: number | null
}

export interface MoveQuery {
  name?: string
  internalName?: string
  typeId?: Id | null
  moveDamageClassId?: Id | null
}

export interface MoveUpsertInput {
  id?: Id
  name?: string
  internalName?: string
  typeId?: Id | null
  accuracy?: number | null
  effectChance?: number | null
  pp?: number | null
  priority?: number | null
  power?: number | null
  moveDamageClassId?: Id | null
  moveTargetId?: Id | null
  text?: string
  shortEffect?: string
  effect?: string
  moveCategoryId?: Id | null
  moveAilmentId?: Id | null
  minHits?: number | null
  maxHits?: number | null
  minTurns?: number | null
  maxTurns?: number | null
  drain?: number | null
  healing?: number | null
  critRate?: number | null
  ailmentChance?: number | null
  flinchChance?: number | null
  statChance?: number | null
}

const endpoint = 'move'
const scope = 'move'

export async function getPage(pageRequest: PageRequest<MoveQuery>) {
  return request<Page<MoveRecord>>({
    url: `/${endpoint}/page`,
    method: 'GET',
    params: buildScopedPageParams(scope, pageRequest),
  })
}

export async function createRow(payload: MoveUpsertInput) {
  return request<MoveRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: MoveUpsertInput) {
  return request<MoveRecord>({
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
