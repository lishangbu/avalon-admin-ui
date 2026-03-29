import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listItemFlingEffects(query: ItemFlingEffectQuery = {}) {
  return request<ItemFlingEffect[]>({
    url: '/item-fling-effect/list',
    method: 'GET',
    params: withScopedQuery('itemFlingEffect', query),
  })
}

export async function createItemFlingEffect(payload: ItemFlingEffectFormModel) {
  return request<ItemFlingEffect>({
    url: '/item-fling-effect',
    method: 'POST',
    data: payload,
  })
}

export async function updateItemFlingEffect(payload: ItemFlingEffectFormModel) {
  return request<ItemFlingEffect>({
    url: '/item-fling-effect',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteItemFlingEffect(id: Id) {
  return request<void>({
    url: `/item-fling-effect/${id}`,
    method: 'DELETE',
  })
}
