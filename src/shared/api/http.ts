import axios from 'axios'
import { message } from 'antd'
import { STORAGE_KEYS } from '@/config/app'
import { useAuthStore } from '@/store/auth'
import type { ApiResult } from '@/types/common'

export const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  timeout: 10_000,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token)

  if (token && !config.headers?.Authorization) {
    config.headers.Authorization = `Bearer ${JSON.parse(token)}`
  }

  return config
})

http.interceptors.response.use(
  (response) => {
    const payload = response.data as ApiResult

    if (typeof payload?.code === 'number' && payload.code !== 200) {
      message.error(payload.errorMessage || '请求失败')
      return Promise.reject(payload)
    }

    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
    } else {
      message.error(
        error.response?.data?.errorMessage || error.message || '网络异常',
      )
    }

    return Promise.reject(error)
  },
)

export async function request<T>(config: Parameters<typeof http.request>[0]) {
  const response = await http.request<ApiResult<T>>(config)
  return response.data
}
