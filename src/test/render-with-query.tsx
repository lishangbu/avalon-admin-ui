import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import AntApp from 'antd/es/app';
import type { ReactElement } from 'react';
import { AppMessageBinder } from '../shared/feedback/message';

/**
 * 为页面测试提供独立的 React Query 容器和 antd App 上下文。
 *
 * 页面组件直接使用后端 service 和 useQuery/useMutation。测试中每次创建新的 QueryClient，
 * 可以避免缓存从一个用例泄漏到另一个用例；同时绑定 AppMessageBinder，保证 mutation
 * 成功/失败提示和真实应用一样走上下文 message，而不是回退到 antd 静态入口。
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

  return render(
    <AntApp>
      <AppMessageBinder />
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </AntApp>,
  );
}
