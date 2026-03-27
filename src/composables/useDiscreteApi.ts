import { Icon } from '@iconify/vue'
import { zhCN, dateZhCN, createDiscreteApi } from 'naive-ui'
import { computed, h } from 'vue'

import { useTheme } from './useTheme'

import type { ConfigProviderProps } from 'naive-ui'

export function getConfigProviderProps() {
  const { theme, themeOverrides } = useTheme()

  const configProviderProps = computed<ConfigProviderProps>(() => ({
    locale: zhCN,
    dateLocale: dateZhCN,
    theme: theme.value,
    themeOverrides: themeOverrides.value,
    icons: {
      info: () => h(Icon, { icon: 'ph:info', class: 'size-full' }),
      success: () => h(Icon, { icon: 'ph:seal-check', class: 'size-full' }),
      warning: () => h(Icon, { icon: 'ph:warning', class: 'size-full' }),
      error: () => h(Icon, { icon: 'ph:smiley-x-eyes', class: 'size-full' }),
    },
  }))

  return configProviderProps
}

export function useDiscreteApi() {
  const configProviderProps = getConfigProviderProps()

  return createDiscreteApi(['message', 'dialog', 'notification', 'loadingBar', 'modal'], {
    configProviderProps,
    notificationProviderProps: {
      placement: 'bottom-left',
    },
  })
}
