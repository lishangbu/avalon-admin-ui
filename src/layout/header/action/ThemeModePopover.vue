<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { NPopselect } from 'naive-ui'
import { computed, h } from 'vue'

import { ButtonAnimation } from '@/components'
import { toRefsPreferencesStore } from '@/stores'

import type { PopoverProps } from 'naive-ui'

interface ThemeModePopover extends /* @vue-ignore */ PopoverProps {}

defineProps<ThemeModePopover>()

defineOptions({
  inheritAttrs: false,
})

const { themeMode } = toRefsPreferencesStore()

const themeModeDropdownOptions = [
  {
    icon: () => h(Icon, { icon: 'ph:sun', class: 'size-5' }),
    iconName: 'ph:sun',
    key: 'light',
    value: 'light',
    label: '浅色模式',
  },
  {
    icon: () => h(Icon, { icon: 'ph:moon', class: 'size-5' }),
    iconName: 'ph:moon',
    key: 'dark',
    value: 'dark',
    label: '深色模式',
  },
  {
    icon: () => h(Icon, { icon: 'ph:desktop', class: 'size-5' }),
    iconName: 'ph:desktop',
    key: 'auto',
    value: 'auto',
    label: '跟随系统',
  },
]

const themeIconName = computed(
  () =>
    themeModeDropdownOptions.find((item) => item.key === themeMode.value)?.iconName || 'ph:desktop',
)

function renderSelectLabel(option: (typeof themeModeDropdownOptions)[number]) {
  return h(
    'div',
    {
      class: 'flex items-center gap-x-2',
    },
    [option.icon(), option.label],
  )
}
</script>
<template>
  <NPopselect
    class="p-0.5"
    trigger="click"
    v-bind="$attrs"
    v-model:value="themeMode"
    :options="themeModeDropdownOptions"
    :render-label="renderSelectLabel"
    :to="false"
  >
    <ButtonAnimation title="主题">
      <Icon
        :icon="themeIconName"
        class="size-5"
      />
    </ButtonAnimation>
  </NPopselect>
</template>
