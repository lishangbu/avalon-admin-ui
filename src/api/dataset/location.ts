import {
  buildScopedListParams,
  buildScopedPageParams,
  createApiObjectSchema,
  idFieldSchema,
  requestParsedEntity,
  requestParsedList,
  requestParsedPage,
} from '@/api/shared'
import request from '@/utils/request'

const regionEntitySchema = createApiObjectSchema<Region>({
  id: idFieldSchema,
})

const locationEntitySchema = createApiObjectSchema<Location>({
  id: idFieldSchema,
  region: regionEntitySchema.nullable().optional(),
})

export async function getLocationPage(pageRequest: PageRequest<LocationQuery>) {
  return requestParsedPage(locationEntitySchema, {
    url: '/location/page',
    method: 'GET',
    params: buildScopedPageParams('location', {
      ...pageRequest,
      query: {
        id: pageRequest.query.id,
        internalName: pageRequest.query.internalName,
        name: pageRequest.query.name,
        regionId: pageRequest.query.regionId,
      },
    }),
  })
}

export async function listLocations(query: LocationQuery = {}) {
  return requestParsedList(locationEntitySchema, {
    url: '/location/list',
    method: 'GET',
    params: buildScopedListParams('location', {
      id: query.id,
      internalName: query.internalName,
      name: query.name,
      regionId: query.regionId,
    }),
  })
}

export async function createLocation(payload: LocationFormModel) {
  return requestParsedEntity(locationEntitySchema, {
    url: '/location',
    method: 'POST',
    data: payload,
  })
}

export async function updateLocation(payload: LocationFormModel) {
  return requestParsedEntity(locationEntitySchema, {
    url: '/location',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteLocation(id: Id) {
  return request<void>({
    url: `/location/${id}`,
    method: 'DELETE',
  })
}
