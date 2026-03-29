<script setup lang="ts">
import { NButton, NCard, NDataTable, NForm, NFormItem, NModal, NSpin, useMessage } from 'naive-ui'
import { computed, ref, unref } from 'vue'

import { useCrudDialog, useCrudListData, useMutation } from '@/composables'

import CrudFieldControl from './CrudFieldControl'
import CrudSearchPanel from './CrudSearchPanel.vue'
import {
  createActionColumn,
  createIndexColumn,
  resolveIndexColumnConfig,
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

const formRef = ref<FormInst | null>(null)

const { handleReset, handleSearch, listData, loading, refreshData, searchExpanded, searchModel } =
  useCrudListData<CrudRecord, CrudRecord>({
    createSearchModel: props.config.createSearchModel,
    initialize: props.config.initialize,
    loadList: props.config.loadList,
  })
const {
  closeModal,
  formLoading,
  formModel,
  modalMode,
  modalTitle,
  openCreateModal,
  openEditModal,
  showModal,
} = useCrudDialog<CrudRecord, CrudRecord>({
  createDialogTitle: props.config.create.dialogTitle,
  createFormModel: props.config.createFormModel,
  editDialogTitle: props.config.edit.dialogTitle,
  formRef,
  loadRecordForEdit: props.config.loadRecordForEdit,
  mapRecordToFormModel: props.config.mapRecordToFormModel,
  onEditLoadError: () => {
    message.error('加载编辑数据失败')
  },
})
const indexColumn = computed(() => resolveIndexColumnConfig(props.config.indexColumn))
const columns = computed<DataTableColumns<CrudRecord>>(() => [
  ...(indexColumn.value ? [createIndexColumn(indexColumn.value, (rowIndex) => rowIndex + 1)] : []),
  ...props.config.tableColumns.map((column) => toTableColumn(column)),
  createActionColumn({
    getDeleteConfirmMessage,
    isDeleteDisabled: (record) =>
      typeof props.config.delete.disabled === 'function'
        ? props.config.delete.disabled(record)
        : Boolean(unref(props.config.delete.disabled)),
    onDelete: handleDelete,
    onEdit: openEditModal,
  }),
])
const submitDisabled = computed(() => {
  const config =
    modalMode.value === 'create' ? props.config.create.submitDisabled : props.config.edit.submitDisabled

  if (typeof config === 'function') {
    return Boolean(
      config({
        mode: modalMode.value,
        model: formModel,
      }),
    )
  }

  return Boolean(unref(config))
})

const submitMutation = useMutation<'create' | 'edit', []>({
  mutation: async () => {
    await formRef.value?.validate()

    const payload = props.config.createPayload(formModel, modalMode.value)

    if (modalMode.value === 'create') {
      await props.config.createRecord(payload)
      return 'create'
    }

    await props.config.updateRecord(payload)
    return 'edit'
  },
  onSuccess: async (mode) => {
    if (mode === 'create') {
      message.success(props.config.create.successMessage)
    } else {
      message.success(props.config.edit.successMessage)
    }

    closeModal()
    await refreshData()
  },
})

const deleteMutation = useMutation<void, [CrudRecord]>({
  mutation: async (record) => {
    await props.config.deleteRecord(record)
  },
  onSuccess: async () => {
    message.success(props.config.delete.successMessage)
    await refreshData()
  },
})

function getDeleteConfirmMessage(record: CrudRecord) {
  return typeof props.config.delete.confirmMessage === 'function'
    ? props.config.delete.confirmMessage(record)
    : props.config.delete.confirmMessage
}

async function handleSubmit() {
  try {
    await submitMutation.mutate()
  } catch {}
}

async function handleDelete(record: CrudRecord) {
  try {
    await deleteMutation.mutate(record)
  } catch {}
}
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
            :disabled="formLoading || submitDisabled"
            :loading="submitMutation.loading.value"
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
