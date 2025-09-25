<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { NModal, NForm, NFormItem, NInput, NButton } from 'naive-ui'

/**
 * 通用操作弹窗组件
 * @prop {boolean} visible - 弹窗显示状态
 * @prop {object} modelValue - 表单数据
 * @prop {'create' | 'edit'} mode - 弹窗模式
 * @prop {boolean} loading - 提交按钮 loading 状态
 * @prop {Array} fields - 表单项配置，包含 label、key、component 等
 * @emits update:visible - 控制弹窗显示
 * @emits submit - 表单提交
 */
const props = defineProps<{
  visible: boolean
  modelValue: Record<string, any>
  mode: 'create' | 'edit'
  loading?: boolean
  fields: { label: string; key: string; component?: string; [x: string]: any }[]
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
  { immediate: true }
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
  <n-modal :show="visible" preset="card" :title="title" @close="handleClose" class="max-w-md w-full">
    <n-form :model="form" label-placement="left" label-width="80">
      <template v-for="field in fields" :key="field.key">
        <n-form-item :label="field.label" :path="field.key">
          <component
            :is="field.component || NInput"
            v-model:value="form[field.key]"
            v-bind="field.props"
            :placeholder="field.placeholder || `请输入${field.label}`"
            v-if="field.editable !== false"
          />
          <span v-else class="text-gray-500">{{ form[field.key] }}</span>
        </n-form-item>
      </template>
    </n-form>
    <template #action>
      <div style="display: flex; justify-content: center; gap: 12px;">
        <n-button @click="handleClose">取消</n-button>
        <n-button type="primary" :loading="loading" @click="handleSubmit">
          {{ mode === 'create' ? '新增' : '保存' }}
        </n-button>
      </div>
    </template>
  </n-modal>
</template>
