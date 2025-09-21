import {axiosInstance} from '@/utils/request'

import type {LoginForm, TokenInfo} from "@/types/modules/token";

/**
 * 用户登录，获取 Token 信息
 *
 * @param loginForm 登录表单参数
 * @returns 包含 Token 信息的 API 结果 Promise
 */
export async function login(loginForm: LoginForm): Promise<ApiResult<TokenInfo>> {
  // 发起 POST 请求，进行用户登录
  return axiosInstance.request({
    url: '/oauth2/token',
    method: 'POST',
    params: loginForm,
    headers: {
      Authorization: 'Basic dGVzdDp0ZXN0',
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
}

/**
 * 注销当前用户
 *
 * @returns 注销操作的 API 结果 Promise
 */
export async function logout(): Promise<ApiResult<null>> {
  // 发起 DELETE 请求，注销当前用户
  return axiosInstance.request({
    url: '/token/logout',
    method: 'DELETE',
  })
}
