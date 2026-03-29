import { z } from 'zod'

import {
  buildScopedPageParams,
  createApiObjectSchema,
  idFieldSchema,
  nullableNumberFieldSchema,
  requestParsedEntity,
  requestParsedPage,
} from '@/api/shared'
import request from '@/utils/request'

const itemFlingEffectEntitySchema = createApiObjectSchema<ItemFlingEffect>({
  id: idFieldSchema,
})

const itemAttributeEntitySchema = createApiObjectSchema<ItemAttribute>({
  id: idFieldSchema,
})

const itemEntitySchema = createApiObjectSchema<Item>({
  id: idFieldSchema,
  cost: nullableNumberFieldSchema,
  flingPower: nullableNumberFieldSchema,
  itemFlingEffect: itemFlingEffectEntitySchema.nullable().optional(),
  itemAttributes: z.array(itemAttributeEntitySchema).catch([]),
})

export async function getItemPage(pageRequest: PageRequest<ItemQuery>) {
  return requestParsedPage(itemEntitySchema, {
    url: '/item/page',
    method: 'GET',
    params: buildScopedPageParams('item', {
      ...pageRequest,
      query: {
        id: pageRequest.query.id,
        internalName: pageRequest.query.internalName,
        name: pageRequest.query.name,
        itemFlingEffectId: pageRequest.query.itemFlingEffectId,
      },
    }),
  })
}

export async function createItem(payload: ItemFormModel) {
  return requestParsedEntity(itemEntitySchema, {
    url: '/item',
    method: 'POST',
    data: payload,
  })
}

export async function updateItem(payload: ItemFormModel) {
  return requestParsedEntity(itemEntitySchema, {
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
