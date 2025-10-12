<template>
  <n-select
    :options="options"
    :loading="loading"
    :disabled="disabled"
    :placeholder="placeholder"
    :value="modelValue"
    @update:value="onUpdateValue"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

import { NSelect } from 'naive-ui'

import type { SelectOption } from 'naive-ui'

import { useDictionary } from '@/composables'

interface Props {
  api: (params?: any) => Promise<any>
  modelValue?: string | number | null
  disabled?: boolean
  placeholder?: string
  labelField: string
  valueField: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const { getDictionary } = useDictionary()
const options = ref<SelectOption[]>([])
const loading = ref(false)

function fetchOptions() {
  if (!props.api) return
  loading.value = true

  getDictionary(props.api, props.valueField, props.labelField)
    .then(dict => {
      options.value = Object.entries(dict)
        .filter(([, label]) => label && label.trim() !== '')
        .map(([value, label]) => ({
          label,
          value
        }))
    })
    .catch(error => {
      console.error('加载字典数据失败:', error)
      options.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(fetchOptions)
watch(() => props.api, fetchOptions)

function onUpdateValue(val: string | number | null) {
  emit('update:modelValue', val)
}
</script>
