import {
  booleanFieldSchema,
  buildScopedListParams,
  createApiObjectSchema,
  idFieldSchema,
  nullableNumberFieldSchema,
  requestParsedEntity,
  requestParsedList,
} from '@/api/shared'
import request from '@/utils/request'

const moveDamageClassEntitySchema = createApiObjectSchema<MoveDamageClass>({
  id: idFieldSchema,
})

const statEntitySchema = createApiObjectSchema<Stat>({
  id: idFieldSchema,
  gameIndex: nullableNumberFieldSchema,
  battleOnly: booleanFieldSchema,
  readonly: booleanFieldSchema,
  moveDamageClass: moveDamageClassEntitySchema.nullable().optional(),
})

export async function listStats(query: StatQuery = {}) {
  return requestParsedList(statEntitySchema, {
    url: '/stat/list',
    method: 'GET',
    params: buildScopedListParams('stat', {
      id: query.id,
      internalName: query.internalName,
      name: query.name,
      gameIndex: query.gameIndex,
      battleOnly: query.battleOnly,
      readonly: query.readonly,
      moveDamageClassId: query.moveDamageClassId,
    }),
  })
}

export async function createStat(payload: Stat) {
  return requestParsedEntity(statEntitySchema, {
    url: '/stat',
    method: 'POST',
    data: payload,
  })
}

export async function updateStat(payload: Stat) {
  return requestParsedEntity(statEntitySchema, {
    url: '/stat',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteStat(id: Id) {
  return request<void>({
    url: `/stat/${id}`,
    method: 'DELETE',
  })
}
