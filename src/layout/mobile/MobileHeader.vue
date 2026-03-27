<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

import { ButtonAnimation } from '@/components'
import AppLogo from '@/components/AppLogo.vue'
import { useInjection } from '@/composables'
import { layoutInjectionKey } from '@/injection'
import router from '@/router'
import { resolveDynamicIconName } from '@/utils/icon'

const { layoutSlideDirection, setLayoutSlideDirection } = useInjection(layoutInjectionKey)

const routeIconName = computed(() => resolveDynamicIconName(router.currentRoute.value.meta.icon))
</script>
<template>
  <header
    class="flex items-center justify-between border-b border-naive-border bg-naive-card px-4 py-2 transition-[background-color,border-color]"
    :class="{
      'rounded-t-xl': layoutSlideDirection,
    }"
  >
    <div
      class="size-9"
      @click.stop="setLayoutSlideDirection('right')"
    >
      <AppLogo />
    </div>
    <div class="flex items-center gap-x-2">
      <Icon
        v-if="routeIconName"
        :icon="routeIconName"
        class="size-6"
      />
      <span class="text-base">{{ router.currentRoute.value.meta.title }}</span>
    </div>
    <div class="flex items-center gap-x-2">
      <ButtonAnimation
        size="large"
        @click="setLayoutSlideDirection('left')"
      >
        <Icon icon="ph:list" />
      </ButtonAnimation>
    </div>
  </header>
</template>
