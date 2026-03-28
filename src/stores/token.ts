import { useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed } from 'vue'

import { login as remoteLogin, logout as remoteLogout } from '@/api/token'
import { useDiscreteApi } from '@/composables'
import router from '@/router'

import { pinia, useMenuStore, useUserStore } from '.'

export const useTokenStore = defineStore('token', () => {
  // token 信息
  const tokenInfo = useStorage('tokenInfo', null as TokenInfo | null, localStorage, {
    serializer: {
      read: (v) => (v ? JSON.parse(v) : null),
      write: (v) => JSON.stringify(v),
    },
  })

  // 获取 accessToken 的值
  const accessTokenValue = computed(() => tokenInfo.value?.access_token)

  // 是否已登录
  const hasLogin = computed(() => {
    return Boolean(tokenInfo.value && tokenInfo.value?.access_token)
  })

  // 设置 token 信息
  function setTokenInfo(info: TokenInfo | null) {
    tokenInfo.value = info
  }

  async function login(loginForm: LoginForm) {
    const res = await remoteLogin(loginForm)
    setTokenInfo(res.data)
    await useUserStore().loadUser()
    await useMenuStore().loadMenus(true)
  }

  // 登出操作
  function logout() {
    remoteLogout().then(() => {
      cleanup()
      router
        .push({
          name: 'signIn',
        })
        .then(() => {
          const { message } = useDiscreteApi()
          message.success('您已成功登出')
        })
        .catch(() => {
          cleanup()
        })
    })
  }

  // 清理 token 并重定向
  function cleanup(redirectPath?: string) {
    router.replace({
      name: 'signIn',
      ...(redirectPath ? { query: { r: redirectPath } } : {}),
    })
    setTokenInfo(null)
    useUserStore().clearUser()
    useMenuStore().clearMenus()
    if (router.hasRoute('layout')) {
      router.removeRoute('layout')
    }
  }

  return {
    tokenInfo,
    accessTokenValue,
    hasLogin,
    login,
    logout,
    cleanup,
  }
})

export function toRefsTokenStore() {
  return {
    ...storeToRefs(useTokenStore(pinia)),
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTokenStore, import.meta.hot))
}
