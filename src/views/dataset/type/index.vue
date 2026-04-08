<script setup lang="ts">
import { createType, deleteType, listTypes, updateType } from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'TypePage',
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
      label: '属性名称',
      component: 'input',
      placeholder: '例如：火',
      rules: [{ required: true, message: '请输入属性名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '属性名称',
      component: 'input',
      placeholder: '输入属性名称',
    },
    table: {
      title: '属性名称',
    },
  },
  {
    key: 'internalName',
    trim: true,
    form: {
      label: '内部名称',
      component: 'input',
      placeholder: '例如：fire',
      rules: [{ required: true, message: '请输入内部名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '内部名称',
      component: 'input',
      placeholder: '例如：fire',
    },
    table: {
      title: '内部名称',
      width: 160,
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudListSchema<Type, TypeQuery, TypeFormModel, Type>
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<Type, TypeFormModel>({
  create: {
    buttonLabel: '新增属性',
    successMessage: '属性新增成功',
  },
  delete: {
    confirmMessage: '确认删除该属性吗？',
    successMessage: '属性删除成功',
  },
  edit: {
    dialogTitle: '编辑属性',
    successMessage: '属性更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(92vw, 520px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<Type, TypeQuery, TypeFormModel, Type>({
  fields,
  loadList: listTypes,
  createRecord: createType,
  deleteRecord: deleteType,
  updateRecord: updateType,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
