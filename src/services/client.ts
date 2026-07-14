import createClient from 'openapi-fetch';
import { invalidateAccessToken, readAccessToken } from '../app/auth/auth-storage';
import { ApiError, type ApiErrorPayload, normalizeApiError } from '../shared/api/errors';
import type { paths } from './generated/schema';
import {
  clearTrainerSessionCredential,
  readTrainerSessionCredential,
} from '../app/auth/trainer-session-storage';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiRequestOptions {
  params?: {
    query?: object;
    path?: Record<string, unknown>;
  };
  body?: unknown;
  parseAs?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'stream';
  allowEmptyResponse?: boolean;
  requiresTrainerSession?: boolean;
}

export type ApiRequest = <T>(
  method: HttpMethod,
  path: string,
  options?: ApiRequestOptions,
) => Promise<T>;

interface OpenApiFetchResult {
  data?: unknown;
  error?: unknown;
  response: Response;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';

/**
 * openapi-fetch 原始客户端。
 *
 * 这里保留生成类型的边界，所有实际页面调用都经过 apiRequest 包装，以便统一 token、
 * 错误归一化和空响应处理。
 */
export const openApiClient = createClient<paths>({
  baseUrl: apiBaseUrl === '/api' ? '' : apiBaseUrl.replace(/\/api$/, ''),
  fetch: (request: Request) => globalThis.fetch(request),
});

/**
 * typed API 统一请求入口。
 *
 * openapi-fetch 的泛型对调用点很严格；系统 service 已经固定了路径和参数结构，因此这里集中做
 * 一次窄化，换取页面层清晰的资源 API。后端错误体会被转换成 ApiError。
 */
export const apiRequest: ApiRequest = async <T>(
  method: HttpMethod,
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  const { requiresTrainerSession, ...requestOptions } = options;
  const trainerCredential = requiresTrainerSession ? readTrainerSessionCredential() : null;
  if (requiresTrainerSession && !trainerCredential) {
    throw new ApiError({ code: 'trainer-session.required', message: '请先选择 Trainer' });
  }
  const execute = async (token: string | null) =>
    (await openApiClient.request(
      method.toLowerCase() as never,
      path as never,
      {
        ...requestOptions,
        headers: {
          ...(token ? { 'avalon-token': token } : {}),
          ...(trainerCredential ? { 'X-Trainer-Session': trainerCredential } : {}),
        },
      } as never,
    )) as OpenApiFetchResult;
  const token = readAccessToken();
  const response = await execute(token);

  rejectInvalidTrainerSession(response, Boolean(requiresTrainerSession));

  if (response.response.status === 401) {
    invalidateAccessToken(token);
    throw normalizeApiError(
      response.error ?? {
        code: 'authentication.required',
        message: '当前登录态已失效',
      },
    );
  }

  if (response.error) {
    throw normalizeApiError(response.error as ApiErrorPayload);
  }

  if (response.response.status === 204) {
    return undefined as T;
  }

  if (response.data === undefined && options.allowEmptyResponse) {
    return undefined as T;
  }

  if (response.data === undefined) {
    throw new ApiError({ message: '后端响应为空' });
  }

  return response.data as T;
};

function rejectInvalidTrainerSession(
  response: OpenApiFetchResult,
  requiresTrainerSession: boolean,
): void {
  if (
    response.response.status !== 401 ||
    !requiresTrainerSession ||
    typeof response.error !== 'object' ||
    response.error === null ||
    !('code' in response.error) ||
    response.error.code !== 'trainer-session.invalid'
  ) {
    return;
  }
  clearTrainerSessionCredential();
  throw normalizeApiError(response.error);
}
