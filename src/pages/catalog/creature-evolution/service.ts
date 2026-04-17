import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedPageParams } from '@/utils/request'
interface EntitySummary {
  id?: string
  name?: string | null
  internalName?: string | null
}

export interface CreatureEvolutionRecord {
  id?: string
  evolutionChain?: EntitySummary | null
  branchSortOrder?: number | null
  detailSortOrder?: number | null
  fromCreatureSpecies?: EntitySummary | null
  toCreatureSpecies?: EntitySummary | null
  trigger?: EntitySummary | null
  minLevel?: number | null
  minHappiness?: number | null
  minAffection?: number | null
  minBeauty?: number | null
  minDamageTaken?: number | null
  minMoveCount?: number | null
  minSteps?: number | null
  relativePhysicalStats?: number | null
  item?: EntitySummary | null
  heldItem?: EntitySummary | null
  gender?: EntitySummary | null
  baseVariant?: EntitySummary | null
  region?: EntitySummary | null
  knownMove?: EntitySummary | null
  knownMoveType?: EntitySummary | null
  location?: EntitySummary | null
  partyCreatureSpecies?: EntitySummary | null
  partyType?: EntitySummary | null
  tradeCreatureSpecies?: EntitySummary | null
  usedMove?: EntitySummary | null
  needsMultiplayer?: boolean | null
  needsOverworldRain?: boolean | null
  turnUpsideDown?: boolean | null
  timeOfDay?: string | null
  internalName?: string | null
}

export interface CreatureEvolutionQuery {
  evolutionChainId?: string | null
  fromCreatureSpeciesId?: string | null
  toCreatureSpeciesId?: string | null
  triggerId?: string | null
  itemId?: string | null
  locationId?: string | null
}

export interface CreatureEvolutionUpsertInput {
  id?: string
  branchSortOrder?: number | null
  detailSortOrder?: number | null
  needsMultiplayer?: boolean | null
  needsOverworldRain?: boolean | null
  turnUpsideDown?: boolean | null
  timeOfDay?: string | null
  minAffection?: number | null
  minBeauty?: number | null
  minDamageTaken?: number | null
  minHappiness?: number | null
  minLevel?: number | null
  minMoveCount?: number | null
  minSteps?: number | null
  relativePhysicalStats?: number | null
  genderId?: string | null
  baseVariantId?: string | null
  regionId?: string | null
  evolutionChainId?: string | null
  fromCreatureSpeciesId?: string | null
  toCreatureSpeciesId?: string | null
  heldItemId?: string | null
  itemId?: string | null
  knownMoveId?: string | null
  knownMoveTypeId?: string | null
  locationId?: string | null
  partyCreatureSpeciesId?: string | null
  partyTypeId?: string | null
  tradeCreatureSpeciesId?: string | null
  triggerId?: string | null
  usedMoveId?: string | null
}

const endpoint = 'creature-evolutions'
const scope = 'creatureEvolution'

export async function getPage(
  pageRequest: PageRequest<CreatureEvolutionQuery>,
) {
  return request<Page<CreatureEvolutionRecord>>({
    url: `/${endpoint}/page`,
    method: 'GET',
    params: buildScopedPageParams(scope, pageRequest),
  })
}

export async function createRow(payload: CreatureEvolutionUpsertInput) {
  return request<CreatureEvolutionRecord>({
    url: `/${endpoint}`,
    method: 'POST',
    data: payload,
  })
}

export async function updateRow(payload: CreatureEvolutionUpsertInput) {
  return request<CreatureEvolutionRecord>({
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
