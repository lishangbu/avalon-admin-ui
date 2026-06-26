import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

/**
 * 为页面测试提供独立的 React Query 容器。
 *
 * 页面组件直接使用后端 service 和 useQuery/useMutation。测试中每次创建新的 QueryClient，
 * 可以避免缓存从一个用例泄漏到另一个用例，保证断言只反映当前 mock 数据。
 */
export function renderWithQuery(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}
