import { isNumber, isString, pickBy } from 'es-toolkit'

import request from '@/utils/request'

function compactParams(params: object) {
  return pickBy(params, (value) => value !== undefined && value !== null && value !== '')
}

function withScopedQuery(scope: string, query: object) {
  const compactedQuery = compactParams(query)

  return {
    ...compactedQuery,
    ...Object.fromEntries(
      Object.entries(compactedQuery).map(([key, value]) => [`${scope}.${key}`, value]),
    ),
  }
}

function toId(value: unknown) {
  if (isString(value)) {
    return value
  }

  if (isNumber(value) && Number.isFinite(value)) {
    return value
  }

  return undefined
}

function normalizeBerryFirmnessEntity(item: BerryFirmness): BerryFirmness {
  return {
    ...item,
    id: toId((item as { id?: unknown }).id),
  }
}

export async function listBerryFirmnesses(query: BerryFirmnessQuery = {}) {
  const res = await request<BerryFirmness[]>({
    url: '/berry-firmness/list',
    method: 'GET',
    params: withScopedQuery('berryFirmness', query),
  })

  return {
    ...res,
    data: res.data.map(normalizeBerryFirmnessEntity),
  }
}

export async function createBerryFirmness(payload: BerryFirmness) {
  const res = await request<BerryFirmness>({
    url: '/berry-firmness',
    method: 'POST',
    data: payload,
  })

  return {
    ...res,
    data: normalizeBerryFirmnessEntity(res.data),
  }
}

export async function updateBerryFirmness(payload: BerryFirmness) {
  const res = await request<BerryFirmness>({
    url: '/berry-firmness',
    method: 'PUT',
    data: payload,
  })

  return {
    ...res,
    data: normalizeBerryFirmnessEntity(res.data),
  }
}

export async function deleteBerryFirmness(id: Id) {
  return request<void>({
    url: `/berry-firmness/${id}`,
    method: 'DELETE',
  })
}
