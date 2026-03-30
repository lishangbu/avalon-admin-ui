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

const menuViewSchema = createApiObjectSchema<MenuView>({
  id: idFieldSchema,
  parentId: nullableIdFieldSchema,
  sortingOrder: nullableNumberFieldSchema,
  disabled: booleanFieldSchema,
  show: booleanFieldSchema,
  pinned: booleanFieldSchema,
  showTab: booleanFieldSchema,
  enableMultiTab: booleanFieldSchema,
})

const menuTreeNodeSchema: z.ZodType<MenuTreeNode> = createApiObjectSchema<MenuTreeNode>({
  id: idFieldSchema,
  parentId: nullableIdFieldSchema,
  sortingOrder: nullableNumberFieldSchema,
  disabled: booleanFieldSchema,
  show: booleanFieldSchema,
  pinned: booleanFieldSchema,
  showTab: booleanFieldSchema,
  enableMultiTab: booleanFieldSchema,
  children: z.lazy(() => z.array(menuTreeNodeSchema).nullable().optional()),
})

function flattenSystemMenuTree(tree: MenuTreeNode[]): MenuView[] {
  const flattenedMenus: MenuView[] = []
  const stack = [...tree].reverse()

  while (stack.length > 0) {
    const currentNode = stack.pop()

    if (!currentNode) {
      continue
    }

    const { children, ...menu } = currentNode
    flattenedMenus.push(parseApiEntity(menuViewSchema, menu))

    if (Array.isArray(children) && children.length > 0) {
      stack.push(...[...children].reverse())
    }
  }

  return flattenedMenus
}

export async function getMenuById(id: Id) {
  const res = await request<MenuView>({
    url: `/menu/${id}`,
    method: 'GET',
  })

  return {
    ...res,
    data: parseApiEntity(menuViewSchema, res.data),
  }
}

export async function listMenus(query: MenuQuery = {}) {
  const res = await request<MenuView[]>({
    url: '/menu/list',
    method: 'GET',
    params: compactParams(query),
  })

  return {
    ...res,
    data: parseApiList(menuViewSchema, res.data),
  }
}

export async function listMenuTree(query: MenuQuery = {}) {
  const res = await request<MenuTreeNode[]>({
    url: '/menu/tree',
    method: 'GET',
    params: compactParams(query),
  })

  return {
    ...res,
    data: flattenSystemMenuTree(parseApiList(menuTreeNodeSchema, res.data)),
  }
}

export async function createMenu(payload: SaveMenuInput) {
  const res = await request<MenuView>({
    url: '/menu',
    method: 'POST',
    data: payload,
  })

  return {
    ...res,
    data: parseApiEntity(menuViewSchema, res.data),
  }
}

export async function updateMenu(payload: UpdateMenuInput) {
  const res = await request<MenuView>({
    url: '/menu',
    method: 'PUT',
    data: payload,
  })

  return {
    ...res,
    data: parseApiEntity(menuViewSchema, res.data),
  }
}

export async function deleteMenu(id: Id) {
  return request<void>({
    url: `/menu/${id}`,
    method: 'DELETE',
  })
}
