import { defineStore } from 'pinia'

/**
 * 管理 accessToken 和 refreshToken，支持持久化和清除
 * options API 写法
 */
export const useTokenStore = defineStore('token', {
  state: () => ({
    accessToken: null as AccessToken | null,
    refreshToken: null as RefreshToken | null,
  }),
  getters: {
    /**
     * 只读 accessToken
     */
    accessTokenValue: (state) => state.accessToken?.tokenValue ?? null,
    /**
     * 只读 refreshToken
     */
    refreshTokenValue: (state) => state.refreshToken?.tokenValue ?? null,
  },
  actions: {
    /**
     * 设置 accessToken
     */
    setAccessToken(val: AccessToken | null) {
      this.accessToken = val
    },
    /**
     * 设置 refreshToken
     */
    setRefreshToken(val: RefreshToken | null) {
      this.refreshToken = val
    },
    /**
     * 清除所有 token
     */
    clearToken() {
      this.accessToken = null
      this.refreshToken = null
    },
  },
  persist: true,
})
