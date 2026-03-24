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

function normalizeMoveDamageClassEntity(item: MoveDamageClass): MoveDamageClass {
  return {
    ...item,
    id: toId((item as { id?: unknown }).id),
  }
}

export async function getMoveDamageClassPage(pageRequest: PageRequest<MoveDamageClassQuery>) {
  const res = await request<Page<MoveDamageClass>>({
    url: '/move-damage-class/page',
    method: 'GET',
    params: normalizePageRequest({
      ...pageRequest,
      query: withScopedQuery('moveDamageClass', pageRequest.query),
    }),
  })

  return {
    ...res,
    data: normalizePageData(res.data, normalizeMoveDamageClassEntity),
  }
}

export async function listMoveDamageClasses(query: MoveDamageClassQuery = {}) {
  const res = await request<MoveDamageClass[]>({
    url: '/move-damage-class/list',
    method: 'GET',
    params: withScopedQuery('moveDamageClass', compactParams(query)),
  })

  return {
    ...res,
    data: res.data.map(normalizeMoveDamageClassEntity),
  }
}

export async function createMoveDamageClass(payload: MoveDamageClass) {
  const res = await request<MoveDamageClass>({
    url: '/move-damage-class',
    method: 'POST',
    data: payload,
  })

  return {
    ...res,
    data: normalizeMoveDamageClassEntity(res.data),
  }
}

export async function updateMoveDamageClass(payload: MoveDamageClass) {
  const res = await request<MoveDamageClass>({
    url: '/move-damage-class',
    method: 'PUT',
    data: payload,
  })

  return {
    ...res,
    data: normalizeMoveDamageClassEntity(res.data),
  }
}

export async function deleteMoveDamageClass(id: Id) {
  return request<void>({
    url: `/move-damage-class/${id}`,
    method: 'DELETE',
  })
}
