import { buildScopedPageParams } from '@/api/shared'
import request from '@/utils/request'

export async function getMovePage(pageRequest: PageRequest<MoveQuery>) {
  return request<Page<Move>>({
    url: '/move/page',
    method: 'GET',
    params: buildScopedPageParams('move', pageRequest),
  })
}

export async function createMove(payload: MoveFormModel) {
  return request<Move>({
    url: '/move',
    method: 'POST',
    data: payload,
  })
}

export async function updateMove(payload: MoveFormModel) {
  return request<Move>({
    url: '/move',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteMove(id: Id) {
  return request<void>({
    url: `/move/${id}`,
    method: 'DELETE',
  })
}
