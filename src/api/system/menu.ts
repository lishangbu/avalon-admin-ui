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

function toNumber(value: unknown) {
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
    sortingOrder: toNumber((item as { sortingOrder?: unknown }).sortingOrder) ?? item.sortingOrder,
    disabled: toBoolean((item as { disabled?: unknown }).disabled) ?? item.disabled,
    show: toBoolean((item as { show?: unknown }).show) ?? item.show,
    pinned: toBoolean((item as { pinned?: unknown }).pinned) ?? item.pinned,
    showTab: toBoolean((item as { showTab?: unknown }).showTab) ?? item.showTab,
    enableMultiTab:
      toBoolean((item as { enableMultiTab?: unknown }).enableMultiTab) ?? item.enableMultiTab,
  }
}

export async function getSystemMenuById(id: Id) {
  const res = await request<SystemMenu>({
    url: `/menu/${id}`,
    method: 'GET',
  })

  return {
    ...res,
    data: normalizeSystemMenuEntity(res.data),
  }
}

export async function getSystemMenuPage(pageRequest: PageRequest<SystemMenuQuery>) {
  const res = await request<Page<SystemMenu>>({
    url: '/menu/page',
    method: 'GET',
    params: normalizePageRequest({
      ...pageRequest,
      query: withScopedQuery('menu', pageRequest.query),
    }),
  })

  return {
    ...res,
    data: normalizePageData(res.data, normalizeSystemMenuEntity),
  }
}

export async function listSystemMenus(query: SystemMenuQuery = {}) {
  const res = await request<SystemMenu[]>({
    url: '/menu/list',
    method: 'GET',
    params: withScopedQuery('menu', compactParams(query)),
  })

  return {
    ...res,
    data: res.data.map(normalizeSystemMenuEntity),
  }
}

export async function createSystemMenu(payload: SystemMenu) {
  const res = await request<SystemMenu>({
    url: '/menu',
    method: 'POST',
    data: payload,
  })

  return {
    ...res,
    data: normalizeSystemMenuEntity(res.data),
  }
}

export async function updateSystemMenu(payload: SystemMenu) {
  const res = await request<SystemMenu>({
    url: '/menu',
    method: 'PUT',
    data: payload,
  })

  return {
    ...res,
    data: normalizeSystemMenuEntity(res.data),
  }
}

export async function deleteSystemMenu(id: Id) {
  return request<void>({
    url: `/menu/${id}`,
    method: 'DELETE',
  })
}
