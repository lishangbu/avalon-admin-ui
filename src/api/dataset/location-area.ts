import { buildScopedPageParams } from '@/api/shared'
import request from '@/utils/request'

export async function getLocationAreaPage(pageRequest: PageRequest<LocationAreaQuery>) {
  return request<Page<LocationArea>>({
    url: '/location-area/page',
    method: 'GET',
    params: buildScopedPageParams('locationArea', pageRequest),
  })
}

export async function createLocationArea(payload: LocationAreaFormModel) {
  return request<LocationArea>({
    url: '/location-area',
    method: 'POST',
    data: payload,
  })
}

export async function updateLocationArea(payload: LocationAreaFormModel) {
  return request<LocationArea>({
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
