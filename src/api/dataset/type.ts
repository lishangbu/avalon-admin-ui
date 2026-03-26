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

function normalizeTypeEntity(item: Type): Type {
  return {
    ...item,
    id: toId((item as { id?: unknown }).id),
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
