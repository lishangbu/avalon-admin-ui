import { isEmpty } from 'es-toolkit/compat'

import { routerEventBus } from '@/event-bus'
import { findFirstAccessibleRoutePath } from '@/router/helper'
import { useMenuStore, useTokenStore } from '@/stores'

import type { Router } from 'vue-router'

const Layout = () => import('@/layout/index.vue')

export function setupRouterGuard(router: Router) {
  const menuStore = useMenuStore()
  const tokenStore = useTokenStore()

  router.beforeEach(async (to, from) => {
    routerEventBus.emit({ type: 'beforeEach' })

    if (to.name === 'signIn') {
      if (!tokenStore.hasLogin) {
        return
      } else {
        return from.fullPath
      }
    }

    if (!tokenStore.hasLogin) {
      tokenStore.cleanup(to.fullPath)
      return
    }

    if (!router.hasRoute('layout')) {
      try {
        await menuStore.loadMenus(true)

        if (isEmpty(menuStore.userRoute)) {
          tokenStore.cleanup()
          return
        }

        const initialRedirect = findFirstAccessibleRoutePath(menuStore.userRoute)

        if (!initialRedirect) {
          tokenStore.cleanup()
          return
        }

        router.addRoute({
          path: '/',
          name: 'layout',
          component: Layout,
          redirect: initialRedirect,
          children: menuStore.userRoute,
        })

        return to.fullPath
      } catch (error) {
        console.error('Error resolving user menu or adding route:', error)
        tokenStore.cleanup()
        return
      }
    }
  })

  router.beforeResolve(() => {})

  router.afterEach(() => {
    routerEventBus.emit({ type: 'afterEach' })
  })
}
