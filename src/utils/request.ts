import axios, { type AxiosRequestConfig } from 'axios'

import { requestEventBus } from '@/event-bus'
import { useTokenStore } from '@/stores'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  timeout: 10_000,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const tokenStore = useTokenStore()

    if (tokenStore.hasLogin && tokenStore.accessTokenValue) {
      config.headers['Authorization'] = `Bearer ${tokenStore.accessTokenValue}`
    }
    requestEventBus.emit({ type: 'request' })
    return config
  },
  (error) => {
    requestEventBus.emit({ type: 'requestError', error })
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    requestEventBus.emit({ type: 'response', data: response.data })
    return response
  },
  (error) => {
    const code = error.response?.data?.code
    requestEventBus.emit({ type: 'responseError', error, code })
    return Promise.reject(error)
  },
)

export async function request<T = unknown>(config: AxiosRequestConfig) {
  const response = await axiosInstance.request<ApiResult<T>>(config)
  return response.data
}

export default request
