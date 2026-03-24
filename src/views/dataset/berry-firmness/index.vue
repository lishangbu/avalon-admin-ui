<script setup lang="ts">
import {
  createBerryFirmness,
  deleteBerryFirmness,
  listBerryFirmnesses,
  updateBerryFirmness,
} from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
} from '@/components'

defineOptions({
  name: 'BerryFirmnessPage',
})

const fields = [
  {
    key: 'name',
    trim: true,
    form: {
      label: '坚硬度名称',
      placeholder: '例如：非常硬',
      rules: [{ required: true, message: '请输入坚硬度名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '坚硬度名称',
      placeholder: '输入坚硬度名称',
    },
    table: {
      title: '坚硬度名称',
    },
  },
  {
    key: 'internalName',
    trim: true,
    form: {
      label: '内部名称',
      placeholder: '例如：very-hard',
      rules: [{ required: true, message: '请输入内部名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '内部名称',
      placeholder: '例如：very-hard',
    },
    table: {
      title: '内部名称',
    },
  },
] as const satisfies Parameters<typeof createFlatCrudInterfaceSchema<BerryFirmness>>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<BerryFirmness>({
  createLabel: '新增树果坚硬度',
  createSuccessMessage: '树果坚硬度新增成功',
  deleteConfirmMessage: '确认删除该树果坚硬度吗？',
  deleteSuccessMessage: '树果坚硬度删除成功',
  editTitle: '编辑树果坚硬度',
  fields,
  indexColumn: true,
  modalWidth: 'min(92vw, 520px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
  updateSuccessMessage: '树果坚硬度更新成功',
})

const listSchema = createFlatCrudListSchema<BerryFirmness, BerryFirmnessQuery>({
  fields,
  loadList: listBerryFirmnesses,
  createRecord: createBerryFirmness,
  deleteRecord: deleteBerryFirmness,
  updateRecord: updateBerryFirmness,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
