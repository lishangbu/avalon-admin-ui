import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  fetchCurrentSession,
  loginWithPassword,
  type LoginRequest,
  type SessionResponse,
} from '../../services/auth';
import {
  clearAccessToken,
  readAccessToken,
  saveAccessToken,
  subscribeToAccessTokenInvalidation,
} from './auth-storage';

export type AuthStatus = 'loading' | 'anonymous' | 'authenticated';

export interface AuthContextValue {
  status: AuthStatus;
  session: SessionResponse | null;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => void;
  reloadSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * 认证上下文 Provider。
 *
 * 该组件集中编排 token 存储、password grant 登录和 `/api/session` 恢复。页面不直接读取
 * sessionStorage，避免多个地方对 token 生命周期作出不同判断。
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(() =>
    readAccessToken() ? 'loading' : 'anonymous',
  );
  const [session, setSession] = useState<SessionResponse | null>(null);

  const logout = useCallback(() => {
    clearAccessToken();
    setSession(null);
    setStatus('anonymous');
  }, []);

  const reloadSession = useCallback(async () => {
    const token = readAccessToken();
    if (!token) {
      setStatus('anonymous');
      setSession(null);
      return;
    }

    setStatus('loading');
    try {
      const nextSession = await fetchCurrentSession();
      if (readAccessToken() !== token) {
        return;
      }
      setSession(nextSession);
      setStatus('authenticated');
    } catch {
      // session 失败通常表示 token 过期或被后端撤销，必须立即清理旧凭据。
      if (readAccessToken() === token) {
        logout();
      }
    }
  }, [logout]);

  const login = useCallback(
    async (request: LoginRequest) => {
      const tokenResponse = await loginWithPassword(request);
      saveAccessToken(tokenResponse.access_token);
      await reloadSession();
    },
    [reloadSession],
  );

  useEffect(() => subscribeToAccessTokenInvalidation(logout), [logout]);

  useEffect(() => {
    void reloadSession();
  }, [reloadSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      login,
      logout,
      reloadSession,
    }),
    [login, logout, reloadSession, session, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * 读取认证上下文。
 *
 * 如果组件没有被 AuthProvider 包裹，直接抛错能让开发阶段尽快发现 provider 缺失。
 */
export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}
