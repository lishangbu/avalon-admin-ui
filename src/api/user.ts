import request from '@/utils/request'

/**
 * 获取当前用户信息
 *
 * @returns 包含用户信息的 API 结果
 */
export async function getUserInfo() {
  return request<AuthUser>({
    url: '/user/info',
    method: 'GET',
  })
}
