import request from '@/utils/request'

import type { MenuMixedOptions } from '@/router/interface'

/**
 * 获取当前角色的菜单树
 *
 * @returns {MenuMixedOptions[]} 包含菜单项数组的 API
 */
export async function listCurrentRoleMenuTree(){
  // 发起 GET 请求，获取当前角色的菜单树
  return request<MenuMixedOptions[]>({
    url: '/menu/role-tree',
    method: 'GET',
  })
}
