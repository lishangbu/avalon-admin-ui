import {
  buildScopedListParams,
  buildScopedPageParams,
  createApiObjectSchema,
  idFieldSchema,
  requestParsedEntity,
  requestParsedList,
  requestParsedPage,
} from '@/api/shared'
import request from '@/utils/request'

const itemEntitySchema = createApiObjectSchema<Item>({
  id: idFieldSchema,
})

const evolutionChainEntitySchema = createApiObjectSchema<EvolutionChain>({
  id: idFieldSchema,
  babyTriggerItem: itemEntitySchema.nullable().optional(),
})

export async function getEvolutionChainPage(pageRequest: PageRequest<EvolutionChainQuery>) {
  return requestParsedPage(evolutionChainEntitySchema, {
    url: '/evolution-chain/page',
    method: 'GET',
    params: buildScopedPageParams('evolutionChain', {
      ...pageRequest,
      query: {
        id: pageRequest.query.id,
        babyTriggerItemId: pageRequest.query.babyTriggerItemId,
      },
    }),
  })
}

export async function listEvolutionChains(query: EvolutionChainQuery = {}) {
  return requestParsedList(evolutionChainEntitySchema, {
    url: '/evolution-chain/list',
    method: 'GET',
    params: buildScopedListParams('evolutionChain', {
      id: query.id,
      babyTriggerItemId: query.babyTriggerItemId,
    }),
  })
}

export async function createEvolutionChain(payload: EvolutionChainFormModel) {
  return requestParsedEntity(evolutionChainEntitySchema, {
    url: '/evolution-chain',
    method: 'POST',
    data: payload,
  })
}

export async function updateEvolutionChain(payload: EvolutionChainFormModel) {
  return requestParsedEntity(evolutionChainEntitySchema, {
    url: '/evolution-chain',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteEvolutionChain(id: Id) {
  return request<void>({
    url: `/evolution-chain/${id}`,
    method: 'DELETE',
  })
}
