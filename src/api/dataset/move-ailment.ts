import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listMoveAilments(query: MoveAilmentQuery = {}) {
  return request<MoveAilment[]>({
    url: '/move-ailment/list',
    method: 'GET',
    params: withScopedQuery('moveAilment', query),
  })
}

export async function createMoveAilment(payload: MoveAilmentFormModel) {
  return request<MoveAilment>({
    url: '/move-ailment',
    method: 'POST',
    data: payload,
  })
}

export async function updateMoveAilment(payload: MoveAilmentFormModel) {
  return request<MoveAilment>({
    url: '/move-ailment',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteMoveAilment(id: Id) {
  return request<void>({
    url: `/move-ailment/${id}`,
    method: 'DELETE',
  })
}
