import {axiosInstance} from '@/utils/request'

import type {User} from "@/types/modules/user";

export async function getUserInfo(): Promise<ApiResult<User>> {
  return axiosInstance.request({
    url: '/user/info',
    method: 'GET'
  })
}
