// 登录表单类型定义
export interface LoginForm {
  /** 用户名 */
  username?: string
  /** 密码 */
  password?: string
  /** 授权类型 */
  grantType?: 'password' | 'client_credentials'
}

export interface TokenInfo {
  accessToken: AccessToken | null
  refreshToken: RefreshToken | null
}

export interface AccessToken {
  tokenValue: string
  issuedAt: number | null
  expiresAt: number | null
  scopes: string[]
}
export interface RefreshToken {
  tokenValue: string
  issuedAt: number | null
  expiresAt: number | null
}
