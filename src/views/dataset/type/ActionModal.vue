<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { NModal, NForm, NFormItem, NInput, NButton } from 'naive-ui'

/**
 * 通用操作弹窗组件
 * @prop {boolean} visible - 弹窗显示状态
 * @prop {object} modelValue - 表单数据
 * @prop {'create' | 'edit'} mode - 弹窗模式
 * @prop {boolean} loading - 提交按钮 loading 状态
 * @emits update:visible - 控制弹窗显示
 * @emits submit - 表单提交
 */
const props = defineProps<{
  visible: boolean
  modelValue: Partial<{ internalName: string; name: string }>
  mode: 'create' | 'edit'
  loading?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void
  (e: 'submit', v: { internalName: string; name: string }): void
}>()

const form = ref({ internalName: '', name: '' })

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
const title = computed(() => (props.mode === 'create' ? '新增属性' : '编辑属性'))
</script>

<template>
  <n-modal :show="visible" preset="card" :title="title" @close="handleClose" class="max-w-md w-full">
    <n-form :model="form" label-placement="left" label-width="80">
      <n-form-item label="内部名称" path="internalName">
        <n-input v-model:value="form.internalName" placeholder="请输入内部名称" />
      </n-form-item>
      <n-form-item label="名称" path="name">
        <n-input v-model:value="form.name" placeholder="请输入名称" />
      </n-form-item>
    </n-form>
    <template #action>
      <div class="flex justify-center gap-x-4">
        <n-button @click="handleClose">取消</n-button>
        <n-button type="primary" :loading="loading" @click="handleSubmit">
          {{ mode === 'create' ? '新增' : '保存' }}
        </n-button>
      </div>
    </template>
  </n-modal>
</template>
