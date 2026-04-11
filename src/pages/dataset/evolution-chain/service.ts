import type { Id } from '@/types/common'
import type { Page, PageRequest } from '@/types/common'
import { request } from '@/shared/api/http'
import { buildScopedPageParams } from '@/utils/request'
interface EntitySummary {
  id?: Id
  name?: string | null
  internalName?: string | null
}

export interface EvolutionChainRecord {
  id?: Id
  babyTriggerItem?: EntitySummary | null
  internalName?: string | null
}

export type EvolutionChainQuery = Record<string, never>

const endpoint = 'evolution-chain'
const scope = 'evolutionChain'

export async function getPage(pageRequest: PageRequest<EvolutionChainQuery>) {
  return request<Page<EvolutionChainRecord>>({
    url: `/${endpoint}/page`,
    method: 'GET',
    params: buildScopedPageParams(scope, pageRequest),
  })
}
