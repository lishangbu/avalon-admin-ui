<script setup lang="ts">
import { createGender, deleteGender, listGenders, updateGender } from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'GenderPage',
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
      label: '性别名称',
      component: 'input',
      placeholder: '例如：♀',
      rules: [{ required: true, message: '请输入性别名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '性别名称',
      component: 'input',
      placeholder: '输入性别名称',
    },
    table: {
      title: '性别名称',
      width: 160,
      fixed: 'left',
    },
  },
  {
    key: 'internalName',
    trim: true,
    form: {
      label: '内部名称',
      component: 'input',
      placeholder: '例如：female',
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
  typeof createFlatCrudListSchema<Gender, GenderQuery, GenderFormModel, GenderFormModel>
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<Gender, GenderFormModel>({
  create: {
    buttonLabel: '新增性别',
    successMessage: '性别新增成功',
  },
  delete: {
    confirmMessage: '确认删除该性别吗？',
    successMessage: '性别删除成功',
  },
  edit: {
    dialogTitle: '编辑性别',
    successMessage: '性别更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(92vw, 520px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<Gender, GenderQuery, GenderFormModel, GenderFormModel>({
  fields,
  loadList: listGenders,
  createRecord: createGender,
  deleteRecord: deleteGender,
  updateRecord: updateGender,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
