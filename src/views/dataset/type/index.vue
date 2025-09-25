<script lang="ts" setup>
import {
  NButton,
  NDataTable,
  NForm,
  NFormItem,
  NInput,
  NPagination,
  NSpin,
  useDialog
} from 'naive-ui'
import { h, ref } from 'vue'

import { createType, getTypePage, removeType, updateType } from '@/api/dataset/type'
import { ScrollContainer } from '@/components'
import { useCrud } from '@/composables/useCrud'
import ActionModal from './ActionModal.vue'

import type { Type } from '@/types/modules/dataset/type'

// CRUD 逻辑封装
const {
  data,
  total,
  pagination,
  loading,
  query,
  fetchPage,
  create,
  update,
  remove
} = useCrud<Type>({
  page: getTypePage,
  create: createType,
  update: updateType,
  remove: removeType
})

const dialog = useDialog()

// n-data-table 列定义
const columns = [
  {
    title: '主键',
    key: 'id',
    width: 100
  },
  {
    title: '内部名称',
    key: 'internalName'
  },
  {
    title: '名称',
    key: 'name'
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render(row: Type) {
      return [
        h(
          NButton,
          {
            size: 'small',
            onClick: () => openEditModal(row)
          },
          { default: () => '编辑' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 8px;',
            onClick: () => handleRemove(row)
          },
          { default: () => '删除' }
        )
      ]
    }
  }
]

const modalVisible = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const modalLoading = ref(false)
const modalForm = ref<Partial<Type>>({})

function openCreateModal() {
  modalMode.value = 'create'
  modalForm.value = { internalName: '', name: '' }
  modalVisible.value = true
}
function openEditModal(row: Type) {
  modalMode.value = 'edit'
  modalForm.value = { ...row }
  modalVisible.value = true
}
async function handleModalSubmit(formData: Partial<Type>) {
  modalLoading.value = true
  try {
    if (modalMode.value === 'create') {
      await create(formData)
    } else {
      await update({ ...modalForm.value, ...formData })
    }
    modalVisible.value = false
    fetchPage()
  } finally {
    modalLoading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  fetchPage()
}

function handleRemove(row: Type) {
  dialog.warning({
    title: '确认删除',
    content: `确定要删除「${row.name}」吗？`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: () => remove(row.id)
  })
}
</script>

<template>
  <ScrollContainer
    wrapper-class="flex flex-col gap-y-2"
  >
    <n-spin :show="loading">
      <div class="mb-2 flex items-center justify-between gap-x-2">
        <n-form inline :model="query" class="mb-0 flex-1">
          <n-form-item label="内部名称" path="internalName">
            <n-input v-model:value="query.internalName" placeholder="内部名称" clearable />
          </n-form-item>
          <n-form-item label="名称" path="name">
            <n-input v-model:value="query.name" placeholder="名称" clearable />
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="handleSearch">搜索</n-button>
          </n-form-item>
        </n-form>
        <n-button type="primary" @click="openCreateModal">新增</n-button>
      </div>
      <n-data-table
        :columns="columns"
        :data="data"
        :bordered="true"
        :single-line="false"
        :pagination="false"
        :row-key="row => row.id"
      />
      <div class="flex items-center justify-between mt-2">
        <span class="text-xs text-gray-500">共 {{ total }} 条</span>
        <n-pagination
          v-bind="pagination"
          :item-count="total"
        />
      </div>
      <ActionModal
        :visible="modalVisible"
        :model-value="modalForm"
        :mode="modalMode"
        :loading="modalLoading"
        @update:visible="v => (modalVisible = v)"
        @submit="handleModalSubmit"
      />
    </n-spin>
  </ScrollContainer>
</template>
