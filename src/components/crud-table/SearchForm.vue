<script lang="ts" setup>
import { NForm, NFormItem, NInput, NButton, NGrid, NFormItemGi } from 'naive-ui'
import { ref } from 'vue'
import type { Component } from 'vue'

/**
 * 通用查询表单组件
 * @prop {Array} fields - 查询项配置，包含 label、key、component、props、placeholder 等
 * @prop {boolean} loading - 查询按钮 loading 状态
 * @emits search - 查询事件，点击查询按钮时触发，参数为当前表单值
 */
defineProps<{
  fields: { label: string; key: string; component?: string | Component; props?: Record<string, any>; placeholder?: string }[]
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
    <n-grid :cols="5" x-gap="8" y-gap="4">
      <template v-for="(field, idx) in fields" :key="field.key">
        <n-form-item-gi :label="field.label" :path="field.key">
          <component
            :is="field.component || NInput"
            v-model:value="form[field.key]"
            v-bind="field.props"
            :placeholder="field.placeholder || `请输入${field.label}`"
            clearable
          />
          <!-- 如果条件数量是5的倍数且当前是最后一个条件项，按钮追加在最后一个条件项后 -->
          <template v-if="idx === fields.length - 1 && fields.length % 5 === 0">
            <n-button type="primary" :loading="loading" @click="handleSearch">搜索</n-button>
            <n-button @click="handleReset" :disabled="loading">重置</n-button>
          </template>
        </n-form-item-gi>
      </template>
      <!-- 如果条件数量不是5的倍数，按钮单独占一格 -->
      <n-form-item-gi v-if="fields.length % 5 !== 0">
        <n-button type="primary" :loading="loading" @click="handleSearch">搜索</n-button>
        <n-button @click="handleReset" :disabled="loading">重置</n-button>
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>
