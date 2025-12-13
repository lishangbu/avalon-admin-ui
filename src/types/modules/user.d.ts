/**
 * 用户信息接口定义
 */
export interface User {
  /** 用户唯一标识 */
  id: number
  /** 用户名 */
  username: string
  /** 用户角色列表 */
  roles: Role[]
}

/**
 * 用户角色接口定义
 */
export interface Role {
  /** 角色唯一标识 */
  id: number
  /** 角色编码 */
  code: string
  /** 角色名称 */
  name: string
  /** 角色是否启用 */
  enabled: boolean
}
