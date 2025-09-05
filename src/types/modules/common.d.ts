export interface ApiResult<T> {
  code: number
  data?: T
  errorMessage?: string
}

export interface SelectOption<K, V> {
  label: K
  value: V
}

export interface MenuRecord {
  title: string
  name: string
  path: string
  fullPath: string
  showInMenu?: boolean
  icon?: string
  children?: MenuRecord[]
}
