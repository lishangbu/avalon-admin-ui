export interface ApiErrorPayload {
  code?: string;
  message?: string;
  field?: string;
  matchId?: string;
}

/**
 * 管理端统一错误类型。
 *
 * 后端系统 API 返回稳定的 code/message/field，页面层可以根据 field 做表单定位，
 * 也可以用 message 做通知展示。
 */
export class ApiError extends Error {
  readonly code?: string;

  readonly field?: string;

  readonly matchId?: string;

  constructor(payload: ApiErrorPayload) {
    super(payload.message ?? '请求处理失败');
    this.name = 'ApiError';
    this.code = payload.code;
    this.field = payload.field;
    this.matchId = payload.matchId;
  }
}

/**
 * 将未知错误归一化为 ApiError，减少页面中重复的 instanceof 和字段判断。
 */
export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (isApiErrorPayload(error)) {
    return new ApiError(error);
  }

  if (error instanceof Error) {
    return new ApiError({ message: error.message });
  }

  return new ApiError({ message: '请求处理失败' });
}

function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  return typeof value === 'object' && value !== null && ('message' in value || 'code' in value);
}
