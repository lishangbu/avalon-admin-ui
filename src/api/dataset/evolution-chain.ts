import { buildScopedPageParams, withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function getEvolutionChainPage(pageRequest: PageRequest<EvolutionChainQuery>) {
  return request<Page<EvolutionChain>>({
    url: '/evolution-chain/page',
    method: 'GET',
    params: buildScopedPageParams('evolutionChain', pageRequest),
  })
}

export async function listEvolutionChains(query: EvolutionChainQuery = {}) {
  return request<EvolutionChain[]>({
    url: '/evolution-chain/list',
    method: 'GET',
    params: withScopedQuery('evolutionChain', query),
  })
}

export async function createEvolutionChain(payload: EvolutionChainFormModel) {
  return request<EvolutionChain>({
    url: '/evolution-chain',
    method: 'POST',
    data: payload,
  })
}

export async function updateEvolutionChain(payload: EvolutionChainFormModel) {
  return request<EvolutionChain>({
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
