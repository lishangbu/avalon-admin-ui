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

function toNumberValue(value: unknown) {
  if (isNumber(value) && Number.isFinite(value)) {
    return value
  }

  if (isString(value) && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return undefined
}

function normalizePageData<T>(page: Page<T>, normalizeItem: (item: T) => T): Page<T> {
  const rawPage = page as Partial<Page<T>> & {
    rows?: unknown
    totalRowCount?: unknown
    totalPageCount?: unknown
  }
  const rows = Array.isArray(rawPage.rows) ? (rawPage.rows as T[]) : []

  return {
    rows: rows.map(normalizeItem),
    totalRowCount: toNumberValue(rawPage.totalRowCount) ?? 0,
    totalPageCount: toNumberValue(rawPage.totalPageCount) ?? 0,
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

export async function getBerryFirmnessPage(pageRequest: PageRequest<BerryFirmnessQuery>) {
  const res = await request<Page<BerryFirmness>>({
    url: '/berry-firmness/page',
    method: 'GET',
    params: normalizePageRequest({
      ...pageRequest,
      query: withScopedQuery('berryFirmness', pageRequest.query),
    }),
  })

  return {
    ...res,
    data: normalizePageData(res.data, normalizeBerryFirmnessEntity),
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
