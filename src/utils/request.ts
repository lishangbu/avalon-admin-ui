import axios from 'axios'

import { useDiscreteApi } from '@/composables'
import { useTokenStore } from '@/stores'


function createInstance() {
  const instance = axios.create({
    // 基础url
    baseURL: import.meta.env.VITE_APP_BASE_API_URL,
    // 请求超时时间
    timeout: import.meta.env.VITE_APP_BASE_API_TIMEOUT,
    withCredentials: true // 跨域请求时是否需要凭证
  })
  instance.interceptors.request.use(
    (config) => {
      const { accessTokenValue,hasLogin } = useTokenStore()
      if (hasLogin) {
        config.headers['Authorization'] = `Bearer ${accessTokenValue}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )
  instance.interceptors.response.use(
    (response) => {
      const contentType = response.headers['content-type'] || ''
      const isJson = contentType.includes('application/json')
      if (isJson) {
        const data = response.data
        // 判断是否为 ApiResult
        if (data && typeof data === 'object' && 'code' in data) {
          if (data.code === 200) {
            return data
          } else {
            return Promise.reject(data.errorMessage || '请求失败')
          }
        }
        // 不是 ApiResult，直接返回
        return data
      } else {
        // 非 JSON 响应，判断 HTTP 状态码
        if (response.status === 200) {
          return response.data
        } else {
          return Promise.reject(response.statusText || '请求失败')
        }
      }
    },
    (error) => {
      // 统一错误处理
      const errorMsg = error?.response?.data?.errorMessage || error.message || '请求异常'
      const { message } = useDiscreteApi()
      message.error(errorMsg)
      return Promise.reject(errorMsg)
    }
  )
  return instance
}

export const axiosInstance = createInstance()
