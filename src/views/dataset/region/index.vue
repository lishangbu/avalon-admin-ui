<script setup lang="ts">
import { createRegion, deleteRegion, listRegions, updateRegion } from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'RegionPage',
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
      label: '地区名称',
      component: 'input',
      placeholder: '例如：Kanto',
      rules: [{ required: true, message: '请输入地区名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '地区名称',
      component: 'input',
      placeholder: '输入地区名称',
    },
    table: {
      title: '地区名称',
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
      placeholder: '例如：kanto',
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
  typeof createFlatCrudListSchema<Region, RegionQuery, RegionFormModel, RegionFormModel>
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<Region, RegionFormModel>({
  create: {
    buttonLabel: '新增地区',
    successMessage: '地区新增成功',
  },
  delete: {
    confirmMessage: '确认删除该地区吗？',
    successMessage: '地区删除成功',
  },
  edit: {
    dialogTitle: '编辑地区',
    successMessage: '地区更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(92vw, 560px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<Region, RegionQuery, RegionFormModel, RegionFormModel>({
  fields,
  loadList: listRegions,
  createRecord: createRegion,
  deleteRecord: deleteRegion,
  updateRecord: updateRegion,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
