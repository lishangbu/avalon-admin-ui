import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import { LayoutSettingsProvider, useLayoutSettings } from './settings/LayoutSettingsProvider';
import { createAppTheme } from './theme';

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
      <LayoutSettingsProvider>
        <ThemedProviders>{children}</ThemedProviders>
      </LayoutSettingsProvider>
    </BrowserRouter>
  );
}

function ThemedProviders({ children }: PropsWithChildren) {
  const { settings } = useLayoutSettings();
  const theme = useMemo(() => createAppTheme(settings), [settings]);

  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <AntApp>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </AntApp>
    </ConfigProvider>
  );
}
