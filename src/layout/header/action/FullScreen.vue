<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useFullscreen } from '@vueuse/core'

import { ButtonAnimation } from '@/components'

const { isFullscreen, enter, exit } = useFullscreen()
</script>
<template>
  <div>
    <ButtonAnimation
      @click="isFullscreen ? exit() : enter()"
      :title="isFullscreen ? '退出全屏' : '全屏'"
    >
      <Icon :icon="isFullscreen ? 'ph:arrows-in' : 'ph:arrows-out'" />
    </ButtonAnimation>
  </div>
</template>
