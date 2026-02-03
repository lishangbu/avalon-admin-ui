import { isEmpty } from 'es-toolkit/compat'

import { storeToRefs } from 'pinia'

import { routerEventBus } from '@/event-bus'
import { useMenuStore, useTokenStore } from '@/stores'

import type { Router } from 'vue-router'

const Layout = () => import('@/layout/index.vue')

export function setupRouterGuard(router: Router) {
  const { resolveMenuOptions } = useMenuStore()
  const { routeList } = storeToRefs(useMenuStore())

  router.beforeEach(async (to, from, next) => {
    const { hasLogin, cleanup } = useTokenStore()

    routerEventBus.emit({ type: 'beforeEach' })

    if (to.name === 'signIn') {
      if (!hasLogin) {
        next()
      } else {
        next(from.fullPath)
      }

      return false
    }

    if (!hasLogin) {
      cleanup()
      next()
      return false
    }

    if (hasLogin && !router.hasRoute('layout')) {
      try {
        await resolveMenuOptions()
        if (isEmpty(routeList.value)) {
          cleanup()
          next()
          return false
        }
        router.addRoute({
          path: '/',
          name: 'layout',
          component: Layout,
          // if you need to have a redirect when accessing / routing
          redirect: routeList?.value[0]?.path,
          children: routeList.value,
        })

        next(to.fullPath)
      } catch (error) {
        console.error('Error resolving user menu or adding route:', error)
        cleanup()
        next()
      }

      return false
    }

    next()
    return false
  })

  router.beforeResolve((_, __, next) => {
    next()
  })

  router.afterEach(() => {
    routerEventBus.emit({ type: 'afterEach' })
  })
}
