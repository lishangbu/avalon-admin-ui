import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listBerryFirmnesses(query: BerryFirmnessQuery = {}) {
  return request<BerryFirmness[]>({
    url: '/berry-firmness/list',
    method: 'GET',
    params: withScopedQuery('berryFirmness', query),
  })
}

export async function createBerryFirmness(payload: BerryFirmness) {
  return request<BerryFirmness>({
    url: '/berry-firmness',
    method: 'POST',
    data: payload,
  })
}

export async function updateBerryFirmness(payload: BerryFirmness) {
  return request<BerryFirmness>({
    url: '/berry-firmness',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteBerryFirmness(id: Id) {
  return request<void>({
    url: `/berry-firmness/${id}`,
    method: 'DELETE',
  })
}
