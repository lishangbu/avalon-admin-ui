import createClient from 'openapi-fetch';
import { readAccessToken } from '../app/auth/auth-storage';
import { ApiError, type ApiErrorPayload, normalizeApiError } from '../shared/api/errors';
import type { paths } from './generated/schema';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiRequestOptions {
  params?: {
    query?: object;
    path?: Record<string, unknown>;
  };
  body?: unknown;
  parseAs?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'stream';
  allowEmptyResponse?: boolean;
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
  const token = readAccessToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const requestOptions = {
    ...options,
    headers,
  } as never;
  const response = (await openApiClient.request(
    method.toLowerCase() as never,
    path as never,
    requestOptions,
  )) as OpenApiFetchResult;

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
