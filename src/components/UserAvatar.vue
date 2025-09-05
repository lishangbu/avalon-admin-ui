<template>
  <n-dropdown :options="options" @select="handleSelect">
    <div class="flex items-center">
      <div v-if="userInfo != null" class="flex items-center">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center bg-[#18A058] text-white text-base font-bold"
        >
          {{ userInfo.username ? userInfo.username.charAt(0).toUpperCase() : '' }}
        </div>
        <span class="pr-5 px-2 text-base">{{ userInfo.username }}</span>
      </div>
    </div>
  </n-dropdown>
</template>

<script setup lang="ts">
import { logout } from '@/api/auth/oauth2.js'

const router = useRouter()
const userStore = useUserStore()
const userInfo = ref(null)

onMounted(async () => {
  await nextTick()
  userInfo.value = await userStore.getCurrentUser()
})

const options = reactive([
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h('i', { class: 'i-mdi:exit-to-app text-14' }),
  },
])

function handleSelect(key) {
  switch (key) {
    case 'logout':
      useDialog().create({
        title: '提示',
        type: 'info',
        content: '确认退出？',
        negativeText: '再等等',
        positiveText: '立即退出',
        onPositiveClick: async () => {
          try {
            await logout()
            useMessage().success('已退出登录')
            await router.push('/login')
          } catch (error) {
            console.error(error)
          }
        },
      })
      break
  }
}
</script>
