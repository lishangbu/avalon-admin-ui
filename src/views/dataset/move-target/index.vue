<script setup lang="ts">
import { createMoveTarget, deleteMoveTarget, listMoveTargets, updateMoveTarget } from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'MoveTargetPage',
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
      label: '目标名称',
      component: 'input',
      placeholder: '例如：specific-move',
      rules: [{ required: true, message: '请输入目标名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '目标名称',
      component: 'input',
      placeholder: '输入目标名称',
    },
    table: {
      title: '目标名称',
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
      placeholder: '例如：specific-move',
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
  {
    key: 'description',
    trim: true,
    form: {
      label: '描述',
      component: 'input',
      placeholder: '输入描述',
      props: {
        type: 'textarea',
        autosize: { minRows: 3, maxRows: 6 },
      },
    },
    search: {
      label: '描述',
      component: 'input',
      placeholder: '输入描述',
    },
    table: {
      title: '描述',
      width: 360,
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudListSchema<
    MoveTarget,
    MoveTargetQuery,
    MoveTargetFormModel,
    MoveTargetFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<MoveTarget, MoveTargetFormModel>({
  create: {
    buttonLabel: '新增招式目标',
    successMessage: '招式目标新增成功',
  },
  delete: {
    confirmMessage: '确认删除该招式目标吗？',
    successMessage: '招式目标删除成功',
  },
  edit: {
    dialogTitle: '编辑招式目标',
    successMessage: '招式目标更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(96vw, 860px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<
  MoveTarget,
  MoveTargetQuery,
  MoveTargetFormModel,
  MoveTargetFormModel
>({
  fields,
  loadList: listMoveTargets,
  createRecord: createMoveTarget,
  deleteRecord: deleteMoveTarget,
  updateRecord: updateMoveTarget,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
