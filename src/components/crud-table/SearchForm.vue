<script lang="ts" setup>
import { NButton, NForm, NFormItemGi, NGrid, NGridItem, NInput } from 'naive-ui'
import type { Component } from 'vue'
import { ref } from 'vue'

import type { FormOptions } from '@/components'

/**
 * 通用查询表单组件
 * @prop {Array} formOption - 查询项配置，包含 label、key、component、props、placeholder 等
 * @emits search - 查询事件，点击查询按钮时触发，参数为当前表单值
 */
defineProps<{
  formOption?: FormOptions
}>()

const emit = defineEmits<{
  (e: 'search', v: Record<string, any>): void
}>()

const form = ref<Record<string, any>>({})

const loading = ref(false)

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
  <n-form
    :model="form"
    class="mb-0 flex-1"
    @keyup.enter="handleSearch"
    label-placement="left"
    v-bind="formOption?.formProps"
  >
    <n-grid
      :cols="4"
      x-gap="8"
      y-gap="4"
      v-bind="formOption?.gridProps"
    >
      <template
        v-for="(field, idx) in formOption?.formItemProps"
        :key="field.path || idx"
      >
        <n-form-item-gi
          v-bind="field"
          :label="field.label"
          :path="field.path"
          :span="field?.span ?? 1"
          :offset="field?.offset ?? 0"
          :suffix="field?.suffix ?? false"
        >
          <component
            :is="field.component || NInput"
            v-model:value="form[String(field.path)]"
            v-bind="field.componentProps"
            clearable
          />
        </n-form-item-gi>
      </template>
      <n-grid-item suffix>
        <n-button
          type="primary"
          :loading="loading"
          @click="handleSearch"
          >搜索</n-button
        >
        <n-button
          @click="handleReset"
          :disabled="loading"
          >重置</n-button
        >
      </n-grid-item>
    </n-grid>
  </n-form>
</template>
