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

const systemMenuTreeNodeSchema: z.ZodType<SystemMenuTreeNode> =
  createApiObjectSchema<SystemMenuTreeNode>({
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
