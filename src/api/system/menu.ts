import { compactParams } from '@/api/shared'
import request from '@/utils/request'

function flattenSystemMenuTree(tree: MenuTreeNode[]): MenuView[] {
  const flattenedMenus: MenuView[] = []
  const stack = [...tree].reverse()

  while (stack.length > 0) {
    const currentNode = stack.pop()

    if (!currentNode) {
      continue
    }

    const { children, ...menu } = currentNode
    flattenedMenus.push(menu)

    if (Array.isArray(children) && children.length > 0) {
      stack.push(...[...children].reverse())
    }
  }

  return flattenedMenus
}

export async function getMenuById(id: Id) {
  return request<MenuView>({
    url: `/menu/${id}`,
    method: 'GET',
  })
}

export async function listMenus(query: MenuQuery = {}) {
  return request<MenuView[]>({
    url: '/menu/list',
    method: 'GET',
    params: compactParams(query),
  })
}

export async function listMenuTree(query: MenuQuery = {}) {
  const res = await request<MenuTreeNode[]>({
    url: '/menu/tree',
    method: 'GET',
    params: compactParams(query),
  })

  return {
    ...res,
    data: flattenSystemMenuTree(res.data),
  }
}

export async function createMenu(payload: SaveMenuInput) {
  return request<MenuView>({
    url: '/menu',
    method: 'POST',
    data: payload,
  })
}

export async function updateMenu(payload: UpdateMenuInput) {
  return request<MenuView>({
    url: '/menu',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteMenu(id: Id) {
  return request<void>({
    url: `/menu/${id}`,
    method: 'DELETE',
  })
}
