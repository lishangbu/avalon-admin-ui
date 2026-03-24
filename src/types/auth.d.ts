/**
 * 通用 API 返回结构
 *
 * @template T 返回数据类型
 * @property code 响应码，通常为 0 表示成功，其他为错误码
 * @property errorMessage 错误信息，成功时为 null
 * @property data 返回的数据内容
 */
declare interface LoginForm {
  username: string
  password: string
  grant_type: 'password'
}

declare interface TokenInfo {
  access_token: string
  token_type: string
  expires_in: string
  refresh_token: string
  scope: string
  id_token: string
}
