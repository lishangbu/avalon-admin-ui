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

function normalizeTypeEntity(item: Type): Type {
  return {
    ...item,
    id: toId((item as { id?: unknown }).id),
  }
}

export async function getTypePage(pageRequest: PageRequest<TypeQuery>) {
  const res = await request<Page<Type>>({
    url: '/type/page',
    method: 'GET',
    params: normalizePageRequest({
      ...pageRequest,
      query: withScopedQuery('type', pageRequest.query),
    }),
  })

  return {
    ...res,
    data: normalizePageData(res.data, normalizeTypeEntity),
  }
}

export async function listTypes(query: TypeQuery = {}) {
  const res = await request<Type[]>({
    url: '/type/list',
    method: 'GET',
    params: withScopedQuery('type', compactParams(query)),
  })

  return {
    ...res,
    data: res.data.map(normalizeTypeEntity),
  }
}

export async function createType(payload: Type) {
  const res = await request<Type>({
    url: '/type',
    method: 'POST',
    data: payload,
  })

  return {
    ...res,
    data: normalizeTypeEntity(res.data),
  }
}

export async function updateType(payload: Type) {
  const res = await request<Type>({
    url: '/type',
    method: 'PUT',
    data: payload,
  })

  return {
    ...res,
    data: normalizeTypeEntity(res.data),
  }
}

export async function deleteType(id: Id) {
  return request<void>({
    url: `/type/${id}`,
    method: 'DELETE',
  })
}
