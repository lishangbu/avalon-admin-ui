import {
  buildScopedPageParams,
  createApiObjectSchema,
  idFieldSchema,
  nullableBooleanFieldSchema,
  nullableNumberFieldSchema,
  requestParsedEntity,
  requestParsedPage,
} from '@/api/shared'
import request from '@/utils/request'

const evolutionChainEntitySchema = createApiObjectSchema<EvolutionChain>({
  id: idFieldSchema,
})

const creatureSpeciesEntitySchema = createApiObjectSchema<CreatureSpecies>({
  id: idFieldSchema,
})

const genderEntitySchema = createApiObjectSchema<Gender>({
  id: idFieldSchema,
})

const itemEntitySchema = createApiObjectSchema<Item>({
  id: idFieldSchema,
})

const moveEntitySchema = createApiObjectSchema<Move>({
  id: idFieldSchema,
})

const typeEntitySchema = createApiObjectSchema<Type>({
  id: idFieldSchema,
})

const locationEntitySchema = createApiObjectSchema<Location>({
  id: idFieldSchema,
})

const regionEntitySchema = createApiObjectSchema<Region>({
  id: idFieldSchema,
})

const creatureVariantEntitySchema = createApiObjectSchema<CreatureVariant>({
  id: idFieldSchema,
})

const evolutionTriggerEntitySchema = createApiObjectSchema<EvolutionTrigger>({
  id: idFieldSchema,
})

const creatureEvolutionEntitySchema = createApiObjectSchema<CreatureEvolution>({
  id: idFieldSchema,
  branchSortOrder: nullableNumberFieldSchema,
  detailSortOrder: nullableNumberFieldSchema,
  needsMultiplayer: nullableBooleanFieldSchema,
  needsOverworldRain: nullableBooleanFieldSchema,
  turnUpsideDown: nullableBooleanFieldSchema,
  minAffection: nullableNumberFieldSchema,
  minBeauty: nullableNumberFieldSchema,
  minDamageTaken: nullableNumberFieldSchema,
  minHappiness: nullableNumberFieldSchema,
  minLevel: nullableNumberFieldSchema,
  minMoveCount: nullableNumberFieldSchema,
  minSteps: nullableNumberFieldSchema,
  relativePhysicalStats: nullableNumberFieldSchema,
  evolutionChain: evolutionChainEntitySchema.nullable().optional(),
  fromCreatureSpecies: creatureSpeciesEntitySchema.nullable().optional(),
  toCreatureSpecies: creatureSpeciesEntitySchema.nullable().optional(),
  gender: genderEntitySchema.nullable().optional(),
  heldItem: itemEntitySchema.nullable().optional(),
  item: itemEntitySchema.nullable().optional(),
  knownMove: moveEntitySchema.nullable().optional(),
  knownMoveType: typeEntitySchema.nullable().optional(),
  location: locationEntitySchema.nullable().optional(),
  partyCreatureSpecies: creatureSpeciesEntitySchema.nullable().optional(),
  partyType: typeEntitySchema.nullable().optional(),
  tradeCreatureSpecies: creatureSpeciesEntitySchema.nullable().optional(),
  trigger: evolutionTriggerEntitySchema.nullable().optional(),
  usedMove: moveEntitySchema.nullable().optional(),
  region: regionEntitySchema.nullable().optional(),
  baseVariant: creatureVariantEntitySchema.nullable().optional(),
})

export async function getCreatureEvolutionPage(pageRequest: PageRequest<CreatureEvolutionQuery>) {
  return requestParsedPage(creatureEvolutionEntitySchema, {
    url: '/creature-evolutions/page',
    method: 'GET',
    params: buildScopedPageParams('creatureEvolution', {
      ...pageRequest,
      query: {
        id: pageRequest.query.id,
        branchSortOrder: pageRequest.query.branchSortOrder,
        detailSortOrder: pageRequest.query.detailSortOrder,
        timeOfDay: pageRequest.query.timeOfDay,
        minLevel: pageRequest.query.minLevel,
        evolutionChainId: pageRequest.query.evolutionChainId,
        fromCreatureSpeciesId: pageRequest.query.fromCreatureSpeciesId,
        toCreatureSpeciesId: pageRequest.query.toCreatureSpeciesId,
        triggerId: pageRequest.query.triggerId,
        itemId: pageRequest.query.itemId,
        heldItemId: pageRequest.query.heldItemId,
        locationId: pageRequest.query.locationId,
        genderId: pageRequest.query.genderId,
        baseVariantId: pageRequest.query.baseVariantId,
        regionId: pageRequest.query.regionId,
      },
    }),
  })
}

export async function createCreatureEvolution(payload: CreatureEvolutionFormModel) {
  return requestParsedEntity(creatureEvolutionEntitySchema, {
    url: '/creature-evolutions',
    method: 'POST',
    data: payload,
  })
}

export async function updateCreatureEvolution(payload: CreatureEvolutionFormModel) {
  return requestParsedEntity(creatureEvolutionEntitySchema, {
    url: '/creature-evolutions',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteCreatureEvolution(id: Id) {
  return request<void>({
    url: `/creature-evolutions/${id}`,
    method: 'DELETE',
  })
}
