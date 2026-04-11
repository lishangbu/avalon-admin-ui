import type { Id } from '@/types/common'
import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedPageParams } from '@/utils/request'
interface EntitySummary {
  id?: Id
  name?: string | null
  internalName?: string | null
}

export interface CreatureEvolutionRecord {
  id?: Id
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
  evolutionChainId?: Id | null
  fromCreatureSpeciesId?: Id | null
  toCreatureSpeciesId?: Id | null
  triggerId?: Id | null
  itemId?: Id | null
  locationId?: Id | null
}

export interface CreatureEvolutionUpsertInput {
  id?: Id
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
  genderId?: Id | null
  baseVariantId?: Id | null
  regionId?: Id | null
  evolutionChainId?: Id | null
  fromCreatureSpeciesId?: Id | null
  toCreatureSpeciesId?: Id | null
  heldItemId?: Id | null
  itemId?: Id | null
  knownMoveId?: Id | null
  knownMoveTypeId?: Id | null
  locationId?: Id | null
  partyCreatureSpeciesId?: Id | null
  partyTypeId?: Id | null
  tradeCreatureSpeciesId?: Id | null
  triggerId?: Id | null
  usedMoveId?: Id | null
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

export async function deleteRow(id: Id) {
  return request<void>({
    url: `/${endpoint}/${id}`,
    method: 'DELETE',
  })
}
