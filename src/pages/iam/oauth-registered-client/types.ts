import type { Dayjs } from 'dayjs'

export interface OauthRegisteredClientView {
  id?: string
  clientId?: string
  clientIdIssuedAt?: string | null
  clientSecret?: string | null
  clientSecretExpiresAt?: string | null
  clientName?: string
  clientAuthenticationMethods?: string | null
  authorizationGrantTypes?: string | null
  redirectUris?: string | null
  postLogoutRedirectUris?: string | null
  scopes?: string | null
  requireProofKey?: boolean | null
  requireAuthorizationConsent?: boolean | null
  jwkSetUrl?: string | null
  tokenEndpointAuthenticationSigningAlgorithm?: string | null
  x509CertificateSubjectDn?: string | null
  authorizationCodeTimeToLive?: string | null
  accessTokenTimeToLive?: string | null
  accessTokenFormat?: string | null
  deviceCodeTimeToLive?: string | null
  reuseRefreshTokens?: boolean | null
  refreshTokenTimeToLive?: string | null
  idTokenSignatureAlgorithm?: string | null
  x509CertificateBoundAccessTokens?: boolean | null
}

export interface OauthRegisteredClientQuery {
  id?: string
  clientId?: string
  clientName?: string
}

export interface SaveOauthRegisteredClientInput {
  id?: string | null
  clientId?: string
  clientIdIssuedAt?: string | null
  clientSecret?: string | null
  clientSecretExpiresAt?: string | null
  clientName?: string
  clientAuthenticationMethods?: string | null
  authorizationGrantTypes?: string | null
  redirectUris?: string | null
  postLogoutRedirectUris?: string | null
  scopes?: string | null
  requireProofKey?: boolean | null
  requireAuthorizationConsent?: boolean | null
  jwkSetUrl?: string | null
  tokenEndpointAuthenticationSigningAlgorithm?: string | null
  x509CertificateSubjectDn?: string | null
  authorizationCodeTimeToLive?: string | null
  accessTokenTimeToLive?: string | null
  accessTokenFormat?: string | null
  deviceCodeTimeToLive?: string | null
  reuseRefreshTokens?: boolean | null
  refreshTokenTimeToLive?: string | null
  idTokenSignatureAlgorithm?: string | null
  x509CertificateBoundAccessTokens?: boolean | null
}

export interface UpdateOauthRegisteredClientInput extends SaveOauthRegisteredClientInput {
  id: string
}

export interface OauthRegisteredClientFormValues {
  id: string
  clientId: string
  clientIdIssuedAt: Dayjs | null
  clientSecret: string
  clientSecretExpiresAt: Dayjs | null
  clientName: string
  clientAuthenticationMethods: string[]
  authorizationGrantTypes: string[]
  redirectUris: string[]
  postLogoutRedirectUris: string[]
  scopes: string[]
  requireProofKey: boolean
  requireAuthorizationConsent: boolean
  jwkSetUrl: string
  tokenEndpointAuthenticationSigningAlgorithm?: string
  x509CertificateSubjectDn: string
  authorizationCodeTimeToLive: string
  accessTokenTimeToLive: string
  accessTokenFormat?: string
  deviceCodeTimeToLive: string
  reuseRefreshTokens: boolean
  refreshTokenTimeToLive: string
  idTokenSignatureAlgorithm?: string
  x509CertificateBoundAccessTokens: boolean
}
