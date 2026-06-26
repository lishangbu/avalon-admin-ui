import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import type { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import { appTheme } from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 20_000,
    },
  },
});

/**
 * 应用级 Provider 集合。
 *
 * Provider 顺序保持稳定：路由最外层承载导航，ConfigProvider 提供 antd 主题，
 * QueryClient 管理服务端状态，AuthProvider 管理登录态。
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <BrowserRouter>
      <ConfigProvider locale={zhCN} theme={appTheme}>
        <AntApp>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
          </QueryClientProvider>
        </AntApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}
