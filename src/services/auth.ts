import {
  readAccessToken,
  readRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from '../app/auth/auth-storage';
import type { components } from './generated/schema';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
}

type GeneratedSessionMenuNode = components['schemas']['SessionMenuNodeResponse'];

export type SessionMenuNode = Pick<GeneratedSessionMenuNode, 'code'> &
  Partial<Omit<GeneratedSessionMenuNode, 'children' | 'type'>> & {
    type?: 'DIRECTORY' | 'ROUTE';
    children?: SessionMenuNode[];
  };

export type SessionResponse = Omit<components['schemas']['SessionResponse'], 'menus'> & {
  menus: SessionMenuNode[];
};

const PASSWORD_GRANT_TYPE = 'urn:security:params:oauth:grant-type:password';
const TOKEN_URL = import.meta.env.VITE_OAUTH_TOKEN_URL ?? '/oauth2/token';
const PUBLIC_CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID ?? 'avalon-web';
const WEB_SCOPES =
  import.meta.env.VITE_OAUTH_SCOPE ??
  'battle-rules:admin battle-sandbox:run battle-sessions:run game-data:admin player security:admin';
let refreshInFlight: Promise<string> | null = null;

/**
 * 调用后端自定义 password grant 获取 access token。
 *
 * 玩家 Web 客户端是无 secret 的公共客户端，通过
 * x-www-form-urlencoded 传递 client_id/username/password/scope。该函数只负责协议交互，
 * token 保存和 session 加载由 AuthProvider 编排。
 */
export async function loginWithPassword(input: LoginRequest): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: PASSWORD_GRANT_TYPE,
    client_id: PUBLIC_CLIENT_ID,
    username: input.username,
    password: input.password,
    scope: WEB_SCOPES,
  });

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    throw new Error('用户名、密码或客户端凭据无效');
  }

  return response.json() as Promise<TokenResponse>;
}

/** 同一标签页中的并发 401 共享一次旋转刷新，避免旧 refresh token 被重放。 */
export function refreshAccessToken(): Promise<string> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = performRefresh().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

async function performRefresh(): Promise<string> {
  const refreshToken = readRefreshToken();
  if (!refreshToken) throw new Error('没有可用的刷新凭据');
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: PUBLIC_CLIENT_ID,
      refresh_token: refreshToken,
    }),
  });
  if (!response.ok) throw new Error('登录续期失败');
  const token = (await response.json()) as TokenResponse;
  saveAccessToken(token.access_token);
  if (token.refresh_token) saveRefreshToken(token.refresh_token);
  return token.access_token;
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

/** Best-effort 通知后端撤销当前 token family；本地凭据清理不依赖网络成功。 */
export async function revokeCurrentLogin(accessToken: string): Promise<void> {
  await fetch('/api/player/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
