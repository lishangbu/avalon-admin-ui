export interface Page<T = unknown> {
  items: T[]
  page: number
  size: number
  totalItems: number
  totalPages: number
  hasNext: boolean
}

export interface PageRequest<T = unknown> {
  page?: number
  size?: number
  sort?: string
  query: T
}

export interface ProblemFieldError {
  field: string
  reason: string
}

export interface ProblemDetails {
  type: string
  title: string
  status: number
  detail: string
  code: string
  errors?: ProblemFieldError[]
}
