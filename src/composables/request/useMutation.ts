import { useAsyncTask } from './useAsyncTask'

export interface UseMutationOptions<TResult, TArgs extends unknown[]> {
  mutation: (...args: TArgs) => Promise<TResult>
  onError?: (error: unknown, ...args: TArgs) => void | Promise<void>
  onSuccess?: (result: TResult, ...args: TArgs) => void | Promise<void>
}

export function useMutation<TResult, TArgs extends unknown[] = []>(
  options: UseMutationOptions<TResult, TArgs>,
) {
  const task = useAsyncTask<TResult, TArgs>({
    run: options.mutation,
  })

  async function mutate(...args: TArgs) {
    try {
      const result = await task.execute(...args)
      await options.onSuccess?.(result, ...args)
      return result
    } catch (error) {
      await options.onError?.(error, ...args)
      throw error
    }
  }

  return {
    data: task.data,
    error: task.error,
    loading: task.loading,
    mutate,
    onError: task.onError,
    onSuccess: task.onSuccess,
    reset: task.reset,
  }
}
