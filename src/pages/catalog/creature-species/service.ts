import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedPageParams } from '@/utils/request'
interface EntitySummary {
  id?: string
  name?: string | null
  internalName?: string | null
}

export interface CreatureSpeciesRecord {
  id?: string
  name?: string | null
  internalName?: string | null
  sortingOrder?: number | null
  genderRate?: number | null
  captureRate?: number | null
  baseHappiness?: number | null
  baby?: boolean | null
  growthRate?: EntitySummary | null
  creatureColor?: EntitySummary | null
  creatureHabitat?: EntitySummary | null
  creatureShape?: EntitySummary | null
  hatchCounter?: number | null
  hasGenderDifferences?: boolean | null
  formsSwitchable?: boolean | null
  evolvesFromSpecies?: EntitySummary | null
  evolvesFromSpeciesId?: string | null
  evolutionChain?: EntitySummary | null
  evolutionChainId?: string | null
  legendary?: boolean | null
  mythical?: boolean | null
}

export interface CreatureSpeciesQuery {
  name?: string
  internalName?: string
  growthRateId?: string | null
  creatureColorId?: string | null
  creatureHabitatId?: string | null
  creatureShapeId?: string | null
  evolutionChainId?: string | null
  evolvesFromSpeciesId?: string | null
}

export interface CreatureSpeciesUpsertInput {
  id?: string
  name?: string
  internalName?: string
  sortingOrder?: number | null
  genderRate?: number | null
  captureRate?: number | null
  baseHappiness?: number | null
  baby?: boolean | null
  legendary?: boolean | null
  mythical?: boolean | null
  hatchCounter?: number | null
  hasGenderDifferences?: boolean | null
  formsSwitchable?: boolean | null
  evolvesFromSpeciesId?: string | null
  evolutionChainId?: string | null
  growthRateId?: string | null
  creatureColorId?: string | null
  creatureHabitatId?: string | null
  creatureShapeId?: string | null
}

const endpoint = 'creature-species'
const scope = 'creatureSpecies'

export async function getPage(pageRequest: PageRequest<CreatureSpeciesQuery>) {
  return request<Page<CreatureSpeciesRecord>>({
    url: `/${endpoint}/page`,
    method: 'GET',
    params: buildScopedPageParams(scope, pageRequest),
  })
}

export async function createRow(payload: CreatureSpeciesUpsertInput) {
  return request<CreatureSpeciesRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: CreatureSpeciesUpsertInput) {
  return request<CreatureSpeciesRecord>({
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
