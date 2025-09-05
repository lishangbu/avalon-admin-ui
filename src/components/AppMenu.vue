<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { MenuOption } from 'naive-ui'
import { NIcon, NMenu } from 'naive-ui'
import { computed, h } from 'vue'
import { Icon } from '@iconify/vue'

const { getMenuTree } = useMenuStore()
const router = useRouter()

// 菜单点击事件
function handleMenuClick(key: string) {
  router.push(key)
}

// 将原菜单数据转换为 Naive UI n-menu 的 options 格式
function mapMenuToOptions(menus: MenuRecord[]): MenuOption[] {
  return menus.map((item) => ({
    key: item.fullPath,
    label: item.title,
    icon: item.icon
      ? (() => h(NIcon, { size: 22 }, { default: () => h(Icon, { icon: item.icon as string }) })) as MenuOption['icon']
      : undefined,
    children:
      item.children && item.children.length > 0 ? mapMenuToOptions(item.children) : undefined,
  }))
}

// 计算菜单 options
const menuOptions = computed(() => mapMenuToOptions(getMenuTree()))
</script>
<template>
  <n-menu
    :options="menuOptions"
    :indent="24"
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :root-indent="20"
    :default-expand-all="true"
    @update:value="handleMenuClick"
  />
</template>
