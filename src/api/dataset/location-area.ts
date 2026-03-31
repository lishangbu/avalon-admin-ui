import {
  buildScopedPageParams,
  createApiObjectSchema,
  idFieldSchema,
  nullableNumberFieldSchema,
  requestParsedEntity,
  requestParsedPage,
} from '@/api/shared'
import request from '@/utils/request'

const locationEntitySchema = createApiObjectSchema<Location>({
  id: idFieldSchema,
})

const locationAreaEntitySchema = createApiObjectSchema<LocationArea>({
  id: idFieldSchema,
  gameIndex: nullableNumberFieldSchema,
  location: locationEntitySchema.nullable().optional(),
})

export async function getLocationAreaPage(pageRequest: PageRequest<LocationAreaQuery>) {
  return requestParsedPage(locationAreaEntitySchema, {
    url: '/location-area/page',
    method: 'GET',
    params: buildScopedPageParams('locationArea', {
      ...pageRequest,
      query: {
        id: pageRequest.query.id,
        internalName: pageRequest.query.internalName,
        name: pageRequest.query.name,
        gameIndex: pageRequest.query.gameIndex,
        locationId: pageRequest.query.locationId,
      },
    }),
  })
}

export async function createLocationArea(payload: LocationAreaFormModel) {
  return requestParsedEntity(locationAreaEntitySchema, {
    url: '/location-area',
    method: 'POST',
    data: payload,
  })
}

export async function updateLocationArea(payload: LocationAreaFormModel) {
  return requestParsedEntity(locationAreaEntitySchema, {
    url: '/location-area',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteLocationArea(id: Id) {
  return request<void>({
    url: `/location-area/${id}`,
    method: 'DELETE',
  })
}
