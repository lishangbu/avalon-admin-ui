<script setup lang="tsx">
import { isFunction } from 'lodash-es'
import type { MenuInst, MenuProps } from 'naive-ui'
import { NMenu, NScrollbar } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { h, ref, useTemplateRef, watch } from 'vue'

import router from '@/router'
import { toRefsPreferencesStore, useMenuStore } from '@/stores'

const { sidebarMenu } = toRefsPreferencesStore()

const { menuOptions } = storeToRefs(useMenuStore())

const menuRef = useTemplateRef<MenuInst>('menuRef')

const menuActiveKey = ref('')

const renderIcon: MenuProps['renderIcon'] = (option) => {
  return isFunction(option.icon)
    ? h(option.icon, {
        class: 'size-5',
      })
    : null
}

watch(
  () => router.currentRoute.value,
  (newRoute) => {
    menuActiveKey.value = newRoute.name as string
    menuRef.value?.showOption(menuActiveKey.value)
  },
  {
    immediate: true,
  },
)
</script>
<template>
  <NScrollbar>
    <NMenu
      ref="menuRef"
      :collapsed-width="sidebarMenu.minWidth"
      :collapsed="sidebarMenu.collapsed"
      :collapsed-icon-size="20"
      :value="menuActiveKey"
      :options="menuOptions"
      :render-icon="renderIcon"
      :dropdown-props="{
        size: 'medium',
        trigger: 'click',
      }"
    />
  </NScrollbar>
</template>
