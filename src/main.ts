import './assets/main.css'

import { createApp } from 'vue'

import { setupRouterGuard } from '@/router/guard'
import { useSystemStore, pinia } from '@/stores'

import App from './App.vue'
import router from './router'

async function setupApp() {
  const app = createApp(App)

  app.use(pinia)

  app.use(router)
  setupRouterGuard(router)

  useSystemStore(pinia)

  await router.isReady()

  if (window.loaderElement) {
    window.loaderElement.remove()
    window.loaderElement = null
  }

  app.mount('#app')
}

setupApp()
