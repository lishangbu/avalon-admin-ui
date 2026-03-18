import { useEventBus } from '@vueuse/core'

import { useDiscreteApi } from '@/composables'
import router from '@/router'
import { useTokenStore } from '@/stores'

import type { AxiosError } from 'axios'

export type RequestEventPayload =
  | { type: 'request' }
  | { type: 'requestError'; error: AxiosError<unknown, unknown> }
  | { type: 'response'; data: ApiResult<unknown> }
  | { type: 'responseError'; error: AxiosError<ApiResult<unknown>, unknown>; code?: number }

export const requestEventBus = useEventBus<RequestEventPayload>('request')

export function useRequestEventBus() {
  const { message: messageApi } = useDiscreteApi()
  const { cleanup } = useTokenStore()

  requestEventBus.on((event) => {
    const currentPath = router.currentRoute.value.path
    switch (event.type) {
      case 'request':
        break

      case 'requestError':
        messageApi.error(`requestError: ${event.error.message}`)
        break

      case 'response':
        if (event.data.code === 201) {
          messageApi.success(event.data.errorMessage as string)
        }

        break

      case 'responseError':
        messageApi.error(`${event.error.response?.data?.errorMessage || event.error.message}`)
        if (event.code === 401) {
          cleanup(currentPath)
        }

        break

      default:
        break
    }
  })
}
