import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listRegions(query: RegionQuery = {}) {
  return request<Region[]>({
    url: '/region/list',
    method: 'GET',
    params: withScopedQuery('region', query),
  })
}

export async function createRegion(payload: RegionFormModel) {
  return request<Region>({
    url: '/region',
    method: 'POST',
    data: payload,
  })
}

export async function updateRegion(payload: RegionFormModel) {
  return request<Region>({
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
