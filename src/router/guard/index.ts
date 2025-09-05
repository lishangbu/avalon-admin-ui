import type { Router } from 'vue-router'

import { setupAuthGuard } from './auth-guard'

export function createRouterGuard(router: Router) {
  setupAuthGuard(router)
}
