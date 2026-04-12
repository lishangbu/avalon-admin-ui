import type { MenuTreeNode, MenuUpsertInput, MenuView } from '@/types/menu'
import { request } from '@/shared/api/http'

export async function listCurrentRoleMenuTree() {
  return request<MenuTreeNode[]>({
    url: '/menu/role-tree',
    method: 'GET',
  })
}

export async function listMenuTree() {
  return request<MenuTreeNode[]>({
    url: '/menu/tree',
    method: 'GET',
  })
}

export async function createMenu(payload: MenuUpsertInput) {
  return request<MenuView>({
    url: '/menu',
    method: 'POST',
    data: payload,
  })
}

export async function updateMenu(payload: MenuUpsertInput) {
  return request<MenuView>({
    url: '/menu',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteMenu(id: string) {
  return request<void>({
    url: `/menu/${id}`,
    method: 'DELETE',
  })
}
