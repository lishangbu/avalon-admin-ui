import { useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'

import { getUserInfo as getRemoteUserInfo } from '@/api'

import { pinia } from '.'

export const useUserStore = defineStore('user', () => {
  const user = useStorage<User | null>('user', null as User | null, localStorage, {
    serializer: {
      read: (v) => (v ? JSON.parse(v) : null),
      write: (v) => JSON.stringify(v),
    },
  })

  async function loadUser() {
    // 判断 user 是否已获取（通过 id 判断更严谨）
    if (user.value && user.value?.id) {
      return user.value
    }
    const res = await getRemoteUserInfo()
    user.value = res.data
    return user.value
  }

  function clearUser() {
    user.value = null
  }

  return {
    loadUser,
    user,
    clearUser,
  }
})

export function toRefsUserStore() {
  return {
    ...storeToRefs(useUserStore(pinia)),
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
