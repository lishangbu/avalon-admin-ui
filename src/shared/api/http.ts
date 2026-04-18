import axios, { type AxiosError } from 'axios'
import { message } from 'antd'
import { STORAGE_KEYS } from '@/config/app'
import type { ProblemDetails } from '@/types/common'

export const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  timeout: 10_000,
})

export type RequestConfig = Parameters<typeof http.request>[0] & {
  skipErrorMessage?: boolean
  skipAuthRefresh?: boolean
  _retry?: boolean
}

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token)

  if (token && !config.headers?.Authorization) {
    config.headers.Authorization = `Bearer ${readStoredString(token)}`
  }

  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const retryResponse = axios.isAxiosError(error)
      ? await retryWithRefreshedToken(error)
      : null

    if (retryResponse) {
      return retryResponse
    }

    const config = error.config as RequestConfig | undefined

    if (!config?.skipErrorMessage) {
      message.error(getErrorMessage(error) || '网络异常')
    }

    return Promise.reject(error)
  },
)

export async function request<T>(config: RequestConfig) {
  const response = await http.request<T>(config)
  return response.data
}

function readStoredString(value: string) {
  try {
    return JSON.parse(value) as string
  } catch {
    return value
  }
}

export function isProblemDetails(payload: unknown): payload is ProblemDetails {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    typeof (payload as Partial<ProblemDetails>).type === 'string' &&
    typeof (payload as Partial<ProblemDetails>).title === 'string' &&
    typeof (payload as Partial<ProblemDetails>).status === 'number' &&
    typeof (payload as Partial<ProblemDetails>).detail === 'string' &&
    typeof (payload as Partial<ProblemDetails>).code === 'string'
  )
}

function getErrorMessage(error: AxiosError | Error) {
  if (!axios.isAxiosError(error)) {
    return error.message
  }

  const data = error.response?.data
  if (isProblemDetails(data)) {
    return data.detail || data.title || data.code
  }

  return error.message
}

async function retryWithRefreshedToken(error: AxiosError) {
  const config = error.config as RequestConfig | undefined

  if (
    !config ||
    config._retry === true ||
    config.skipAuthRefresh === true ||
    error.response?.status !== 401 ||
    !localStorage.getItem(STORAGE_KEYS.refreshToken)
  ) {
    return null
  }

  config._retry = true

  const { useAuthStore } = await import('@/store/auth')
  const nextToken = await useAuthStore.getState().refreshSession()

  if (!nextToken) {
    return null
  }

  config.headers = config.headers ?? {}
  config.headers.Authorization = `Bearer ${nextToken}`

  return http.request(config)
}
