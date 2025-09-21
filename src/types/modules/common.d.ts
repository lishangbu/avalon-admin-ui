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
 * 通用分页结果类型（简化版，不包含 pageable 和 sort 字段）
 *
 * @template T 分页内容的数据类型
 * @property content 当前页的数据内容数组
 * @property totalPages 总页数
 * @property totalElements 总数据条数
 * @property last 是否为最后一页
 * @property size 每页数据条数
 * @property number 当前页码（从 0 开始）
 * @property numberOfElements 当前页数据条数
 * @property first 是否为第一页
 * @property empty 当前页是否为空
 */
declare interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: string;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

/**
 * 分页请求参数
 *
 * @property page 页码（从 0 开始）
 * @property size 每页数据条数
 */
declare interface PageRequest {
  page: number;
  size: number;
}
