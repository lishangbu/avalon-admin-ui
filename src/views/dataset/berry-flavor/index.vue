<script setup lang="ts">
import { createBerryFlavor, deleteBerryFlavor, listBerryFlavors, updateBerryFlavor } from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
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
      component: 'input',
      placeholder: '例如：甜',
      rules: [{ required: true, message: '请输入风味名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '风味名称',
      component: 'input',
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
      component: 'input',
      placeholder: '例如：sweet',
      rules: [{ required: true, message: '请输入内部名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '内部名称',
      component: 'input',
      placeholder: '例如：sweet',
    },
    table: {
      title: '内部名称',
    },
  },
] as const satisfies Parameters<typeof createFlatCrudInterfaceSchema<BerryFlavor>>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<BerryFlavor>({
  create: {
    buttonLabel: '新增树果风味',
    successMessage: '树果风味新增成功',
  },
  delete: {
    confirmMessage: '确认删除该树果风味吗？',
    successMessage: '树果风味删除成功',
  },
  edit: {
    dialogTitle: '编辑树果风味',
    successMessage: '树果风味更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(92vw, 520px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<BerryFlavor, BerryFlavorQuery>({
  fields,
  loadList: listBerryFlavors,
  createRecord: createBerryFlavor,
  deleteRecord: deleteBerryFlavor,
  updateRecord: updateBerryFlavor,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
