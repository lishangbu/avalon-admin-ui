<script setup lang="ts">
import { createBerryFlavor, deleteBerryFlavor, getBerryFlavorPage, updateBerryFlavor } from '@/api'
import {
  createCrudConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudPageSchema,
  CrudPage,
} from '@/components'

defineOptions({
  name: 'BerryFlavorPage',
})

const fields = [
  {
    key: 'name',
    trim: true,
    form: {
      label: '风味名称',
      placeholder: '例如：甜',
      rules: [{ required: true, message: '请输入风味名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '风味名称',
      placeholder: '输入风味名称',
    },
    table: {
      title: '风味名称',
    },
  },
  {
    key: 'internalName',
    trim: true,
    form: {
      label: '内部名称',
      placeholder: '例如：sweet',
      rules: [{ required: true, message: '请输入内部名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '内部名称',
      placeholder: '例如：sweet',
    },
    table: {
      title: '内部名称',
    },
  },
] as const satisfies Parameters<typeof createFlatCrudInterfaceSchema<BerryFlavor>>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<BerryFlavor>({
  createLabel: '新增树果风味',
  createSuccessMessage: '树果风味新增成功',
  deleteConfirmMessage: '确认删除该树果风味吗？',
  deleteSuccessMessage: '树果风味删除成功',
  editTitle: '编辑树果风味',
  fields,
  indexColumn: true,
  modalWidth: 'min(92vw, 520px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
  updateSuccessMessage: '树果风味更新成功',
})

const pageSchema = createFlatCrudPageSchema<BerryFlavor, BerryFlavorQuery>({
  fields,
  loadPage: getBerryFlavorPage,
  createRecord: createBerryFlavor,
  deleteRecord: deleteBerryFlavor,
  updateRecord: updateBerryFlavor,
})

const config = createCrudConfig({
  interface: interfaceSchema,
  page: pageSchema,
})
</script>

<template>
  <CrudPage :config="config" />
</template>
