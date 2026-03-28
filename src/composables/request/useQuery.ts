import { tryOnMounted } from '@vueuse/core'
import { computed } from 'vue'

import { useAsyncTask } from './useAsyncTask'

export interface UseQueryOptions<TData> {
  immediate?: boolean
  initialData?: TData
  query: () => Promise<TData>
}

export function useQuery<TData>(options: UseQueryOptions<TData>) {
  const task = useAsyncTask<TData>({
    initialData: options.initialData,
    run: options.query,
  })

  function refresh() {
    return task.execute()
  }

  tryOnMounted(() => {
    if (options.immediate !== false) {
      void refresh()
    }
  })

  return {
    data: computed(() => task.data.value ?? options.initialData),
    error: task.error,
    loading: task.loading,
    onError: task.onError,
    onSuccess: task.onSuccess,
    refresh,
    reset: task.reset,
  }
}
