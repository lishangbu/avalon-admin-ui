import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

import { getUserInfo as getRemoteUserInfo } from '@/api/user'

import type { User } from '@/types/modules/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>()

  async function getUserInfo() {
    // 判断 user 是否已获取（通过 id 判断更严谨）
    if (user.value && user.value?.id) {
      return user.value
    }
    const res = await getRemoteUserInfo()
    user.value = res.data
    return user.value
  }

  return {
    getUserInfo
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
