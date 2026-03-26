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

function normalizeBerryFlavorEntity(item: BerryFlavor): BerryFlavor {
  return {
    ...item,
    id: toId((item as { id?: unknown }).id),
  }
}

export async function listBerryFlavors(query: BerryFlavorQuery = {}) {
  const res = await request<BerryFlavor[]>({
    url: '/berry-flavor/list',
    method: 'GET',
    params: withScopedQuery('berryFlavor', query),
  })

  return {
    ...res,
    data: res.data.map(normalizeBerryFlavorEntity),
  }
}

export async function createBerryFlavor(payload: BerryFlavor) {
  const res = await request<BerryFlavor>({
    url: '/berry-flavor',
    method: 'POST',
    data: payload,
  })

  return {
    ...res,
    data: normalizeBerryFlavorEntity(res.data),
  }
}

export async function updateBerryFlavor(payload: BerryFlavor) {
  const res = await request<BerryFlavor>({
    url: '/berry-flavor',
    method: 'PUT',
    data: payload,
  })

  return {
    ...res,
    data: normalizeBerryFlavorEntity(res.data),
  }
}

export async function deleteBerryFlavor(id: Id) {
  return request<void>({
    url: `/berry-flavor/${id}`,
    method: 'DELETE',
  })
}
