import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listMoveTargets(query: MoveTargetQuery = {}) {
  return request<MoveTarget[]>({
    url: '/move-target/list',
    method: 'GET',
    params: withScopedQuery('moveTarget', query),
  })
}

export async function createMoveTarget(payload: MoveTargetFormModel) {
  return request<MoveTarget>({
    url: '/move-target',
    method: 'POST',
    data: payload,
  })
}

export async function updateMoveTarget(payload: MoveTargetFormModel) {
  return request<MoveTarget>({
    url: '/move-target',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteMoveTarget(id: Id) {
  return request<void>({
    url: `/move-target/${id}`,
    method: 'DELETE',
  })
}
