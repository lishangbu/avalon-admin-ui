import {axiosInstance} from '@/utils/request'

import type {User} from "@/types/modules/user";

/**
 * 获取当前用户信息
 *
 * @returns 包含用户信息的 API 结果 Promise
 */
export async function getUserInfo(): Promise<ApiResult<User>> {
  return axiosInstance.request({
    url: '/user/info',
    method: 'GET'
  })
}
