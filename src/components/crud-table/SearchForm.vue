<script lang="ts" setup>
import { NForm, NFormItem, NInput, NButton } from 'naive-ui'
import { ref } from 'vue'

/**
 * 通用查询表单组件
 * @prop {Array} fields - 查询项配置，包含 label、key、component、props、placeholder 等
 * @prop {boolean} loading - 查询按钮 loading 状态
 * @emits search - 查询事件，点击查询按钮时触发，参数为当前表单值
 */
defineProps<{
  fields: { label: string; key: string; component?: string; props?: Record<string, any>; placeholder?: string }[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'search', v: Record<string, any>): void
}>()

const form = ref<Record<string, any>>({})

function handleSearch() {
  emit('search', { ...form.value })
}

function handleReset() {
  // 清空所有字段
  for (const key of Object.keys(form.value)) {
    form.value[key] = ''
  }
  emit('search', { ...form.value })
}
</script>

<template>
  <n-form inline :model="form" class="mb-0 flex-1" @keyup.enter="handleSearch">
    <template v-for="field in fields" :key="field.key">
      <n-form-item :label="field.label" :path="field.key">
        <component
          :is="field.component || NInput"
          v-model:value="form[field.key]"
          v-bind="field.props"
          :placeholder="field.placeholder || `请输入${field.label}`"
          clearable
        />
      </n-form-item>
    </template>
    <n-form-item>
      <div style="display: flex; gap: 12px; align-items: center;">
        <n-button type="primary" :loading="loading" @click="handleSearch">搜索</n-button>
        <n-button @click="handleReset" :disabled="loading">重置</n-button>
      </div>
    </n-form-item>
  </n-form>
</template>
