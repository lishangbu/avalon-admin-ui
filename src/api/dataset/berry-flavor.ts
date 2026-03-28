import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listBerryFlavors(query: BerryFlavorQuery = {}) {
  return request<BerryFlavor[]>({
    url: '/berry-flavor/list',
    method: 'GET',
    params: withScopedQuery('berryFlavor', query),
  })
}

export async function createBerryFlavor(payload: BerryFlavor) {
  return request<BerryFlavor>({
    url: '/berry-flavor',
    method: 'POST',
    data: payload,
  })
}

export async function updateBerryFlavor(payload: BerryFlavor) {
  return request<BerryFlavor>({
    url: '/berry-flavor',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteBerryFlavor(id: Id) {
  return request<void>({
    url: `/berry-flavor/${id}`,
    method: 'DELETE',
  })
}
