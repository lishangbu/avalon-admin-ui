<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { NButton, NDataTable, NPagination, useDialog } from 'naive-ui'

import type { Component } from 'vue'

import { useCrud } from '@/composables/useCrud'

import ActionModal from './ActionModal.vue'
import SearchForm from './SearchForm.vue'

/**
 * 通用 CRUD 表格组件
 * @prop {Array} columns - 表格列配置
 * @prop {Array} fields - 表单项配置
 * @prop {Array} searchFields - 查询表单项配置
 * @prop {Function} page - 获取分页数据的方法
 * @prop {Function} create - 新增数据方法
 * @prop {Function} update - 更新数据方法
 * @prop {Function} remove - 删除数据方法
 */
const props = defineProps<{
  columns: any[]
  fields: { label: string; key: string; component?: string | Component; [x: string]: any }[]
  searchFields?: {
    label: string
    key: string
    component?: string | Component
    props?: Record<string, any>
    placeholder?: string
  }[]
  page: (params: any) => Promise<any>
  create: (data: any) => Promise<any>
  update: (data: any) => Promise<any>
  remove: (id: string | number) => Promise<any>
}>()

const {
  data,
  loading,
  fetchPage,
  create,
  update,
  remove,
  query,
  total,
  pagination
} = useCrud({
  page: props.page,
  create: props.create,
  update: props.update,
  remove: props.remove
})

const dialog = useDialog()
const modalVisible = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const modalLoading = ref(false)
const currentRow = ref<any>({})
const showSearchForm = ref(false)

function handleCreate() {
  modalMode.value = 'create'
  currentRow.value = {}
  modalVisible.value = true
}

function handleEdit(row: any) {
  modalMode.value = 'edit'
  currentRow.value = { ...row }
  modalVisible.value = true
}

function handleDelete(row: any) {
  dialog.warning({
    title: '确认删除',
    content: `确定要删除ID为「${row.id}」的数据吗？`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      await remove(row.id)
      fetchPage()
    }
  })
}

function handleModalSubmit(data: any) {
  modalLoading.value = true
  const action = modalMode.value === 'create' ? create : update
  action(data)
    .then(() => {
      modalVisible.value = false
      fetchPage()
    })
    .finally(() => {
      modalLoading.value = false
    })
}

/**
 * 处理搜索事件
 * @param searchParams 搜索表单传递的参数
 */
function handleSearch(searchParams: Record<string, any>) {
  // 清空旧的查询参数
  Object.keys(query).forEach(key => {
    delete query[key]
  })
  // 设置新的查询参数，watch 会自动触发数据请求
  Object.assign(query, searchParams)
}

const tableColumns = computed(() => [
  ...props.columns,
  {
    title: '操作',
    key: 'actions',
    width: 120,
    align: 'center',
    render(row: any) {
      return h('div', { style: 'display: flex; justify-content: center; gap: 8px;' }, [
        h(NButton, {
          size: 'small',
          type: 'primary',
          onClick: () => handleEdit(row)
        }, { default: () => '编辑' }),
        h(NButton, {
          size: 'small',
          type: 'error',
          class: 'ml-2',
          onClick: () => handleDelete(row)
        }, { default: () => '删除' })
      ])
    }
  }
])
</script>

<template>
  <div>
    <SearchForm
      v-if="searchFields && searchFields.length && showSearchForm"
      :fields="searchFields"
      :loading="loading"
      @search="handleSearch"
      class="mb-4"
    />
    <!-- TODO:分离成HeaderAction组件-->
    <div class="mb-4 flex justify-end items-center gap-2">
      <n-button type="primary" size="small" @click="handleCreate">新增</n-button>
      <span
        @click="showSearchForm = !showSearchForm"
        class="iconify-[ic--baseline-search] cursor-pointer text-xl transition-colors duration-200"
        style="color: var(--primary-color)"
      ></span>
    </div>
    <n-data-table
      :columns="tableColumns"
      :data="data"
      :loading="loading" />
    <ActionModal
      :visible="modalVisible"
      :model-value="currentRow"
      :mode="modalMode"
      :loading="modalLoading"
      :fields="fields"
      @update:visible="v => (modalVisible = v)"
      @submit="handleModalSubmit"
    />
    <div class="pt-3 mt-2 flex justify-between items-center">
      <n-pagination
        v-bind="pagination"
        :item-count="total"
        size="medium"
        class="ml-auto"
      />
    </div>
  </div>
</template>
