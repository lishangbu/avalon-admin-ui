<script setup lang="ts">
import { createType, deleteType, getTypePage, updateType } from '@/api'
import { createCrudConfig, createFlatCrudInterfaceSchema, createFlatCrudPageSchema, CrudPage } from '@/components'

defineOptions({
  name: 'TypePage',
})

const fields = [
  {
    key: 'name',
    trim: true,
    form: {
      label: '属性名称',
      placeholder: '例如：火',
      rules: [{ required: true, message: '请输入属性名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '属性名称',
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
      placeholder: '例如：fire',
      rules: [{ required: true, message: '请输入内部名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '内部名称',
      placeholder: '例如：fire',
    },
    table: {
      title: '内部名称',
    },
  },
] as const satisfies Parameters<typeof createFlatCrudInterfaceSchema<Type>>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<Type>({
  createLabel: '新增属性',
  createSuccessMessage: '属性新增成功',
  deleteConfirmMessage: '确认删除该属性吗？',
  deleteSuccessMessage: '属性删除成功',
  editTitle: '编辑属性',
  fields,
  indexColumn: true,
  modalWidth: 'min(92vw, 520px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
  updateSuccessMessage: '属性更新成功',
})

const pageSchema = createFlatCrudPageSchema<Type, TypeQuery>({
  fields,
  loadPage: getTypePage,
  createRecord: createType,
  deleteRecord: deleteType,
  updateRecord: updateType,
})

const config = createCrudConfig({
  interface: interfaceSchema,
  page: pageSchema,
})
</script>

<template>
  <CrudPage :config="config" />
</template>
