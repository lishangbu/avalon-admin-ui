import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listGrowthRates(query: GrowthRateQuery = {}) {
  return request<GrowthRate[]>({
    url: '/growth-rate/list',
    method: 'GET',
    params: withScopedQuery('growthRate', query),
  })
}

export async function createGrowthRate(payload: GrowthRateFormModel) {
  return request<GrowthRate>({
    url: '/growth-rate',
    method: 'POST',
    data: payload,
  })
}

export async function updateGrowthRate(payload: GrowthRateFormModel) {
  return request<GrowthRate>({
    url: '/growth-rate',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteGrowthRate(id: Id) {
  return request<void>({
    url: `/growth-rate/${id}`,
    method: 'DELETE',
  })
}
