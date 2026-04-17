import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedPageParams } from '@/utils/request'
interface EntitySummary {
  id?: string
  name?: string | null
  internalName?: string | null
}

export interface BerryRecord {
  id?: string
  name?: string | null
  internalName?: string | null
  berryFirmness?: EntitySummary | null
  naturalGiftType?: EntitySummary | null
  naturalGiftPower?: number | null
  growthTime?: number | null
  maxHarvest?: number | null
  bulk?: number | null
  smoothness?: number | null
  soilDryness?: number | null
}

export interface BerryQuery {
  name?: string
  internalName?: string
  berryFirmnessId?: string | null
  naturalGiftTypeId?: string | null
}

export interface BerryUpsertInput {
  id?: string
  name?: string
  internalName?: string
  berryFirmnessId?: string | null
  naturalGiftTypeId?: string | null
  naturalGiftPower?: number | null
  growthTime?: number | null
  maxHarvest?: number | null
  bulk?: number | null
  smoothness?: number | null
  soilDryness?: number | null
}

const endpoint = 'berry'
const scope = 'berry'

export async function getPage(pageRequest: PageRequest<BerryQuery>) {
  return request<Page<BerryRecord>>({
    url: `/${endpoint}/page`,
    method: 'GET',
    params: buildScopedPageParams(scope, pageRequest),
  })
}

export async function createRow(payload: BerryUpsertInput) {
  return request<BerryRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: BerryUpsertInput) {
  return request<BerryRecord>({
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
