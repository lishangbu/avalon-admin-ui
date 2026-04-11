export const APP_NAME = import.meta.env.VITE_APP_TITLE || 'Avalon Admin'

export const STORAGE_KEYS = {
  token: 'avalon-admin-ui:token',
  user: 'avalon-admin-ui:user',
  menus: 'avalon-admin-ui:menus',
  tabs: 'avalon-admin-ui:tabs',
  preferences: 'avalon-admin-ui:preferences',
  theme: 'avalon-admin-ui:theme',
  layout: 'avalon-admin-ui:layout',
  redirect: 'avalon-admin-ui:redirect',
} as const

export const WHITE_LIST = ['/login', '/403', '/404', '/500']
