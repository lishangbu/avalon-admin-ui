import {
  buildScopedListParams,
  createApiObjectSchema,
  idFieldSchema,
  nullableBooleanFieldSchema,
  requestParsedEntity,
  requestParsedList,
} from '@/api/shared'
import request from '@/utils/request'

const typeEntitySchema = createApiObjectSchema<Type>({
  id: idFieldSchema,
  battleOnly: nullableBooleanFieldSchema,
})

export async function listTypes(query: TypeQuery = {}) {
  return requestParsedList(typeEntitySchema, {
    url: '/type/list',
    method: 'GET',
    params: buildScopedListParams('type', {
      id: query.id,
      internalName: query.internalName,
      name: query.name,
      battleOnly: query.battleOnly,
    }),
  })
}

export async function createType(payload: Type) {
  return requestParsedEntity(typeEntitySchema, {
    url: '/type',
    method: 'POST',
    data: payload,
  })
}

export async function updateType(payload: Type) {
  return requestParsedEntity(typeEntitySchema, {
    url: '/type',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteType(id: Id) {
  return request<void>({
    url: `/type/${id}`,
    method: 'DELETE',
  })
}
