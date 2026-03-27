<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useMessage, NDropdown } from 'naive-ui'
import { h } from 'vue'

import { useTokenStore } from '@/stores'

import type { DropdownProps } from 'naive-ui'

interface UserDropdownProps extends /** @vue-ignore */ DropdownProps {}

defineProps<UserDropdownProps>()

defineOptions({
  inheritAttrs: false,
})

const { cleanup } = useTokenStore()

const message = useMessage()

const userDropdownOptions = [
  {
    icon: () => h(Icon, { icon: 'ph:user', class: 'size-5' }),
    key: 'user',
    label: '个人中心',
  },
  {
    icon: () => h(Icon, { icon: 'ph:sign-out', class: 'size-5' }),
    key: 'signOut',
    label: '退出登录',
  },
]

const onUserDropdownSelected = (key: string) => {
  switch (key) {
    case 'user':
      message.info('点击了个人中心')
      break
    case 'signOut':
      cleanup()
      break
    default:
      break
  }
}
</script>
<template>
  <NDropdown
    trigger="click"
    :options="userDropdownOptions"
    show-arrow
    @select="onUserDropdownSelected"
    v-bind="$attrs"
  >
    <slot />
  </NDropdown>
</template>
