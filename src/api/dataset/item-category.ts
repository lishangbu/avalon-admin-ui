import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listItemCategories(query: ItemCategoryQuery = {}) {
  return request<ItemCategory[]>({
    url: '/item-category/list',
    method: 'GET',
    params: withScopedQuery('itemCategory', query),
  })
}

export async function createItemCategory(payload: ItemCategoryFormModel) {
  return request<ItemCategory>({
    url: '/item-category',
    method: 'POST',
    data: payload,
  })
}

export async function updateItemCategory(payload: ItemCategoryFormModel) {
  return request<ItemCategory>({
    url: '/item-category',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteItemCategory(id: Id) {
  return request<void>({
    url: `/item-category/${id}`,
    method: 'DELETE',
  })
}
