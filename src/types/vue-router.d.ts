import type { RouteParamsGeneric } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string | (() => VNodeChild)
    icon?: string | (() => VNodeChild)
    componentName?: string
    pinned?: boolean
    showTab?: boolean
    enableMultiTab?: boolean
    withKeepAlive?: boolean
    renderTabTitle?: (params: RouteParamsGeneric) => string
  }
}
