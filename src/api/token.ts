import request from '@/utils/request'

/**
 * 用户登录，获取 Token 信息
 *
 * @param loginForm 登录表单参数
 * @returns 包含 Token 信息的 API 结果 Promise
 */
export async function login(loginForm: LoginForm) {
  // 使用 URLSearchParams 构造表单数据
  const formData = new URLSearchParams()
  Object.entries(loginForm).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value))
    }
  })
  // 发起 POST 请求，进行用户登录
  return request<TokenInfo>({
    url: '/oauth2/token',
    method: 'POST',
    data: formData,
    headers: {
      Authorization: 'Basic dGVzdDp0ZXN0',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

/**
 * 注销当前用户
 *
 * @returns 注销操作的 API 结果 Promise
 */
export async function logout() {
  // 发起 DELETE 请求，注销当前用户
  return request({
    url: '/token/logout',
    method: 'DELETE',
  })
}
