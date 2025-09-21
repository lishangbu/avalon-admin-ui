import { axiosInstance } from '@/utils/request'

import type { MenuItem } from '@/types/modules/menu'

export async function listCurrentRoleMenuTree(): Promise<ApiResult<MenuItem[]>> {
  return axiosInstance.request({
    url: '/menu/role-tree',
    method: 'GET'
  })
}
