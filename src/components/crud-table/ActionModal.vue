<script lang="ts" setup>
import type { Component } from 'vue'
import { computed, ref, watch } from 'vue'
import { NForm, NFormItemGi, NGrid, NInput, NModal } from 'naive-ui'
import type { FormOptions } from '@/components'

/**
 * 通用操作弹窗组件
 * @prop {boolean} visible - 弹窗显示状态
 * @prop {object} modelValue - 表单数据
 * @prop {'create' | 'edit'} mode - 弹窗模式
 * @prop {boolean} loading - 提交按钮 loading 状态
 * @prop {Array} formOption - 表单项配置，包含 label、key、component 等
 * @emits update:visible - 控制弹窗显示
 * @emits submit - 表单提交
 */
const props = defineProps<{
  formOption: FormOptions
  visible: boolean
  modelValue: Record<string, any>
  mode: 'create' | 'edit'
  loading?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void
  (e: 'submit', v: Record<string, any>): void
}>()

const form = ref<Record<string, any>>({})

watch(
  () => props.visible,
  (v) => {
    if (v) {
      form.value = { ...props.modelValue }
    }
  },
  { immediate: true },
)

function handleClose() {
  emit('update:visible', false)
}
function handleSubmit() {
  emit('submit', { ...form.value })
}
const title = computed(() => (props.mode === 'create' ? '新增' : '编辑'))
</script>

<template>
  <n-modal
    :show="visible"
    preset="dialog"
    :title="title"
    @close="handleClose"
    @negativeClick="handleClose"
    @positiveClick="handleSubmit"
    :positive-text="mode === 'create' ? '新增' : '保存'"
    negative-text="取消"
  >
    <n-form
      label-placement="left"
      label-width="80"
      :model="form"
      v-bind="formOption?.formProps"
    >
      <n-grid
        :cols="formOption?.formItemProps?.length > 4 ? 2 : 1"
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
      </n-grid>
    </n-form>
  </n-modal>
</template>
