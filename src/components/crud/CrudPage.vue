<script setup lang="ts">
import {
  NButton,
  NCard,
  NDataTable,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NModal,
  NPopconfirm,
  NSelect,
  NSpace,
  useMessage,
} from 'naive-ui'
import { computed, h, nextTick, onMounted, reactive, ref, unref } from 'vue'

import CrudSearchPanel from './CrudSearchPanel.vue'

import type { CrudColumnConfig, CrudConfig, CrudFieldConfig, CrudIndexColumnConfig, CrudRecord } from './interface'
import type { DataTableColumns, FormInst, SelectOption } from 'naive-ui'

defineOptions({
  name: 'CrudPage',
})

const props = defineProps<{
  config: CrudConfig<any, any, any, any>
}>()

const message = useMessage()

const loading = ref(false)
const submitting = ref(false)
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

const modalTitle = computed(() => (modalMode.value === 'create' ? props.config.createTitle : props.config.editTitle))
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
  ...(indexColumn.value ? [createIndexColumn(indexColumn.value)] : []),
  ...props.config.tableColumns.map((column) => toTableColumn(column)),
  createActionColumn(),
])

function resolveIndexColumnConfig(
  indexColumnConfig?: CrudIndexColumnConfig | boolean,
): CrudIndexColumnConfig | null {
  if (!indexColumnConfig) {
    return null
  }

  if (indexColumnConfig === true) {
    return {}
  }

  return indexColumnConfig
}

function createEmptyPage<T>(): Page<T> {
  return {
    rows: [],
    totalRowCount: 0,
    totalPageCount: 0,
  }
}

function replaceModel(model: CrudRecord, nextValue: CrudRecord) {
  const target = model as Record<string, unknown>

  for (const key of Object.keys(target)) {
    delete target[key]
  }

  Object.assign(target, nextValue)
}

function getValueByPath(record: CrudRecord, path: string) {
  return path.split('.').reduce<unknown>((value, key) => {
    if (!value || typeof value !== 'object') {
      return undefined
    }

    return (value as Record<string, unknown>)[key]
  }, record)
}

function formatCellValue(value: unknown): string | number {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }

  return String(value)
}

function toTableColumn(column: CrudColumnConfig): DataTableColumns<CrudRecord>[number] {
  const { render, valuePath, ...baseColumn } = column

  if (column.render) {
    return {
      ...baseColumn,
      render: (record: CrudRecord) => render!(record),
    }
  }

  if (column.valuePath) {
    return {
      ...baseColumn,
      render: (record: CrudRecord) => formatCellValue(getValueByPath(record, valuePath as string)),
    }
  }

  return {
    ...baseColumn,
  }
}

function createIndexColumn(indexColumnConfig: CrudIndexColumnConfig): DataTableColumns<CrudRecord>[number] {
  return {
    key: '__index',
    title: indexColumnConfig.title ?? '序号',
    width: indexColumnConfig.width ?? 72,
    fixed: indexColumnConfig.fixed ?? 'left',
    align: indexColumnConfig.align ?? 'center',
    render: (_record: CrudRecord, rowIndex: number) => (pagination.page - 1) * pagination.size + rowIndex + 1,
  }
}

function createActionColumn(): DataTableColumns<CrudRecord>[number] {
  return {
    title: '操作',
    key: 'actions',
    width: 180,
    align: 'right',
    fixed: 'right',
    render: (record: CrudRecord) =>
      h(NSpace, { justify: 'end', size: 8 }, () => [
        h(
          NButton,
          {
            size: 'small',
            quaternary: true,
            type: 'primary',
            onClick: () => openEditModal(record),
          },
          () => '编辑',
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => handleDelete(record),
          },
          {
            trigger: () =>
              h(
                NButton,
                {
                  size: 'small',
                  quaternary: true,
                  type: 'error',
                },
                () => '删除',
              ),
            default: () => getDeleteConfirmMessage(record),
          },
        ),
      ]),
  }
}

function getDeleteConfirmMessage(record: CrudRecord) {
  return typeof props.config.deleteConfirmMessage === 'function'
    ? props.config.deleteConfirmMessage(record)
    : props.config.deleteConfirmMessage
}

function getFieldOptions(field: CrudFieldConfig) {
  return (unref(field.options) ?? []).map((option) => ({ ...option })) as SelectOption[]
}

function getFieldLoading(field: CrudFieldConfig) {
  return Boolean(unref(field.loading))
}

function getFieldDisabled(field: CrudFieldConfig, model: CrudRecord, mode: 'create' | 'edit') {
  if (typeof field.disabled === 'function') {
    return field.disabled({
      mode,
      model,
    })
  }

  return Boolean(unref(field.disabled))
}

function setModelValue(model: CrudRecord, key: string, value: unknown) {
  ;(model as Record<string, unknown>)[key] = value
}

function getInputValue(model: CrudRecord, key: string) {
  const value = (model as Record<string, unknown>)[key]
  return typeof value === 'string' || value === null || value === undefined ? value : String(value)
}

function getNumberValue(model: CrudRecord, key: string) {
  const value = (model as Record<string, unknown>)[key]
  return typeof value === 'number' || value === null || value === undefined ? value : null
}

function getSelectValue(model: CrudRecord, key: string) {
  return (model as Record<string, unknown>)[key] as string | number | null | undefined
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
  replaceModel(formModel, props.config.createFormModel())
  showModal.value = true
  void nextTick(() => formRef.value?.restoreValidation())
}

function openEditModal(record: CrudRecord) {
  modalMode.value = 'edit'
  replaceModel(formModel, props.config.mapRecordToFormModel(record))
  showModal.value = true
  void nextTick(() => formRef.value?.restoreValidation())
}

async function handleSubmit() {
  await formRef.value?.validate()

  submitting.value = true

  try {
    const payload = props.config.createPayload(formModel, modalMode.value)

    if (modalMode.value === 'create') {
      await props.config.createRecord(payload)
      message.success(props.config.createSuccessMessage)
      pagination.page = 1
    } else {
      await props.config.updateRecord(payload)
      message.success(props.config.updateSuccessMessage)
    }

    showModal.value = false
    await loadPageData()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(record: CrudRecord) {
  await props.config.deleteRecord(record)
  message.success(props.config.deleteSuccessMessage)

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
      :create-label="config.createLabel"
      :create-disabled="Boolean(unref(config.createDisabled))"
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
          <NInput
            v-if="field.type === 'input'"
            :value="getInputValue(searchModel, field.key)"
            :clearable="field.clearable ?? true"
            :disabled="getFieldDisabled(field, searchModel, 'create')"
            :placeholder="field.placeholder"
            v-bind="field.props"
            @update:value="setModelValue(searchModel, field.key, $event)"
            @keyup.enter="handleSearch"
          />
          <NInputNumber
            v-else-if="field.type === 'number'"
            :value="getNumberValue(searchModel, field.key)"
            :disabled="getFieldDisabled(field, searchModel, 'create')"
            :placeholder="field.placeholder"
            v-bind="field.props"
            @update:value="setModelValue(searchModel, field.key, $event)"
          />
          <NSelect
            v-else
            :value="getSelectValue(searchModel, field.key)"
            :clearable="field.clearable ?? true"
            :disabled="getFieldDisabled(field, searchModel, 'create')"
            :filterable="field.filterable ?? true"
            :loading="getFieldLoading(field)"
            :options="getFieldOptions(field)"
            :placeholder="field.placeholder"
            v-bind="field.props"
            @update:value="setModelValue(searchModel, field.key, $event)"
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
          <NInput
            v-if="field.type === 'input'"
            :value="getInputValue(formModel, field.key)"
            :clearable="field.clearable ?? false"
            :disabled="getFieldDisabled(field, formModel, modalMode)"
            :placeholder="field.placeholder"
            v-bind="field.props"
            @update:value="setModelValue(formModel, field.key, $event)"
          />
          <NInputNumber
            v-else-if="field.type === 'number'"
            :value="getNumberValue(formModel, field.key)"
            :disabled="getFieldDisabled(field, formModel, modalMode)"
            :placeholder="field.placeholder"
            v-bind="field.props"
            @update:value="setModelValue(formModel, field.key, $event)"
          />
          <NSelect
            v-else
            :value="getSelectValue(formModel, field.key)"
            :clearable="field.clearable ?? false"
            :disabled="getFieldDisabled(field, formModel, modalMode)"
            :filterable="field.filterable ?? true"
            :loading="getFieldLoading(field)"
            :options="getFieldOptions(field)"
            :placeholder="field.placeholder"
            v-bind="field.props"
            @update:value="setModelValue(formModel, field.key, $event)"
          />
        </NFormItem>
      </NForm>

      <template #action>
        <div class="flex justify-end gap-2">
          <NButton @click="showModal = false">取消</NButton>
          <NButton
            type="primary"
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
