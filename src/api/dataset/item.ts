import { buildScopedPageParams } from '@/api/shared'
import request from '@/utils/request'

export async function getItemPage(pageRequest: PageRequest<ItemQuery>) {
  return request<Page<Item>>({
    url: '/item/page',
    method: 'GET',
    params: buildScopedPageParams('item', pageRequest),
  })
}

export async function createItem(payload: ItemFormModel) {
  return request<Item>({
    url: '/item',
    method: 'POST',
    data: payload,
  })
}

export async function updateItem(payload: ItemFormModel) {
  return request<Item>({
    url: '/item',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteItem(id: Id) {
  return request<void>({
    url: `/item/${id}`,
    method: 'DELETE',
  })
}
