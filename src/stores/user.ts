import { useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'

import { getUserInfo as getRemoteUserInfo } from '@/api'

import { pinia } from '.'

export const useUserStore = defineStore('user', () => {
  const user = useStorage<AuthUser | null>('user', null as AuthUser | null, localStorage, {
    serializer: {
      read: (v) => (v ? JSON.parse(v) : null),
      write: (v) => JSON.stringify(v),
    },
  })

  function hasPersistedUser(currentUser: AuthUser | null): currentUser is AuthUser {
    return Boolean(
      currentUser &&
      (typeof currentUser.id === 'number' ||
        (typeof currentUser.id === 'string' && currentUser.id.length > 0)),
    )
  }

  async function loadUser() {
    if (hasPersistedUser(user.value)) {
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
