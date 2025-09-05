/**
 * OAuth2 注册客户端信息类型声明
 */
export interface Oauth2RegisteredClientInfo {
  /** 客户端唯一标识 */
  clientId: string
  /** 客户端名称 */
  clientName: string
  /** 客户端密钥 */
  clientSecret: string
}
