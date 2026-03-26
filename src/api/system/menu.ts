import { isNumber, isString, pickBy } from 'es-toolkit'

import request from '@/utils/request'

function compactParams(params: object) {
  return pickBy(params, (value) => value !== undefined && value !== null && value !== '')
}

function paginateList<T>(items: T[], pageRequest: PageRequest<unknown>): Page<T> {
  const page = Math.max((pageRequest.page ?? 1) - 1, 0)
  const size = Math.max(pageRequest.size ?? 10, 1)
  const start = page * size

  return {
    rows: items.slice(start, start + size),
    totalRowCount: items.length,
    totalPageCount: Math.ceil(items.length / size),
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

type SystemMenuTreeNode = SystemMenu & {
  children?: SystemMenuTreeNode[] | null
}

function flattenSystemMenuTree(tree: SystemMenuTreeNode[]): SystemMenu[] {
  const flattenedMenus: SystemMenu[] = []
  const stack = [...tree].reverse()

  while (stack.length > 0) {
    const currentNode = stack.pop()

    if (!currentNode) {
      continue
    }

    const { children, ...menu } = currentNode
    flattenedMenus.push(normalizeSystemMenuEntity(menu))

    if (Array.isArray(children) && children.length > 0) {
      stack.push(...[...children].reverse())
    }
  }

  return flattenedMenus
}

function matchesId(actual: Id | null | undefined, expected: NullableId | undefined) {
  if (expected === undefined) {
    return true
  }

  if (expected === null) {
    return actual === null || actual === undefined
  }

  if (actual === null || actual === undefined) {
    return false
  }

  return String(actual) === String(expected)
}

function matchesText(actual: string | null | undefined, expected: string | undefined) {
  const keyword = expected?.trim()

  if (!keyword) {
    return true
  }

  return actual?.toLowerCase().includes(keyword.toLowerCase()) ?? false
}

function matchesSystemMenuQuery(item: SystemMenu, query: SystemMenuQuery) {
  return (
    matchesId(item.id, query.id) &&
    matchesId(item.parentId, query.parentId) &&
    matchesText(item.key, query.key) &&
    matchesText(item.label, query.label) &&
    matchesText(item.path, query.path) &&
    matchesText(item.name, query.name) &&
    matchesText(item.component, query.component)
  )
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
  const res = await listSystemMenus()
  const filteredMenus = res.data.filter((item) => matchesSystemMenuQuery(item, pageRequest.query))

  return {
    ...res,
    data: paginateList(filteredMenus, pageRequest),
  }
}

export async function listSystemMenus(query: SystemMenuQuery = {}) {
  const res = await request<SystemMenuTreeNode[]>({
    url: '/menu/tree',
    method: 'GET',
    params: compactParams(query),
  })

  return {
    ...res,
    data: flattenSystemMenuTree(res.data),
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
