import { defineStore } from 'pinia'

/**
 * 用户信息 Store
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    /** 用户信息 */
    userInfo: null as UserInfo | null,
  }),
  actions: {
    async getCurrentUser() {
      if (this.userInfo != null) {
        return this.userInfo
      } else {
        const response = await getUserInfo()
        const data = response?.data
        if (data) {
          this.setUserInfo(data)
        }
        return data
      }
    },

    /**
     * 设置用户信息
     * @param user 用户信息对象
     */
    setUserInfo(user: UserInfo) {
      this.userInfo = user
    },
  },
  persist: true,
})
