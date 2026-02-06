/**
 * 通用 API 返回结构
 *
 * @template T 返回数据类型
 * @property code 响应码，通常为 0 表示成功，其他为错误码
 * @property errorMessage 错误信息，成功时为 null
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
 * @property content 当前页的数据记录数组
 * @property empty 是否为空页
 * @property first 是否为第一页
 * @property last 是否为最后一页
 * @property number 当前页码（从 0 开始）
 * @property numberOfElements 当前页的元素数量
 * @property pageable 分页信息
 * @property size 每页大小
 * @property sort 排序信息
 * @property totalElements 总记录数（字符串格式）
 * @property totalPages 总页数
 */
declare interface Page<T> {
  content: T[]
  empty: boolean
  first: boolean
  last: boolean
  number: number
  numberOfElements: number
  pageable: Pageable
  size: number
  sort: Sort
  totalElements: string
  totalPages: number
}
/**
 * 分页信息接口
 *
 * @property offset 偏移量（字符串格式）
 * @property pageNumber 当前页码（从 0 开始）
 * @property pageSize 每页大小
 * @property paged 是否分页
 * @property sort 排序信息
 * @property unpaged 是否未分页
 */
declare interface Pageable {
  offset: string
  pageNumber: number
  pageSize: number
  paged: boolean
  sort: Sort
  unpaged: boolean
}
/**
 * 排序信息接口
 *
 * @property empty 是否为空排序
 * @property sorted 是否已排序
 * @property unsorted 是否未排序
 */
declare interface Sort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}
/**
 * 分页请求参数
 *
 * @property page 页码（从 0 开始，可选）
 * @property size 每页数据条数（可选）
 */
declare interface PageRequest {
  page?: number;
  size?: number;
}
