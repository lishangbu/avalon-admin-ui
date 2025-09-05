// Naive UI 独立 API 封装，支持主题切换和全局弹窗等功能
// 详见：https://www.naiveui.com/zh-CN/os-theme/components/discrete

import type { ConfigProviderProps } from 'naive-ui'
import { createDiscreteApi, darkTheme, lightTheme } from 'naive-ui'
import { computed, ref } from 'vue'

// 当前主题状态，支持 'light' 和 'dark'
const themeRef = ref<'light' | 'dark'>('light')
// 根据主题动态生成 configProviderProps
const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
  theme: themeRef.value === 'light' ? lightTheme : darkTheme,
}))

// 创建 Naive UI 独立 API 实例，包含 message、dialog、notification、loadingBar、modal
const { message, notification, dialog, loadingBar, modal } = createDiscreteApi(
  ['message', 'dialog', 'notification', 'loadingBar', 'modal'],
  {
    configProviderProps: configProviderPropsRef,
  },
)

// 全局消息弹窗
export function useMessage() {
  return message
}

// 全局通知
export function useNotification() {
  return notification
}

// 全局对话框
export function useDialog() {
  return dialog
}

// 全局加载条
export function useLoadingBar() {
  return loadingBar
}

// 全局模态框
export function useModal() {
  return modal
}

// 切换主题（明暗）
export function toggleTheme() {
  themeRef.value = themeRef.value === 'light' ? 'dark' : 'light'
}

// 设置主题
export function setTheme(theme: 'light' | 'dark') {
  themeRef.value = theme
}

// 获取当前主题
export function getTheme() {
  return themeRef.value
}
