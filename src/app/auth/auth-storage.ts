export const ACCESS_TOKEN_KEY = 'avalon_admin_token';

type AccessTokenInvalidationListener = () => void;

const accessTokenInvalidationListeners = new Set<AccessTokenInvalidationListener>();

/** 从当前浏览器会话读取 Sa-Token 凭据。 */
export function readAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

/** 保存登录接口签发的 Sa-Token 凭据。 */
export function saveAccessToken(token: string): void {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}

/** 清理当前浏览器会话的登录凭据。 */
export function clearAccessToken(): void {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}

/** 仅当失败请求使用的仍是当前 token 时使其失效。 */
export function invalidateAccessToken(expectedToken: string | null): void {
  if (!expectedToken || readAccessToken() !== expectedToken) return;
  clearAccessToken();
  accessTokenInvalidationListeners.forEach((listener) => listener());
}

/** 订阅业务请求触发的 token 失效事件。 */
export function subscribeToAccessTokenInvalidation(
  listener: AccessTokenInvalidationListener,
): () => void {
  accessTokenInvalidationListeners.add(listener);
  return () => accessTokenInvalidationListeners.delete(listener);
}
