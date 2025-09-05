import type { Router } from 'vue-router'

export function setupAuthGuard(router: Router) {
  router.beforeEach(async (to) => {
    if (to?.meta?.noAuth ?? false) {
      // 不需要权限验证的路由，直接放行
      return true
    }
    const accessTokenValue = useTokenStore().accessTokenValue ?? null
    if (accessTokenValue == null) {
      if (to.path !== '/login') {
        // 没有 accessToken，跳转到登录页,并携带重定向信息
        return { path: 'login', query: { ...to.query, redirect: to.path } }
      }
    }
    return true
  })
}
