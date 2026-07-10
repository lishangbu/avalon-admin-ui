export const ACCESS_TOKEN_KEY = 'avalon_admin_access_token';

type AccessTokenInvalidationListener = () => void;

const accessTokenInvalidationListeners = new Set<AccessTokenInvalidationListener>();

/**
 * 从当前浏览器会话中读取 access token。
 *
 * 这里有意使用 sessionStorage：刷新页面可恢复登录，关闭浏览器会话后自动失效，
 * 比 localStorage 更适合当前没有 refresh token 的 password grant 管理端。
 */
export function readAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * 保存后端签发的 access token。
 *
 * token 只作为调用 `/api/**` 的 Bearer 凭据，不在这里解析权限；权限统一来自
 * `/api/session`，避免前端自行解释 token claim 导致和后端判定不一致。
 */
export function saveAccessToken(token: string): void {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}

/**
 * 清理当前会话 token。
 *
 * 401、主动退出或登录失败后的恢复流程都会调用该函数，确保后续请求不再携带旧凭据。
 */
export function clearAccessToken(): void {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}

/**
 * 仅当失败请求使用的仍是当前 token 时使其失效，并通知认证上下文。
 *
 * token 比较可防止旧请求迟到的 401 清掉用户随后重新登录得到的新凭据。
 */
export function invalidateAccessToken(expectedToken: string | null): void {
  if (!expectedToken || readAccessToken() !== expectedToken) {
    return;
  }

  clearAccessToken();
  accessTokenInvalidationListeners.forEach((listener) => listener());
}

/**
 * 订阅业务请求触发的 token 失效事件。
 */
export function subscribeToAccessTokenInvalidation(
  listener: AccessTokenInvalidationListener,
): () => void {
  accessTokenInvalidationListeners.add(listener);
  return () => accessTokenInvalidationListeners.delete(listener);
}
