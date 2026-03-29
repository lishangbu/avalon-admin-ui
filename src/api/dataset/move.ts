import {
  buildScopedPageParams,
  createApiObjectSchema,
  idFieldSchema,
  nullableNumberFieldSchema,
  requestParsedEntity,
  requestParsedPage,
} from '@/api/shared'
import request from '@/utils/request'

const typeEntitySchema = createApiObjectSchema<Type>({
  id: idFieldSchema,
})

const moveDamageClassEntitySchema = createApiObjectSchema<MoveDamageClass>({
  id: idFieldSchema,
})

const moveTargetEntitySchema = createApiObjectSchema<MoveTarget>({
  id: idFieldSchema,
})

const moveCategoryEntitySchema = createApiObjectSchema<MoveCategory>({
  id: idFieldSchema,
})

const moveAilmentEntitySchema = createApiObjectSchema<MoveAilment>({
  id: idFieldSchema,
})

const moveEntitySchema = createApiObjectSchema<Move>({
  id: idFieldSchema,
  accuracy: nullableNumberFieldSchema,
  effectChance: nullableNumberFieldSchema,
  pp: nullableNumberFieldSchema,
  priority: nullableNumberFieldSchema,
  power: nullableNumberFieldSchema,
  minHits: nullableNumberFieldSchema,
  maxHits: nullableNumberFieldSchema,
  minTurns: nullableNumberFieldSchema,
  maxTurns: nullableNumberFieldSchema,
  drain: nullableNumberFieldSchema,
  healing: nullableNumberFieldSchema,
  critRate: nullableNumberFieldSchema,
  ailmentChance: nullableNumberFieldSchema,
  flinchChance: nullableNumberFieldSchema,
  statChance: nullableNumberFieldSchema,
  type: typeEntitySchema.nullable().optional(),
  moveDamageClass: moveDamageClassEntitySchema.nullable().optional(),
  moveTarget: moveTargetEntitySchema.nullable().optional(),
  moveCategory: moveCategoryEntitySchema.nullable().optional(),
  moveAilment: moveAilmentEntitySchema.nullable().optional(),
})

export async function getMovePage(pageRequest: PageRequest<MoveQuery>) {
  return requestParsedPage(moveEntitySchema, {
    url: '/move/page',
    method: 'GET',
    params: buildScopedPageParams('move', {
      ...pageRequest,
      query: {
        id: pageRequest.query.id,
        internalName: pageRequest.query.internalName,
        name: pageRequest.query.name,
        typeId: pageRequest.query.typeId,
        moveDamageClassId: pageRequest.query.moveDamageClassId,
        moveTargetId: pageRequest.query.moveTargetId,
        moveCategoryId: pageRequest.query.moveCategoryId,
        moveAilmentId: pageRequest.query.moveAilmentId,
      },
    }),
  })
}

export async function createMove(payload: MoveFormModel) {
  return requestParsedEntity(moveEntitySchema, {
    url: '/move',
    method: 'POST',
    data: payload,
  })
}

export async function updateMove(payload: MoveFormModel) {
  return requestParsedEntity(moveEntitySchema, {
    url: '/move',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteMove(id: Id) {
  return request<void>({
    url: `/move/${id}`,
    method: 'DELETE',
  })
}
