<script setup lang="ts">
import {
  NButton,
  NCard,
  NDataTable,
  NForm,
  NFormItem,
  NModal,
  NSpin,
  useMessage,
} from 'naive-ui'
import { computed, nextTick, onMounted, reactive, ref, unref } from 'vue'

import CrudFieldControl from './CrudFieldControl'
import CrudSearchPanel from './CrudSearchPanel.vue'
import {
  createActionColumn,
  createIndexColumn,
  replaceModel,
  resolveIndexColumnConfig,
  toTableColumn,
} from './shared'

import type { CrudConfig, CrudRecord } from './interface'
import type { DataTableColumns, FormInst } from 'naive-ui'

defineOptions({
  name: 'CrudPage',
})

const props = defineProps<{
  config: CrudConfig<any, any, any, any>
}>()

const message = useMessage()

const loading = ref(false)
const submitting = ref(false)
const formLoading = ref(false)
const showModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const searchExpanded = ref(false)

const formRef = ref<FormInst | null>(null)

const searchModel = reactive<CrudRecord>(props.config.createSearchModel())
const formModel = reactive<CrudRecord>(props.config.createFormModel())

const pagination = reactive({
  page: 1,
  size: 10,
})

const pageData = ref<Page<CrudRecord>>(createEmptyPage<CrudRecord>())

const modalTitle = computed(() =>
  modalMode.value === 'create' ? props.config.create.dialogTitle : props.config.edit.dialogTitle,
)
const tablePagination = computed(() => ({
  page: pagination.page,
  pageSize: pagination.size,
  itemCount: pageData.value.totalRowCount,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: handlePageChange,
  onUpdatePageSize: handlePageSizeChange,
}))

const indexColumn = computed(() => resolveIndexColumnConfig(props.config.indexColumn))
const columns = computed<DataTableColumns<CrudRecord>>(() => [
  ...(indexColumn.value
    ? [
        createIndexColumn(
          indexColumn.value,
          (rowIndex) => (pagination.page - 1) * pagination.size + rowIndex + 1,
        ),
      ]
    : []),
  ...props.config.tableColumns.map((column) => toTableColumn(column)),
  createActionColumn({
    getDeleteConfirmMessage,
    onDelete: handleDelete,
    onEdit: openEditModal,
  }),
])

function createEmptyPage<T>(): Page<T> {
  return {
    rows: [],
    totalRowCount: 0,
    totalPageCount: 0,
  }
}

function getDeleteConfirmMessage(record: CrudRecord) {
  return typeof props.config.delete.confirmMessage === 'function'
    ? props.config.delete.confirmMessage(record)
    : props.config.delete.confirmMessage
}

async function loadPageData() {
  loading.value = true

  try {
    const response = await props.config.loadPage({
      page: pagination.page,
      size: pagination.size,
      query: searchModel,
    })

    pageData.value = response.data
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  void loadPageData()
}

function handleReset() {
  replaceModel(searchModel, props.config.createSearchModel())
  pagination.page = 1
  void loadPageData()
}

function openCreateModal() {
  modalMode.value = 'create'
  formLoading.value = false
  replaceModel(formModel, props.config.createFormModel())
  showModal.value = true
  void nextTick(() => formRef.value?.restoreValidation())
}

async function openEditModal(record: CrudRecord) {
  modalMode.value = 'edit'
  showModal.value = true
  formLoading.value = true
  replaceModel(formModel, props.config.createFormModel())

  try {
    const nextRecord = props.config.loadRecordForEdit
      ? await props.config.loadRecordForEdit(record)
      : record

    replaceModel(formModel, props.config.mapRecordToFormModel(nextRecord))
    await nextTick()
    formRef.value?.restoreValidation()
  } catch {
    showModal.value = false
    message.error('加载编辑数据失败')
  } finally {
    formLoading.value = false
  }
}

async function handleSubmit() {
  await formRef.value?.validate()

  submitting.value = true

  try {
    const payload = props.config.createPayload(formModel, modalMode.value)

    if (modalMode.value === 'create') {
      await props.config.createRecord(payload)
      message.success(props.config.create.successMessage)
      pagination.page = 1
    } else {
      await props.config.updateRecord(payload)
      message.success(props.config.edit.successMessage)
    }

    showModal.value = false
    await loadPageData()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(record: CrudRecord) {
  await props.config.deleteRecord(record)
  message.success(props.config.delete.successMessage)

  if (pageData.value.rows.length === 1 && pagination.page > 1) {
    pagination.page -= 1
  }

  await loadPageData()
}

function handlePageChange(page: number) {
  pagination.page = page
  void loadPageData()
}

function handlePageSizeChange(pageSize: number) {
  pagination.size = pageSize
  pagination.page = 1
  void loadPageData()
}

onMounted(() => {
  void Promise.all([props.config.initialize?.() ?? Promise.resolve(), loadPageData()])
})
</script>

<template>
  <div class="flex h-full min-h-0 flex-col gap-4 p-4 max-sm:p-2">
    <CrudSearchPanel
      v-model:expanded="searchExpanded"
      :create-button-label="config.create.buttonLabel"
      :create-button-disabled="Boolean(unref(config.create.disabled))"
      @create="openCreateModal"
    >
      <NForm
        :model="searchModel"
        label-placement="top"
        :class="config.searchGridClass ?? 'grid gap-4 md:grid-cols-2 xl:grid-cols-4'"
      >
        <NFormItem
          v-for="field in config.searchFields"
          :key="field.key"
          :label="field.label"
          :path="field.key"
        >
          <CrudFieldControl
            :field="field"
            :model="searchModel"
            mode="create"
          />
        </NFormItem>
        <NFormItem
          label="操作"
          class="crud-search-actions"
        >
          <div class="flex w-full justify-end gap-2">
            <NButton @click="handleReset">重置</NButton>
            <NButton
              type="primary"
              ghost
              @click="handleSearch"
            >
              查询
            </NButton>
          </div>
        </NFormItem>
      </NForm>
    </CrudSearchPanel>

    <NCard
      :bordered="false"
      class="flex min-h-0 flex-1 flex-col"
      content-class="flex min-h-0 flex-1 flex-col"
    >
      <NDataTable
        :columns="columns"
        :data="pageData.rows"
        :loading="loading"
        :pagination="tablePagination"
        class="min-h-0 flex-1"
        flex-height
        remote
      />
    </NCard>

    <NModal
      v-model:show="showModal"
      preset="card"
      :auto-focus="false"
      :mask-closable="false"
      :style="{ width: config.modalWidth ?? 'min(92vw, 560px)' }"
      :title="modalTitle"
    >
      <NSpin :show="formLoading">
        <NForm
          ref="formRef"
          :model="formModel"
          :rules="config.formRules"
          label-placement="top"
          :class="config.formGridClass"
        >
          <NFormItem
            v-for="field in config.formFields"
            :key="field.key"
            :label="field.label"
            :path="field.key"
          >
            <CrudFieldControl
              :field="field"
              :model="formModel"
              :mode="modalMode"
            />
          </NFormItem>
        </NForm>
      </NSpin>

      <template #action>
        <div class="flex justify-end gap-2">
          <NButton @click="showModal = false">取消</NButton>
          <NButton
            type="primary"
            :disabled="formLoading"
            :loading="submitting"
            @click="handleSubmit"
          >
            保存
          </NButton>
        </div>
      </template>
    </NModal>
  </div>
</template>

<style scoped>
.crud-search-actions :deep(.n-form-item-label__text) {
  visibility: hidden;
}
</style>
