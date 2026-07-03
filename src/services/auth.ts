import { readAccessToken } from '../app/auth/auth-storage';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
}

export interface SessionUser {
  id: number;
  username: string;
  displayName: string;
}

export interface SessionRole {
  code: string;
  name: string;
}

export interface SessionMenuNode {
  code: string;
  name?: string;
  type?: 'DIRECTORY' | 'ROUTE' | 'MENU';
  path?: string;
  icon?: string;
  children?: SessionMenuNode[];
}

export interface SessionResponse {
  user: SessionUser;
  roles: SessionRole[];
  accessNodeCodes: string[];
  menus: SessionMenuNode[];
}

const PASSWORD_GRANT_TYPE = 'urn:security:params:oauth:grant-type:password';

/**
 * 调用后端自定义 password grant 获取 access token。
 *
 * Avalon 后端要求 token endpoint 使用 HTTP Basic 完成 client 认证，并通过
 * x-www-form-urlencoded 传递 username/password/scope。该函数只负责协议交互，
 * token 保存和 session 加载由 AuthProvider 编排。
 */
export async function loginWithPassword(input: LoginRequest): Promise<TokenResponse> {
  const tokenUrl = import.meta.env.VITE_OAUTH_TOKEN_URL ?? '/oauth2/token';
  const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID ?? 'system-admin-opaque';
  const clientSecret = import.meta.env.VITE_OAUTH_CLIENT_SECRET ?? 'system-admin-opaque-secret';
  const scope =
    import.meta.env.VITE_OAUTH_SCOPE ?? 'security:admin battle-rules:admin game-data:admin';
  const body = new URLSearchParams({
    grant_type: PASSWORD_GRANT_TYPE,
    username: input.username,
    password: input.password,
    scope,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    throw new Error('用户名、密码或客户端凭据无效');
  }

  return response.json() as Promise<TokenResponse>;
}

/**
 * 读取当前登录态。
 *
 * 前端菜单、按钮权限和当前用户信息都以后端 session 为准。这样即使 token 内部 claim
 * 发生变化，前端也只依赖稳定的 `/api/session` 契约。
 */
export async function fetchCurrentSession(): Promise<SessionResponse> {
  const token = readAccessToken();
  const response = await fetch('/api/session', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    throw new Error('当前登录态已失效');
  }

  return response.json() as Promise<SessionResponse>;
}
