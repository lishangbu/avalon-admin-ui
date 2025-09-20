import type { RouteParamsGeneric } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    componentName?: string
    pinned?: boolean
    showTab?: boolean
    enableMultiTab?: boolean
    withKeepAlive?: boolean
    renderTabTitle?: (params: RouteParamsGeneric) => string
  }
}
