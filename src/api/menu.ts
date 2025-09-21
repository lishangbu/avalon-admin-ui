import { axiosInstance } from '@/utils/request'

/**
 * 获取当前角色的菜单树
 *
 * @returns {Promise<ApiResult<MenuItem[]>>} 包含菜单项数组的 API 结果 Promise
 */
export async function listCurrentRoleMenuTree(): Promise<ApiResult<MenuItem[]>> {
  // 发起 GET 请求，获取当前角色的菜单树
  return axiosInstance.request({
    url: '/menu/role-tree',
    method: 'GET'
  })
}
