import {axiosInstance} from '@/utils/request'

import type {LoginForm, TokenInfo} from "@/types/modules/token";

export async function doLogin(loginForm: LoginForm): Promise<ApiResult<TokenInfo>> {
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

export async function logout(): Promise<ApiResult<null>> {
  return axiosInstance.request({
    url: '/token/logout',
    method: 'DELETE',
  })
}
