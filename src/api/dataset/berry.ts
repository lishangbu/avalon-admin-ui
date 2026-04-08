import { buildScopedPageParams } from '@/api/shared'
import request from '@/utils/request'

export async function getBerryPage(pageRequest: PageRequest<BerryQuery>) {
  return request<Page<Berry>>({
    url: '/berry/page',
    method: 'GET',
    params: buildScopedPageParams('berry', pageRequest),
  })
}

export async function createBerry(payload: Berry) {
  return request<Berry>({
    url: '/berry',
    method: 'POST',
    data: payload,
  })
}

export async function updateBerry(payload: Berry) {
  return request<Berry>({
    url: '/berry',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteBerry(id: Id) {
  return request<void>({
    url: `/berry/${id}`,
    method: 'DELETE',
  })
}
