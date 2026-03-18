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
  access_token:  string;
  token_type:    string;
  expires_in:    string;
  refresh_token: string;
  scope:         string;
  id_token:      string;
}

/**
 * 用户信息接口定义
 */
declare interface User {
  /** 用户唯一标识 */
  id: number
  /** 用户名 */
  username: string
  /** 用户角色列表 */
  roles: Role[]
  /** 用户头像 */
  avatar:string
}

/**
 * 用户角色接口定义
 */
declare interface Role {
  /** 角色唯一标识 */
  id: number
  /** 角色编码 */
  code: string
  /** 角色名称 */
  name: string
  /** 角色是否启用 */
  enabled: boolean
}
