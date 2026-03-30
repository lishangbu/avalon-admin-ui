import { computed, nextTick, reactive, ref, type Ref } from 'vue'

import { replaceModel, toCrudModel } from '@/components/crud/shared'

import type { CrudRecord } from '@/components/crud'
import type { FormInst } from 'naive-ui'

export interface UseCrudDialogOptions<TRecord extends CrudRecord, TForm extends object> {
  createDialogTitle: string
  createFormModel: () => TForm
  editDialogTitle: string
  formRef: Ref<FormInst | null>
  loadRecordForEdit?: (record: TRecord) => Promise<TRecord>
  mapRecordToFormModel: (record: TRecord) => TForm
  onEditLoadError?: (error: unknown) => void
}

export function useCrudDialog<TRecord extends CrudRecord, TForm extends object>(
  options: UseCrudDialogOptions<TRecord, TForm>,
) {
  const formLoading = ref(false)
  const modalMode = ref<'create' | 'edit'>('create')
  const showModal = ref(false)
  const formModel = reactive(options.createFormModel()) as TForm

  const modalTitle = computed(() =>
    modalMode.value === 'create' ? options.createDialogTitle : options.editDialogTitle,
  )

  async function restoreValidation() {
    await nextTick()
    options.formRef.value?.restoreValidation()
  }

  async function openCreateModal() {
    modalMode.value = 'create'
    formLoading.value = false
    replaceModel(toCrudModel(formModel), options.createFormModel())
    showModal.value = true
    await restoreValidation()
  }

  async function openEditModal(record: TRecord) {
    modalMode.value = 'edit'
    showModal.value = true
    formLoading.value = true
    replaceModel(toCrudModel(formModel), options.createFormModel())

    try {
      const nextRecord = options.loadRecordForEdit
        ? await options.loadRecordForEdit(record)
        : record
      replaceModel(toCrudModel(formModel), options.mapRecordToFormModel(nextRecord))
      await restoreValidation()
    } catch (error) {
      showModal.value = false
      options.onEditLoadError?.(error)
    } finally {
      formLoading.value = false
    }
  }

  function closeModal() {
    showModal.value = false
  }

  return {
    closeModal,
    formLoading,
    formModel,
    modalMode,
    modalTitle,
    openCreateModal,
    openEditModal,
    showModal,
  }
}
