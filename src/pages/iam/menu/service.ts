import type { MenuUpsertInput } from '@/types/menu'
import { request } from '@/shared/api/http'
import {
  type IamMenuTreeNodeResponse,
  type IamMenuResponse,
  normalizeMenu,
  normalizeMenuTree,
  toBackendMenuPayload,
} from '@/pages/iam/shared/idm-normalizers'

const endpoint = '/iam/menus'

export async function listCurrentRoleMenuTree() {
  return listMenuTree()
}

export async function listMenuTree() {
  const result = await request<IamMenuTreeNodeResponse[]>({
    url: `${endpoint}/tree`,
    method: 'GET',
  })

  return normalizeMenuTree(result)
}

export async function getMenuById(id: string) {
  const result = await request<IamMenuResponse>({
    url: `${endpoint}/${id}`,
    method: 'GET',
  })

  return normalizeMenu(result)
}

export async function createMenu(payload: MenuUpsertInput) {
  const result = await request<IamMenuResponse>({
    url: endpoint,
    method: 'POST',
    data: toBackendMenuPayload(payload),
  })

  return normalizeMenu(result)
}

export async function updateMenu(payload: MenuUpsertInput) {
  const result = await request<IamMenuResponse>({
    url: `${endpoint}/${payload.id}`,
    method: 'PUT',
    data: toBackendMenuPayload(payload),
  })

  return normalizeMenu(result)
}

export async function deleteMenu(id: string) {
  return request<void>({
    url: `${endpoint}/${id}`,
    method: 'DELETE',
  })
}
