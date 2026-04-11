import type { Id } from '@/types/common'
import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedPageParams } from '@/utils/request'
interface EntitySummary {
  id?: Id
  name?: string | null
  internalName?: string | null
}

export interface ItemRecord {
  id?: Id
  name?: string | null
  internalName?: string | null
  cost?: number | null
  flingPower?: number | null
  itemFlingEffect?: EntitySummary | null
  itemAttributes?: EntitySummary[] | null
}

export interface ItemQuery {
  name?: string
  internalName?: string
  itemFlingEffectId?: Id | null
}

export interface ItemUpsertInput {
  id?: Id
  name?: string
  internalName?: string
  cost?: number | null
  flingPower?: number | null
  itemFlingEffectId?: Id | null
  itemAttributeIds?: Id[]
  shortEffect?: string
  effect?: string
  text?: string
}

const endpoint = 'item'
const scope = 'item'

export async function getPage(pageRequest: PageRequest<ItemQuery>) {
  return request<Page<ItemRecord>>({
    url: `/${endpoint}/page`,
    method: 'GET',
    params: buildScopedPageParams(scope, pageRequest),
  })
}

export async function createRow(payload: ItemUpsertInput) {
  return request<ItemRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: ItemUpsertInput) {
  return request<ItemRecord>({
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
