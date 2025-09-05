import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'
import { createClientTokenAuthentication } from 'alova/client'

function isApiResult<T>(obj: ApiResult<T>): obj is ApiResult<T> {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.hasOwnProperty('code') &&
    obj.hasOwnProperty('data') &&
    obj.hasOwnProperty('errorMessage')
  )
}

const { onAuthRequired, onResponseRefreshToken } = createClientTokenAuthentication({
  login() {
    console.debug('不进行处理，交给登录页面处理')
  },
  assignToken: (method) => {
    debugger
    const accessTokenValue = useTokenStore().accessTokenValue ?? null
    if (accessTokenValue != null) {
      method.config.headers.Authorization = ('Bearer ' + accessTokenValue) as string
    }
  },
  logout() {
    useTokenStore().clearToken()
  },
})

export const alovaInstance = createAlova({
  baseURL: '/api',
  // 请求超时时间，单位为毫秒，默认为0，表示永不超时
  timeout: 30 * 1000,
  requestAdapter: adapterFetch(),
  statesHook: VueHook,

  beforeRequest: onAuthRequired(() => {
    // ...原请求前拦截器
  }),

  responded: onResponseRefreshToken({
    /**
     * 请求成功的拦截器
     * 返回 ApiResult<T> 或原始 json
     */
    onSuccess: async <T>(response: Response): Promise<ApiResult<T> | T> => {
      response = response.clone()
      const contentType = response.headers.get('content-type') || ''
      const isJson = contentType.includes('application/json')
      if (isJson) {
        const result = await response.json()
        if (isApiResult(result)) {
          if (result.code !== 200) {
            useMessage().error(result.errorMessage || '未知错误,请联系管理员')
          }
        }
        return result
      } else {
        if (response.status !== 200) {
          useMessage().error(`HTTP错误: ${response.status}`)
        }
        // 非 JSON 响应直接返回
        return (await response) as T
      }
    },
  }),
})
