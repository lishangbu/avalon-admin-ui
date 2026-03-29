<script setup lang="ts">
import { createMoveAilment, deleteMoveAilment, listMoveAilments, updateMoveAilment } from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'MoveAilmentPage',
})

const fields = [
  {
    key: 'id',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => record.id ?? null,
    },
    payload: {
      toValue: (value) => String(value),
      omitWhen: (value) => !hasId(value),
    },
  },
  {
    key: 'name',
    trim: true,
    form: {
      label: '异常名称',
      component: 'input',
      placeholder: '例如：paralysis',
      rules: [{ required: true, message: '请输入异常名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '异常名称',
      component: 'input',
      placeholder: '输入异常名称',
    },
    table: {
      title: '异常名称',
      width: 180,
      fixed: 'left',
    },
  },
  {
    key: 'internalName',
    trim: true,
    form: {
      label: '内部名称',
      component: 'input',
      placeholder: '例如：paralysis',
      rules: [{ required: true, message: '请输入内部名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '内部名称',
      component: 'input',
      placeholder: '输入内部名称',
    },
    table: {
      title: '内部名称',
      width: 180,
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudListSchema<
    MoveAilment,
    MoveAilmentQuery,
    MoveAilmentFormModel,
    MoveAilmentFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<MoveAilment, MoveAilmentFormModel>({
  create: {
    buttonLabel: '新增招式异常',
    successMessage: '招式异常新增成功',
  },
  delete: {
    confirmMessage: '确认删除该招式异常吗？',
    successMessage: '招式异常删除成功',
  },
  edit: {
    dialogTitle: '编辑招式异常',
    successMessage: '招式异常更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(92vw, 560px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<
  MoveAilment,
  MoveAilmentQuery,
  MoveAilmentFormModel,
  MoveAilmentFormModel
>({
  fields,
  loadList: listMoveAilments,
  createRecord: createMoveAilment,
  deleteRecord: deleteMoveAilment,
  updateRecord: updateMoveAilment,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
