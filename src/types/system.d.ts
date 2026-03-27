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
  avatar: string
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

/**
 * 系统菜单实体
 */
declare interface SystemMenu {
  /** 主键 */
  id?: Id
  /** 父菜单 ID */
  parentId?: NullableId
  /** 菜单标识 */
  key?: string
  /** 菜单标题 */
  label?: string
  /** 菜单图标（Iconify 名称） */
  icon?: string
  /** 路由路径 */
  path?: string
  /** 路由名称 */
  name?: string
  /** 组件路径 */
  component?: string
  /** 重定向路径 */
  redirect?: string
  /** 排序 */
  sortingOrder?: number | null
  /** 是否禁用 */
  disabled?: boolean | null
  /** 是否显示 */
  show?: boolean | null
  /** 是否固定标签页 */
  pinned?: boolean | null
  /** 是否显示标签页 */
  showTab?: boolean | null
  /** 是否启用多标签 */
  enableMultiTab?: boolean | null
  /** 扩展字段 */
  extra?: Record<string, unknown> | null
}

/**
 * 系统菜单查询条件
 */
declare interface SystemMenuQuery {
  id?: NullableId
  parentId?: NullableId
  key?: string
  label?: string
  path?: string
  name?: string
  component?: string
}

/**
 * 系统菜单表单模型
 */
declare interface SystemMenuFormModel {
  id?: NullableId
  parentId: NullableId
  key: string
  label: string
  icon: string
  path: string
  name: string
  component: string
  redirect: string
  sortingOrder: number | null
  disabled: number | null
  show: number | null
  pinned: number | null
  showTab: number | null
  enableMultiTab: number | null
}

/**
 * 系统角色实体
 */
declare interface SystemRole {
  /** 主键 */
  id?: Id
  /** 角色代码 */
  code?: string
  /** 角色名称 */
  name?: string
  /** 是否启用 */
  enabled?: boolean | null
  /** 角色菜单 */
  menus?: SystemMenu[] | null
}

/**
 * 系统角色查询条件
 */
declare interface SystemRoleQuery {
  id?: NullableId
  code?: string
  name?: string
  enabled?: boolean | null
}

/**
 * 系统角色表单模型
 */
declare interface SystemRoleFormModel {
  id?: NullableId
  code: string
  name: string
  enabled: number | null
  menuIds: Id[]
}

/**
 * 系统用户实体
 */
declare interface SystemUser {
  /** 主键 */
  id?: Id
  /** 用户名 */
  username?: string
  /** 手机号 */
  phone?: string
  /** 邮箱 */
  email?: string
  /** 头像地址 */
  avatar?: string
  /** 密码（写入时使用） */
  hashedPassword?: string
  /** 用户角色 */
  roles?: SystemRole[] | null
}

/**
 * 系统用户查询条件
 */
declare interface SystemUserQuery {
  id?: NullableId
  username?: string
  phone?: string
  email?: string
}

/**
 * 系统用户表单模型
 */
declare interface SystemUserFormModel {
  id?: NullableId
  username: string
  phone: string
  email: string
  avatar: string
  hashedPassword: string
  roleIds: Id[]
}

/**
 * OAuth 注册客户端实体
 */
declare interface OauthRegisteredClient {
  /** 主键 */
  id?: string
  /** 客户端 ID */
  clientId?: string
  /** 客户端 ID 签发时间 */
  clientIdIssuedAt?: string | null
  /** 客户端密钥 */
  clientSecret?: string
  /** 客户端密钥过期时间 */
  clientSecretExpiresAt?: string | null
  /** 客户端名称 */
  clientName?: string
  /** 客户端认证方式 */
  clientAuthenticationMethods?: string
  /** 授权方式 */
  authorizationGrantTypes?: string
  /** 回调地址 */
  redirectUris?: string
  /** 登出回调地址 */
  postLogoutRedirectUris?: string
  /** Scope 列表 */
  scopes?: string
  /** 是否要求 PKCE */
  requireProofKey?: boolean | null
  /** 是否要求授权确认 */
  requireAuthorizationConsent?: boolean | null
  /** JWK Set URL */
  jwkSetUrl?: string
  /** 令牌端点认证签名算法 */
  tokenEndpointAuthenticationSigningAlgorithm?: string
  /** TLS 客户端证书主题 DN */
  x509CertificateSubjectDn?: string
  /** 授权码有效期 */
  authorizationCodeTimeToLive?: string
  /** 访问令牌有效期 */
  accessTokenTimeToLive?: string
  /** 访问令牌格式 */
  accessTokenFormat?: string
  /** 设备码有效期 */
  deviceCodeTimeToLive?: string
  /** 是否复用刷新令牌 */
  reuseRefreshTokens?: boolean | null
  /** 刷新令牌有效期 */
  refreshTokenTimeToLive?: string
  /** ID Token 签名算法 */
  idTokenSignatureAlgorithm?: string
  /** 是否绑定 x509 访问令牌 */
  x509CertificateBoundAccessTokens?: boolean | null
}

/**
 * OAuth 注册客户端查询条件
 */
declare interface OauthRegisteredClientQuery {
  id?: string
  clientId?: string
  clientName?: string
}

/**
 * OAuth 注册客户端表单模型
 */
declare interface OauthRegisteredClientFormModel {
  id: string
  clientId: string
  clientSecret: string
  clientName: string
  clientAuthenticationMethods: string
  authorizationGrantTypes: string
  redirectUris: string
  postLogoutRedirectUris: string
  scopes: string
  authorizationCodeTimeToLive: string
  accessTokenTimeToLive: string
  refreshTokenTimeToLive: string
  requireProofKey: number | null
  requireAuthorizationConsent: number | null
  reuseRefreshTokens: number | null
  x509CertificateBoundAccessTokens: number | null
}
