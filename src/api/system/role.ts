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

function normalizeSystemMenuEntity(item: SystemMenu): SystemMenu {
  return {
    ...item,
    id: toId((item as { id?: unknown }).id),
    parentId: toId((item as { parentId?: unknown }).parentId) ?? item.parentId,
    disabled: toBoolean((item as { disabled?: unknown }).disabled) ?? item.disabled,
    show: toBoolean((item as { show?: unknown }).show) ?? item.show,
    pinned: toBoolean((item as { pinned?: unknown }).pinned) ?? item.pinned,
    showTab: toBoolean((item as { showTab?: unknown }).showTab) ?? item.showTab,
    enableMultiTab:
      toBoolean((item as { enableMultiTab?: unknown }).enableMultiTab) ?? item.enableMultiTab,
  }
}

function normalizeSystemRoleEntity(item: SystemRole): SystemRole {
  return {
    ...item,
    id: toId((item as { id?: unknown }).id),
    enabled: toBoolean((item as { enabled?: unknown }).enabled) ?? item.enabled,
    menus: Array.isArray(item.menus) ? item.menus.map(normalizeSystemMenuEntity) : item.menus,
  }
}

export async function getSystemRoleById(id: Id) {
  const res = await request<SystemRole>({
    url: `/role/${id}`,
    method: 'GET',
  })

  return {
    ...res,
    data: normalizeSystemRoleEntity(res.data),
  }
}

export async function getSystemRolePage(pageRequest: PageRequest<SystemRoleQuery>) {
  const res = await request<Page<SystemRole>>({
    url: '/role/page',
    method: 'GET',
    params: normalizePageRequest({
      ...pageRequest,
      query: withScopedQuery('role', pageRequest.query),
    }),
  })

  return {
    ...res,
    data: normalizePageData(res.data, normalizeSystemRoleEntity),
  }
}

export async function listSystemRoles(query: SystemRoleQuery = {}) {
  const res = await request<SystemRole[]>({
    url: '/role/list',
    method: 'GET',
    params: withScopedQuery('role', compactParams(query)),
  })

  return {
    ...res,
    data: res.data.map(normalizeSystemRoleEntity),
  }
}

export async function createSystemRole(payload: SystemRole) {
  const res = await request<SystemRole>({
    url: '/role',
    method: 'POST',
    data: payload,
  })

  return {
    ...res,
    data: normalizeSystemRoleEntity(res.data),
  }
}

export async function updateSystemRole(payload: SystemRole) {
  const res = await request<SystemRole>({
    url: '/role',
    method: 'PUT',
    data: payload,
  })

  return {
    ...res,
    data: normalizeSystemRoleEntity(res.data),
  }
}

export async function deleteSystemRole(id: Id) {
  return request<void>({
    url: `/role/${id}`,
    method: 'DELETE',
  })
}
