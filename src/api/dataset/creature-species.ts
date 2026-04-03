import {
  buildScopedPageParams,
  createApiObjectSchema,
  idFieldSchema,
  nullableBooleanFieldSchema,
  nullableIdFieldSchema,
  nullableNumberFieldSchema,
  requestParsedEntity,
  requestParsedPage,
} from '@/api/shared'
import request from '@/utils/request'

const growthRateEntitySchema = createApiObjectSchema<GrowthRate>({
  id: idFieldSchema,
})

const creatureColorEntitySchema = createApiObjectSchema<CreatureColor>({
  id: idFieldSchema,
})

const creatureHabitatEntitySchema = createApiObjectSchema<CreatureHabitat>({
  id: idFieldSchema,
})

const creatureShapeEntitySchema = createApiObjectSchema<CreatureShape>({
  id: idFieldSchema,
})

const creatureSpeciesEntitySchema = createApiObjectSchema<CreatureSpecies>({
  id: idFieldSchema,
  sortingOrder: nullableNumberFieldSchema,
  genderRate: nullableNumberFieldSchema,
  captureRate: nullableNumberFieldSchema,
  baseHappiness: nullableNumberFieldSchema,
  baby: nullableBooleanFieldSchema,
  legendary: nullableBooleanFieldSchema,
  mythical: nullableBooleanFieldSchema,
  hatchCounter: nullableNumberFieldSchema,
  hasGenderDifferences: nullableBooleanFieldSchema,
  formsSwitchable: nullableBooleanFieldSchema,
  evolvesFromSpeciesId: nullableIdFieldSchema,
  evolutionChainId: nullableIdFieldSchema,
  growthRate: growthRateEntitySchema.nullable().optional(),
  creatureColor: creatureColorEntitySchema.nullable().optional(),
  creatureHabitat: creatureHabitatEntitySchema.nullable().optional(),
  creatureShape: creatureShapeEntitySchema.nullable().optional(),
})

export async function getCreatureSpeciesPage(pageRequest: PageRequest<CreatureSpeciesQuery>) {
  return requestParsedPage(creatureSpeciesEntitySchema, {
    url: '/creature-species/page',
    method: 'GET',
    params: buildScopedPageParams('creatureSpecies', {
      ...pageRequest,
      query: {
        id: pageRequest.query.id,
        internalName: pageRequest.query.internalName,
        name: pageRequest.query.name,
        sortingOrder: pageRequest.query.sortingOrder,
        genderRate: pageRequest.query.genderRate,
        captureRate: pageRequest.query.captureRate,
        baseHappiness: pageRequest.query.baseHappiness,
        baby: pageRequest.query.baby,
        legendary: pageRequest.query.legendary,
        mythical: pageRequest.query.mythical,
        hatchCounter: pageRequest.query.hatchCounter,
        hasGenderDifferences: pageRequest.query.hasGenderDifferences,
        formsSwitchable: pageRequest.query.formsSwitchable,
        evolvesFromSpeciesId: pageRequest.query.evolvesFromSpeciesId,
        evolutionChainId: pageRequest.query.evolutionChainId,
        growthRateId: pageRequest.query.growthRateId,
        creatureColorId: pageRequest.query.creatureColorId,
        creatureHabitatId: pageRequest.query.creatureHabitatId,
        creatureShapeId: pageRequest.query.creatureShapeId,
      },
    }),
  })
}

export async function createCreatureSpecies(payload: CreatureSpeciesFormModel) {
  return requestParsedEntity(creatureSpeciesEntitySchema, {
    url: '/creature-species',
    method: 'POST',
    data: payload,
  })
}

export async function updateCreatureSpecies(payload: CreatureSpeciesFormModel) {
  return requestParsedEntity(creatureSpeciesEntitySchema, {
    url: '/creature-species',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteCreatureSpecies(id: Id) {
  return request<void>({
    url: `/creature-species/${id}`,
    method: 'DELETE',
  })
}
