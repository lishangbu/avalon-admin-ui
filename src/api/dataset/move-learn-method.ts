import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listMoveLearnMethods(query: MoveLearnMethodQuery = {}) {
  return request<MoveLearnMethod[]>({
    url: '/move-learn-method/list',
    method: 'GET',
    params: withScopedQuery('moveLearnMethod', query),
  })
}

export async function createMoveLearnMethod(payload: MoveLearnMethodFormModel) {
  return request<MoveLearnMethod>({
    url: '/move-learn-method',
    method: 'POST',
    data: payload,
  })
}

export async function updateMoveLearnMethod(payload: MoveLearnMethodFormModel) {
  return request<MoveLearnMethod>({
    url: '/move-learn-method',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteMoveLearnMethod(id: Id) {
  return request<void>({
    url: `/move-learn-method/${id}`,
    method: 'DELETE',
  })
}
