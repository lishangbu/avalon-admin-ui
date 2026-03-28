import {
  buildScopedPageParams,
  createApiObjectSchema,
  idFieldSchema,
  nullableNumberFieldSchema,
  requestParsedEntity,
  requestParsedPage,
} from '@/api/shared'
import request from '@/utils/request'

const typeEntitySchema = createApiObjectSchema<Type>({
  id: idFieldSchema,
})

const berryFirmnessEntitySchema = createApiObjectSchema<BerryFirmness>({
  id: idFieldSchema,
})

const berryEntitySchema = createApiObjectSchema<Berry>({
  id: idFieldSchema,
  growthTime: nullableNumberFieldSchema,
  maxHarvest: nullableNumberFieldSchema,
  bulk: nullableNumberFieldSchema,
  smoothness: nullableNumberFieldSchema,
  soilDryness: nullableNumberFieldSchema,
  naturalGiftPower: nullableNumberFieldSchema,
  berryFirmness: berryFirmnessEntitySchema.nullable().optional(),
  naturalGiftType: typeEntitySchema.nullable().optional(),
})

export async function getBerryPage(pageRequest: PageRequest<BerryQuery>) {
  return requestParsedPage(berryEntitySchema, {
    url: '/berry/page',
    method: 'GET',
    params: buildScopedPageParams('berry', {
      ...pageRequest,
      query: {
        id: pageRequest.query.id,
        internalName: pageRequest.query.internalName,
        name: pageRequest.query.name,
        berryFirmnessId: pageRequest.query.berryFirmnessId,
        naturalGiftTypeId: pageRequest.query.naturalGiftTypeId,
      },
    }),
  })
}

export async function createBerry(payload: Berry) {
  return requestParsedEntity(berryEntitySchema, {
    url: '/berry',
    method: 'POST',
    data: payload,
  })
}

export async function updateBerry(payload: Berry) {
  return requestParsedEntity(berryEntitySchema, {
    url: '/berry',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteBerry(id: Id) {
  return request<void>({
    url: `/berry/${id}`,
    method: 'DELETE',
  })
}
