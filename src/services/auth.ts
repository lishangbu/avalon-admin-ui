import { readAccessToken } from '../app/auth/auth-storage';
import type { components } from './generated/schema';

export type LoginRequest = components['schemas']['LoginRequest'];
export type LoginResponse = components['schemas']['LoginResponse'];

export type SessionResponse = components['schemas']['SessionResponse'];

/** 使用账号密码建立 Sa-Token 登录。 */
export async function loginWithPassword(input: LoginRequest): Promise<LoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error('用户名或密码错误');
  return response.json();
}

/** 读取当前登录账号、角色和权限目录。 */
export async function fetchCurrentSession(): Promise<SessionResponse> {
  const token = readAccessToken();
  const response = await fetch('/api/session', {
    headers: token ? { 'avalon-token': token } : undefined,
  });

  if (!response.ok) throw new Error('当前登录状态已失效');
  return response.json();
}

/** Best-effort 通知后端注销当前登录，本地凭据清理由 AuthProvider 负责。 */
export async function revokeCurrentLogin(token: string): Promise<void> {
  await fetch('/api/auth/logout', {
    method: 'POST',
    headers: { 'avalon-token': token },
  });
}
