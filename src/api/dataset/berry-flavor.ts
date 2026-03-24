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

function normalizePageRequest<T>(pageRequest: PageRequest<T>) {
  return compactParams({
    page: Math.max((pageRequest.page ?? 1) - 1, 0),
    size: pageRequest.size ?? 10,
    sort: pageRequest.sort ?? 'id,asc',
    ...pageRequest.query,
  })
}

function normalizePageData<T>(page: Page<T>, normalizeItem: (item: T) => T): Page<T> {
  const rawPage = page as Partial<Page<T>> & {
    rows?: unknown
  }
  const rows = Array.isArray(rawPage.rows) ? (rawPage.rows as T[]) : []

  return {
    rows: rows.map(normalizeItem),
    totalRowCount: rawPage.totalRowCount ?? 0,
    totalPageCount: rawPage.totalPageCount ?? 0,
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

export async function getBerryFlavorPage(pageRequest: PageRequest<BerryFlavorQuery>) {
  const res = await request<Page<BerryFlavor>>({
    url: '/berry-flavor/page',
    method: 'GET',
    params: normalizePageRequest({
      ...pageRequest,
      query: withScopedQuery('berryFlavor', pageRequest.query),
    }),
  })

  return {
    ...res,
    data: normalizePageData(res.data, normalizeBerryFlavorEntity),
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
