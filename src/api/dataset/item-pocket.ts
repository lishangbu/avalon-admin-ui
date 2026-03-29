import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listItemPockets(query: ItemPocketQuery = {}) {
  return request<ItemPocket[]>({
    url: '/item-pocket/list',
    method: 'GET',
    params: withScopedQuery('itemPocket', query),
  })
}

export async function createItemPocket(payload: ItemPocketFormModel) {
  return request<ItemPocket>({
    url: '/item-pocket',
    method: 'POST',
    data: payload,
  })
}

export async function updateItemPocket(payload: ItemPocketFormModel) {
  return request<ItemPocket>({
    url: '/item-pocket',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteItemPocket(id: Id) {
  return request<void>({
    url: `/item-pocket/${id}`,
    method: 'DELETE',
  })
}
