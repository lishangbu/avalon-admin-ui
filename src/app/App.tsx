import { App as AntApp, ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { buildThemeConfig, getThemeAlgorithm } from '@/config/theme'
import { AppRouter } from '@/router/AppRouter'
import { usePreferencesStore } from '@/store/preferences'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export function App() {
  const { themeMode, colorPrimary } = usePreferencesStore(
    useShallow((state) => ({
      themeMode: state.themeMode,
      colorPrimary: state.colorPrimary,
    })),
  )

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode
    document.documentElement.style.colorScheme = themeMode
  }, [themeMode])

  return (
    <ConfigProvider
      componentSize="middle"
      locale={zhCN}
      theme={{
        ...buildThemeConfig(themeMode, colorPrimary),
        algorithm: getThemeAlgorithm(themeMode),
      }}
    >
      <AntApp>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </QueryClientProvider>
      </AntApp>
    </ConfigProvider>
  )
}
