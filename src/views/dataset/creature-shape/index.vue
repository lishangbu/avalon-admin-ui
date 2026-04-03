<script setup lang="ts">
import {
  createCreatureShape,
  deleteCreatureShape,
  listCreatureShapes,
  updateCreatureShape,
} from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'CreatureShapePage',
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
      label: '形状名称',
      component: 'input',
      placeholder: '例如：Ball',
      rules: [{ required: true, message: '请输入形状名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '形状名称',
      component: 'input',
      placeholder: '输入形状名称',
    },
    table: {
      title: '形状名称',
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
      placeholder: '例如：ball',
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
    CreatureShape,
    CreatureShapeQuery,
    CreatureShapeFormModel,
    CreatureShapeFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<CreatureShape, CreatureShapeFormModel>({
  create: {
    buttonLabel: '新增生物形状',
    successMessage: '生物形状新增成功',
  },
  delete: {
    confirmMessage: '确认删除该生物形状吗？',
    successMessage: '生物形状删除成功',
  },
  edit: {
    dialogTitle: '编辑生物形状',
    successMessage: '生物形状更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(92vw, 560px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<
  CreatureShape,
  CreatureShapeQuery,
  CreatureShapeFormModel,
  CreatureShapeFormModel
>({
  fields,
  loadList: listCreatureShapes,
  createRecord: createCreatureShape,
  deleteRecord: deleteCreatureShape,
  updateRecord: updateCreatureShape,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
