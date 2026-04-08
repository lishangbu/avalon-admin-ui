import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listStats(query: StatQuery = {}) {
  return request<Stat[]>({
    url: '/stat/list',
    method: 'GET',
    params: withScopedQuery('stat', query),
  })
}

export async function listCoreStats() {
  return request<Stat[]>({
    url: '/stat/core-list',
    method: 'GET',
  })
}

export async function createStat(payload: Stat) {
  return request<Stat>({
    url: '/stat',
    method: 'POST',
    data: payload,
  })
}

export async function updateStat(payload: Stat) {
  return request<Stat>({
    url: '/stat',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteStat(id: Id) {
  return request<void>({
    url: `/stat/${id}`,
    method: 'DELETE',
  })
}
