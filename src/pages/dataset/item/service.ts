import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedPageParams } from '@/utils/request'
interface EntitySummary {
  id?: string
  name?: string | null
  internalName?: string | null
}

export interface ItemRecord {
  id?: string
  name?: string | null
  internalName?: string | null
  cost?: number | null
  flingPower?: number | null
  itemFlingEffect?: EntitySummary | null
  itemAttributes?: EntitySummary[] | null
  shortEffect?: string | null
  effect?: string | null
  text?: string | null
}

export interface ItemQuery {
  name?: string
  internalName?: string
  itemFlingEffectId?: string | null
}

export interface ItemUpsertInput {
  id?: string
  name?: string
  internalName?: string
  cost?: number | null
  flingPower?: number | null
  itemFlingEffectId?: string | null
  itemAttributeIds?: string[]
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

export async function deleteRow(id: string) {
  return request<void>({
    url: `/${endpoint}/${id}`,
    method: 'DELETE',
  })
}
