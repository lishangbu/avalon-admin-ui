import { storeToRefs } from 'pinia'

import { useDiscreteApi } from '@/composables'
import { toRefsPreferencesStore, useTokenStore } from '@/stores'
import { useMenuStore } from '@/stores'

import type { Router } from 'vue-router'

const Layout = () => import('@/layout/index.vue')

const { loadingBar } = useDiscreteApi()

const { showTopLoadingBar } = toRefsPreferencesStore()
const { resolveMenuOptions } = useMenuStore()
const { routeList,menuOptions } = storeToRefs(useMenuStore())

export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const { hasLogin, cleanup } = useTokenStore()

    if (showTopLoadingBar.value) {
      loadingBar.start()
    }

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
        router.addRoute({
          path: '/',
          name: 'layout',
          component: Layout,
          // if you need to have a redirect when accessing / routing
          redirect: routeList?.value[0]?.path,
          children: routeList.value
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
    if (showTopLoadingBar.value) {
      loadingBar.finish()
    }
  })
}
