/**
 * 通用 API 返回结构
 *
 * @template T 返回数据类型
 * @property code 响应码，通常为 0 表示成功，其他为错误码
 * @property errorMessage 错误信息，成功时为null
 * @property data 返回的数据内容
 */
declare interface ApiResult<T> {
  code: number;
  errorMessage: string | null;
  data: T;
}

/**
 * 通用分页结果类型
 *
 * @template T 分页内容的数据类型
 * @property current 当前页码（字符串格式）
 * @property pages 总页数（字符串格式）
 * @property records 当前页的数据记录数组
 * @property size 每页大小（字符串格式）
 * @property total 总记录数（字符串格式）
 */
declare interface Page<T> {
  current: string
  pages: string
  records: T[]
  size: string
  total: string
}

/**
 * 分页请求参数
 *
 * @property page 页码（从 0 开始）
 * @property size 每页数据条数
 */
declare interface PageRequest {
  current?: number;
  size?: number;
}
