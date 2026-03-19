/**
 * 通用 API 返回结构
 *
 * @template T `data` 字段中的业务数据类型
 */
declare interface ApiResult<T = unknown> {
  /** 业务状态码，通常 `0` 表示成功 */
  code: number
  /** 错误信息，成功时通常为 `null` */
  errorMessage: string | null
  /** 业务数据 */
  data: T
}

/**
 * 分页响应结构
 *
 * @template T 列表项类型
 */
declare interface Page<T = unknown> {
  /** 当前页数据列表 */
  content: T[]
  /** 总记录数（后端可能返回 number，这里统一转换为 string） */
  totalElements: string
}

/**
 * 分页查询请求参数
 *
 * @template T 查询条件模型类型
 */
declare interface PageRequest<T = unknown> {
  /** 页码（从 0 开始） */
  page?: number
  /** 每页条数 */
  size?: number
  /** 排序表达式，例如 `id,asc` */
  sort?: string
  /** 业务查询条件 */
  query: T
}
