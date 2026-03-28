import { createEventHook } from '@vueuse/core'
import { ref, shallowRef } from 'vue'

export interface AsyncTaskSuccessEvent<TData, TArgs extends unknown[]> {
  args: TArgs
  data: TData
}

export interface AsyncTaskErrorEvent<TArgs extends unknown[]> {
  args: TArgs
  error: unknown
}

export interface UseAsyncTaskOptions<TData, TArgs extends unknown[]> {
  initialData?: TData
  run: (...args: TArgs) => Promise<TData>
}

export function useAsyncTask<TData, TArgs extends unknown[] = []>(
  options: UseAsyncTaskOptions<TData, TArgs>,
) {
  const data = shallowRef<TData | undefined>(options.initialData)
  const error = shallowRef<unknown>()
  const loading = ref(false)
  const successHook = createEventHook<AsyncTaskSuccessEvent<TData, TArgs>>()
  const errorHook = createEventHook<AsyncTaskErrorEvent<TArgs>>()

  let latestExecutionId = 0

  async function execute(...args: TArgs) {
    const executionId = ++latestExecutionId
    loading.value = true
    error.value = undefined

    try {
      const nextData = await options.run(...args)

      if (executionId === latestExecutionId) {
        data.value = nextData
      }

      await successHook.trigger({
        args,
        data: nextData,
      })

      return nextData
    } catch (nextError) {
      if (executionId === latestExecutionId) {
        error.value = nextError
      }

      await errorHook.trigger({
        args,
        error: nextError,
      })

      throw nextError
    } finally {
      if (executionId === latestExecutionId) {
        loading.value = false
      }
    }
  }

  function reset(nextData = options.initialData) {
    data.value = nextData
    error.value = undefined
    loading.value = false
  }

  return {
    data,
    error,
    execute,
    loading,
    onError: errorHook.on,
    onSuccess: successHook.on,
    reset,
  }
}
