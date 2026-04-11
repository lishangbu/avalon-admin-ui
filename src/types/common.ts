export type Id = number | string

export interface ApiResult<T = unknown> {
  code: number
  errorMessage: string | null
  data: T
}

export interface Page<T = unknown> {
  rows: T[]
  totalRowCount: number
  totalPageCount: number
}

export interface PageRequest<T = unknown> {
  page?: number
  size?: number
  sort?: string
  query: T
}
