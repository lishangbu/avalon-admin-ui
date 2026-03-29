import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listItemAttributes(query: ItemAttributeQuery = {}) {
  return request<ItemAttribute[]>({
    url: '/item-attribute/list',
    method: 'GET',
    params: withScopedQuery('itemAttribute', query),
  })
}

export async function createItemAttribute(payload: ItemAttributeFormModel) {
  return request<ItemAttribute>({
    url: '/item-attribute',
    method: 'POST',
    data: payload,
  })
}

export async function updateItemAttribute(payload: ItemAttributeFormModel) {
  return request<ItemAttribute>({
    url: '/item-attribute',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteItemAttribute(id: Id) {
  return request<void>({
    url: `/item-attribute/${id}`,
    method: 'DELETE',
  })
}
