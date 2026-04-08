import { buildScopedPageParams, withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function getLocationPage(pageRequest: PageRequest<LocationQuery>) {
  return request<Page<Location>>({
    url: '/location/page',
    method: 'GET',
    params: buildScopedPageParams('location', pageRequest),
  })
}

export async function listLocations(query: LocationQuery = {}) {
  return request<Location[]>({
    url: '/location/list',
    method: 'GET',
    params: withScopedQuery('location', query),
  })
}

export async function createLocation(payload: LocationFormModel) {
  return request<Location>({
    url: '/location',
    method: 'POST',
    data: payload,
  })
}

export async function updateLocation(payload: LocationFormModel) {
  return request<Location>({
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
