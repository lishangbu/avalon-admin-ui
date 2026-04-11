import type { Id } from '@/types/common'
import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedPageParams } from '@/utils/request'
interface EntitySummary {
  id?: Id
  name?: string | null
  internalName?: string | null
}

export interface CreatureSpeciesRecord {
  id?: Id
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
  evolvesFromSpeciesId?: Id | null
  evolutionChain?: EntitySummary | null
  evolutionChainId?: Id | null
  legendary?: boolean | null
  mythical?: boolean | null
}

export interface CreatureSpeciesQuery {
  name?: string
  internalName?: string
  growthRateId?: Id | null
  creatureColorId?: Id | null
  creatureHabitatId?: Id | null
  creatureShapeId?: Id | null
  evolutionChainId?: Id | null
  evolvesFromSpeciesId?: Id | null
}

export interface CreatureSpeciesUpsertInput {
  id?: Id
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
  evolvesFromSpeciesId?: Id | null
  evolutionChainId?: Id | null
  growthRateId?: Id | null
  creatureColorId?: Id | null
  creatureHabitatId?: Id | null
  creatureShapeId?: Id | null
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

export async function deleteRow(id: Id) {
  return request<void>({
    url: `/${endpoint}/${id}`,
    method: 'DELETE',
  })
}
