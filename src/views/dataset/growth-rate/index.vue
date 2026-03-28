<script setup lang="ts">
import { createGrowthRate, deleteGrowthRate, listGrowthRates, updateGrowthRate } from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'GrowthRatePage',
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
      label: '成长速度名称',
      component: 'input',
      placeholder: '例如：慢',
      rules: [{ required: true, message: '请输入成长速度名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '成长速度名称',
      component: 'input',
      placeholder: '输入成长速度名称',
    },
    table: {
      title: '成长速度名称',
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
      placeholder: '例如：medium-slow',
      rules: [{ required: true, message: '请输入内部名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '内部名称',
      component: 'input',
      placeholder: '输入内部名称',
    },
    table: {
      title: '内部名称',
      width: 200,
    },
  },
  {
    key: 'description',
    trim: true,
    form: {
      label: '描述',
      component: 'input',
      placeholder: '输入成长速度描述',
      props: {
        type: 'textarea',
        autosize: {
          minRows: 3,
          maxRows: 6,
        },
      },
    },
    search: {
      label: '描述',
      component: 'input',
      placeholder: '输入描述',
    },
    table: {
      title: '描述',
      width: 260,
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudListSchema<
    GrowthRate,
    GrowthRateQuery,
    GrowthRateFormModel,
    GrowthRateFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<GrowthRate, GrowthRateFormModel>({
  create: {
    buttonLabel: '新增成长速度',
    successMessage: '成长速度新增成功',
  },
  delete: {
    confirmMessage: '确认删除该成长速度吗？',
    successMessage: '成长速度删除成功',
  },
  edit: {
    dialogTitle: '编辑成长速度',
    successMessage: '成长速度更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(96vw, 760px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<
  GrowthRate,
  GrowthRateQuery,
  GrowthRateFormModel,
  GrowthRateFormModel
>({
  fields,
  loadList: listGrowthRates,
  createRecord: createGrowthRate,
  deleteRecord: deleteGrowthRate,
  updateRecord: updateGrowthRate,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
