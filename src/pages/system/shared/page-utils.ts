export interface BackendPageLike<T> {
  rows?: T[];
  totalRowCount?: number;
}

export type JsonObject = Record<string, unknown>;

/**
 * 后端分页对象的行提取。
 *
 * OpenAPI 类型里 rows 是可选字段，页面表格必须始终拿到数组，避免加载空页时 Table 收到 undefined。
 */
export function toPageRows<T>(page: BackendPageLike<T> | undefined): T[] {
  return page?.rows ?? [];
}

/**
 * 后端分页对象的总数提取。
 *
 * totalRowCount 在服务端异常或空响应兜底场景可能缺失；页面用 0 兜底，避免分页器显示 NaN。
 */
export function toPageTotal<T>(page: BackendPageLike<T> | undefined): number {
  return Number(page?.totalRowCount ?? 0);
}

/**
 * 将服务端 OffsetDateTime 字符串格式化为本地可读时间。
 *
 * 后端统一返回 ISO 字符串；前端只负责展示，不在这里做业务时区换算。
 */
export function formatDateTime(value?: string | null): string {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('zh-CN', {
    hour12: false,
  });
}

/**
 * 解析表单里的 JSON payload。
 *
 * 定时任务和手动触发接口只接受 JSON object；数组、字符串或数字虽然是合法 JSON，
 * 但不符合后端 payload 语义，因此在提交前直接给出清晰错误。
 */
export function parseJsonObject(text: string): JsonObject {
  try {
    const value = JSON.parse(text) as unknown;
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('JSON 必须是对象');
    }
    return value as JsonObject;
  } catch (error) {
    if (error instanceof Error && error.message === 'JSON 必须是对象') {
      throw error;
    }
    throw new Error('JSON 格式不正确', { cause: error });
  }
}

/**
 * 将对象转换成多行 JSON 文本，供表单回填使用。
 */
export function stringifyJsonObject(value: unknown): string {
  return JSON.stringify(value ?? {}, null, 2);
}
