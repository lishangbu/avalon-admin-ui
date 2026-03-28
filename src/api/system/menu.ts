import { z } from 'zod'

import {
  booleanFieldSchema,
  compactParams,
  createApiObjectSchema,
  idFieldSchema,
  nullableIdFieldSchema,
  nullableNumberFieldSchema,
  parseApiEntity,
  parseApiList,
} from '@/api/shared'
import request from '@/utils/request'

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

const menuEntitySchema = createApiObjectSchema<Menu>({
  id: idFieldSchema,
  parentId: nullableIdFieldSchema,
  sortingOrder: nullableNumberFieldSchema,
  disabled: booleanFieldSchema,
  show: booleanFieldSchema,
  pinned: booleanFieldSchema,
  showTab: booleanFieldSchema,
  enableMultiTab: booleanFieldSchema,
})

type SystemMenuTreeNode = Menu & {
  children?: SystemMenuTreeNode[] | null
}

const systemMenuTreeNodeSchema: z.ZodType<SystemMenuTreeNode> = createApiObjectSchema<SystemMenuTreeNode>({
  id: idFieldSchema,
  parentId: nullableIdFieldSchema,
  sortingOrder: nullableNumberFieldSchema,
  disabled: booleanFieldSchema,
  show: booleanFieldSchema,
  pinned: booleanFieldSchema,
  showTab: booleanFieldSchema,
  enableMultiTab: booleanFieldSchema,
  children: z.lazy(() => z.array(systemMenuTreeNodeSchema).nullable().optional()),
})

function flattenSystemMenuTree(tree: SystemMenuTreeNode[]): Menu[] {
  const flattenedMenus: Menu[] = []
  const stack = [...tree].reverse()

  while (stack.length > 0) {
    const currentNode = stack.pop()

    if (!currentNode) {
      continue
    }

    const { children, ...menu } = currentNode
    flattenedMenus.push(parseApiEntity(menuEntitySchema, menu))

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

function matchesSystemMenuQuery(item: Menu, query: MenuQuery) {
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

export async function getMenuById(id: Id) {
  const res = await request<Menu>({
    url: `/menu/${id}`,
    method: 'GET',
  })

  return {
    ...res,
    data: parseApiEntity(menuEntitySchema, res.data),
  }
}

export async function getMenuPage(pageRequest: PageRequest<MenuQuery>) {
  const res = await listMenus()
  const filteredMenus = res.data.filter((item) => matchesSystemMenuQuery(item, pageRequest.query))

  return {
    ...res,
    data: paginateList(filteredMenus, pageRequest),
  }
}

export async function listMenus(query: MenuQuery = {}) {
  const res = await request<SystemMenuTreeNode[]>({
    url: '/menu/tree',
    method: 'GET',
    params: compactParams(query),
  })

  return {
    ...res,
    data: flattenSystemMenuTree(parseApiList(systemMenuTreeNodeSchema, res.data)),
  }
}

export async function createMenu(payload: Menu) {
  const res = await request<Menu>({
    url: '/menu',
    method: 'POST',
    data: payload,
  })

  return {
    ...res,
    data: parseApiEntity(menuEntitySchema, res.data),
  }
}

export async function updateMenu(payload: Menu) {
  const res = await request<Menu>({
    url: '/menu',
    method: 'PUT',
    data: payload,
  })

  return {
    ...res,
    data: parseApiEntity(menuEntitySchema, res.data),
  }
}

export async function deleteMenu(id: Id) {
  return request<void>({
    url: `/menu/${id}`,
    method: 'DELETE',
  })
}
