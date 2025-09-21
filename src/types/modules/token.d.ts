interface LoginForm {
  username: string,
  password: string,
  grant_type: 'password',
}

export interface TokenInfo {
  accessToken:          AccessToken;
  refreshToken:         RefreshToken;
  additionalParameters: AdditionalParameters;
}

export interface AccessToken {
  tokenValue: string;
  issuedAt:   number;
  expiresAt:  number;
  tokenType:  TokenType;
  scopes:     string[];
}

export interface TokenType {
  value: string;
}

export interface AdditionalParameters {
  id_token: string;
}

export interface RefreshToken {
  tokenValue: string;
  issuedAt:   number;
  expiresAt:  null;
}
