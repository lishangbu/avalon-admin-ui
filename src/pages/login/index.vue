<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-lg bg-white rounded-lg shadow p-8">
      <div class="flex flex-col items-center mb-8">
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-md"
          style="
            background: linear-gradient(
              135deg,
              var(--n-color-primary),
              var(--n-color-primary-hover)
            );
          "
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="18" cy="18" r="18" fill="url(#avalon-logo-gradient)" />
            <text
              x="50%"
              y="58%"
              text-anchor="middle"
              fill="#fff"
              font-size="18"
              font-weight="bold"
              font-family="inherit"
              dominant-baseline="middle"
            >
              A
            </text>
            <defs>
              <linearGradient
                id="avalon-logo-gradient"
                x1="0"
                y1="0"
                x2="36"
                y2="36"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#18A058" />
                <stop offset="1" stop-color="#36AD6A" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div
          class="text-3xl font-bold text-[#18A058] tracking-wide select-none"
          style="letter-spacing: 2px"
        >
          Avalon管理平台
        </div>
      </div>
      <n-form :model="form" label-width="auto" label-placement="left">
        <n-form-item label="用户名">
          <n-input v-model:value="form.username" placeholder="请输入用户名" clearable />
        </n-form-item>
        <n-form-item label="密码">
          <n-input
            v-model:value="form.password"
            type="password"
            placeholder="请输入密码"
            clearable
          />
        </n-form-item>
        <n-form-item>
          <div class="flex justify-center w-full">
            <n-button type="primary" @click="onSubmit">登录</n-button>
          </div>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()
const route = useRoute()
// 登录表单数据
const form = ref<LoginForm>({
  username: undefined,
  password: undefined, // 密码
  grantType: 'password',
})

/**
 * 登录提交事件
 */
const onSubmit = async (): Promise<void> => {
  const message = useMessage()
  message.loading('登录中...')
  login(form.value).then((response) => {
    message.destroyAll()
    const tokenStore = useTokenStore()
    const accessToken = response.data?.accessToken
    const refreshToken = response.data?.refreshToken
    tokenStore.setAccessToken(accessToken ?? null)
    tokenStore.setRefreshToken(refreshToken ?? null)
    // 跳转逻辑
    if (route?.query?.redirect && typeof route.query.redirect === 'string') {
      const { redirect, ...restQuery } = route.query
      router.push({ path: redirect, query: restQuery })
    } else {
      router.push('/')
    }
  })
}
</script>
