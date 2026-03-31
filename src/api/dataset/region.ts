import {
  buildScopedListParams,
  createApiObjectSchema,
  idFieldSchema,
  requestParsedEntity,
  requestParsedList,
} from '@/api/shared'
import request from '@/utils/request'

const regionEntitySchema = createApiObjectSchema<Region>({
  id: idFieldSchema,
})

export async function listRegions(query: RegionQuery = {}) {
  return requestParsedList(regionEntitySchema, {
    url: '/region/list',
    method: 'GET',
    params: buildScopedListParams('region', {
      id: query.id,
      internalName: query.internalName,
      name: query.name,
    }),
  })
}

export async function createRegion(payload: RegionFormModel) {
  return requestParsedEntity(regionEntitySchema, {
    url: '/region',
    method: 'POST',
    data: payload,
  })
}

export async function updateRegion(payload: RegionFormModel) {
  return requestParsedEntity(regionEntitySchema, {
    url: '/region',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteRegion(id: Id) {
  return request<void>({
    url: `/region/${id}`,
    method: 'DELETE',
  })
}
