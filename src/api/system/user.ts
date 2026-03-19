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

function toStringValue(value: unknown) {
  if (isString(value)) {
    return value
  }

  if (isNumber(value) && Number.isFinite(value)) {
    return String(value)
  }

  return undefined
}

function normalizePageData<T>(page: Page<T>, normalizeItem: (item: T) => T): Page<T> {
  const rawPage = page as Page<T> & { totalElements?: unknown }

  return {
    content: page.content.map(normalizeItem),
    totalElements: toStringValue(rawPage.totalElements) ?? '0',
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

function toBoolean(value: unknown) {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    if (value === 1) {
      return true
    }

    if (value === 0) {
      return false
    }
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()

    if (normalized === 'true' || normalized === '1') {
      return true
    }

    if (normalized === 'false' || normalized === '0') {
      return false
    }
  }

  return undefined
}

function normalizeSystemRoleEntity(item: SystemRole): SystemRole {
  return {
    ...item,
    id: toId((item as { id?: unknown }).id),
    enabled: toBoolean((item as { enabled?: unknown }).enabled) ?? item.enabled,
  }
}

function normalizeSystemUserEntity(item: SystemUser): SystemUser {
  return {
    ...item,
    id: toId((item as { id?: unknown }).id),
    roles: Array.isArray(item.roles) ? item.roles.map(normalizeSystemRoleEntity) : item.roles,
  }
}

export async function getSystemUserById(id: Id) {
  const res = await request<SystemUser>({
    url: `/user/${id}`,
    method: 'GET',
  })

  return {
    ...res,
    data: normalizeSystemUserEntity(res.data),
  }
}

export async function getSystemUserPage(pageRequest: PageRequest<SystemUserQuery>) {
  const res = await request<Page<SystemUser>>({
    url: '/user/page',
    method: 'GET',
    params: normalizePageRequest({
      ...pageRequest,
      query: withScopedQuery('user', pageRequest.query),
    }),
  })

  return {
    ...res,
    data: normalizePageData(res.data, normalizeSystemUserEntity),
  }
}

export async function listSystemUsers(query: SystemUserQuery = {}) {
  const res = await request<SystemUser[]>({
    url: '/user/list',
    method: 'GET',
    params: withScopedQuery('user', compactParams(query)),
  })

  return {
    ...res,
    data: res.data.map(normalizeSystemUserEntity),
  }
}

export async function createSystemUser(payload: SystemUser) {
  const res = await request<SystemUser>({
    url: '/user',
    method: 'POST',
    data: payload,
  })

  return {
    ...res,
    data: normalizeSystemUserEntity(res.data),
  }
}

export async function updateSystemUser(payload: SystemUser) {
  const res = await request<SystemUser>({
    url: '/user',
    method: 'PUT',
    data: payload,
  })

  return {
    ...res,
    data: normalizeSystemUserEntity(res.data),
  }
}

export async function deleteSystemUser(id: Id) {
  return request<void>({
    url: `/user/${id}`,
    method: 'DELETE',
  })
}
