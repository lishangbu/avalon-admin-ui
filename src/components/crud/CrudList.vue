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
  NSelect,
  useMessage,
} from 'naive-ui'
import { computed, nextTick, onMounted, reactive, ref, unref } from 'vue'

import CrudSearchPanel from './CrudSearchPanel.vue'
import {
  createActionColumn,
  createIndexColumn,
  getFieldDisabled,
  getFieldLoading,
  getFieldOptions,
  getInputValue,
  getNumberValue,
  getSelectValue,
  replaceModel,
  resolveIndexColumnConfig,
  setModelValue,
  toTableColumn,
} from './shared'

import type { CrudListConfig, CrudRecord } from './interface'
import type { DataTableColumns, FormInst } from 'naive-ui'

defineOptions({
  name: 'CrudList',
})

const props = defineProps<{
  config: CrudListConfig<any, any, any, any>
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

const listData = ref<CrudRecord[]>([])

const modalTitle = computed(() =>
  modalMode.value === 'create' ? props.config.createTitle : props.config.editTitle,
)
const indexColumn = computed(() => resolveIndexColumnConfig(props.config.indexColumn))
const columns = computed<DataTableColumns<CrudRecord>>(() => [
  ...(indexColumn.value ? [createIndexColumn(indexColumn.value, (rowIndex) => rowIndex + 1)] : []),
  ...props.config.tableColumns.map((column) => toTableColumn(column)),
  createActionColumn({
    getDeleteConfirmMessage,
    onDelete: handleDelete,
    onEdit: openEditModal,
  }),
])

function getDeleteConfirmMessage(record: CrudRecord) {
  return typeof props.config.deleteConfirmMessage === 'function'
    ? props.config.deleteConfirmMessage(record)
    : props.config.deleteConfirmMessage
}

async function loadListData() {
  loading.value = true

  try {
    const response = await props.config.loadList(searchModel)
    listData.value = response.data
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  void loadListData()
}

function handleReset() {
  replaceModel(searchModel, props.config.createSearchModel())
  void loadListData()
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
    } else {
      await props.config.updateRecord(payload)
      message.success(props.config.updateSuccessMessage)
    }

    showModal.value = false
    await loadListData()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(record: CrudRecord) {
  await props.config.deleteRecord(record)
  message.success(props.config.deleteSuccessMessage)
  await loadListData()
}

onMounted(() => {
  void Promise.all([props.config.initialize?.() ?? Promise.resolve(), loadListData()])
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
        :data="listData"
        :loading="loading"
        class="min-h-0 flex-1"
        flex-height
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
