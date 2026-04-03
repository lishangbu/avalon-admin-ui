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

const creatureEntitySchema = createApiObjectSchema<Creature>({
  id: idFieldSchema,
})

const creatureVariantEntitySchema = createApiObjectSchema<CreatureVariant>({
  id: idFieldSchema,
  battleOnly: nullableBooleanFieldSchema,
  defaultForm: nullableBooleanFieldSchema,
  formOrder: nullableNumberFieldSchema,
  mega: nullableBooleanFieldSchema,
  sortingOrder: nullableNumberFieldSchema,
  creature: creatureEntitySchema.nullable().optional(),
})

export async function getCreatureVariantPage(pageRequest: PageRequest<CreatureVariantQuery>) {
  return requestParsedPage(creatureVariantEntitySchema, {
    url: '/creature-variants/page',
    method: 'GET',
    params: buildScopedPageParams('creatureVariant', {
      ...pageRequest,
      query: {
        id: pageRequest.query.id,
        internalName: pageRequest.query.internalName,
        name: pageRequest.query.name,
        formName: pageRequest.query.formName,
        battleOnly: pageRequest.query.battleOnly,
        defaultForm: pageRequest.query.defaultForm,
        mega: pageRequest.query.mega,
        formOrder: pageRequest.query.formOrder,
        sortingOrder: pageRequest.query.sortingOrder,
        creatureId: pageRequest.query.creatureId,
      },
    }),
  })
}

export async function createCreatureVariant(payload: CreatureVariantFormModel) {
  return requestParsedEntity(creatureVariantEntitySchema, {
    url: '/creature-variants',
    method: 'POST',
    data: payload,
  })
}

export async function updateCreatureVariant(payload: CreatureVariantFormModel) {
  return requestParsedEntity(creatureVariantEntitySchema, {
    url: '/creature-variants',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteCreatureVariant(id: Id) {
  return request<void>({
    url: `/creature-variants/${id}`,
    method: 'DELETE',
  })
}
