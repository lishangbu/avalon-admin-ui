<script setup lang="ts">
import { NButton, NCard } from 'naive-ui'

import { CollapseTransition } from '@/components/collapse-transition'

interface CrudSearchPanelProps {
  createButtonDisabled?: boolean
  createButtonLabel: string
}

defineProps<CrudSearchPanelProps>()

defineSlots<{
  default(): unknown
}>()

const expanded = defineModel<boolean>('expanded', { default: false })

const emit = defineEmits<{
  create: []
}>()
</script>

<template>
  <div
    class="z-10 transition-[top]"
    :class="expanded ? 'sticky top-0' : ''"
  >
    <NCard :bordered="false">
      <div class="flex flex-wrap items-center justify-end gap-2">
        <NButton
          quaternary
          @click="expanded = !expanded"
        >
          {{ expanded ? '收起筛选' : '展开筛选' }}
        </NButton>
        <NButton
          type="primary"
          :disabled="createButtonDisabled"
          @click="emit('create')"
        >
          {{ createButtonLabel }}
        </NButton>
      </div>

      <CollapseTransition
        :display="expanded"
        direction="horizontal"
        display-directive="show"
        container-class="mb-4"
      >
        <div class="mt-4">
          <slot />
        </div>
      </CollapseTransition>
    </NCard>
  </div>
</template>
