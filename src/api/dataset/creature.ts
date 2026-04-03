import {
  buildScopedPageParams,
  createApiObjectSchema,
  idFieldSchema,
  nullableNumberFieldSchema,
  requestParsedEntity,
  requestParsedPage,
} from '@/api/shared'
import request from '@/utils/request'

const creatureSpeciesEntitySchema = createApiObjectSchema<CreatureSpecies>({
  id: idFieldSchema,
  sortingOrder: nullableNumberFieldSchema,
})

const creatureEntitySchema = createApiObjectSchema<Creature>({
  id: idFieldSchema,
  height: nullableNumberFieldSchema,
  weight: nullableNumberFieldSchema,
  baseExperience: nullableNumberFieldSchema,
  sortingOrder: nullableNumberFieldSchema,
  creatureSpecies: creatureSpeciesEntitySchema.nullable().optional(),
})

export async function getCreaturePage(pageRequest: PageRequest<CreatureQuery>) {
  return requestParsedPage(creatureEntitySchema, {
    url: '/creatures/page',
    method: 'GET',
    params: buildScopedPageParams('creature', {
      ...pageRequest,
      query: {
        id: pageRequest.query.id,
        internalName: pageRequest.query.internalName,
        name: pageRequest.query.name,
        height: pageRequest.query.height,
        weight: pageRequest.query.weight,
        baseExperience: pageRequest.query.baseExperience,
        sortingOrder: pageRequest.query.sortingOrder,
        creatureSpeciesId: pageRequest.query.creatureSpeciesId,
      },
    }),
  })
}

export async function createCreature(payload: CreatureCrudFormModel) {
  return requestParsedEntity(creatureEntitySchema, {
    url: '/creatures',
    method: 'POST',
    data: payload,
  })
}

export async function updateCreature(payload: CreatureCrudFormModel) {
  return requestParsedEntity(creatureEntitySchema, {
    url: '/creatures',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteCreature(id: Id) {
  return request<void>({
    url: `/creatures/${id}`,
    method: 'DELETE',
  })
}
