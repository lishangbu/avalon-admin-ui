<script setup lang="ts">
import {
  createItemFlingEffect,
  deleteItemFlingEffect,
  listItemFlingEffects,
  updateItemFlingEffect,
} from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'ItemFlingEffectPage',
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
      label: '效果名称',
      component: 'input',
      placeholder: '例如：badly-poison',
      rules: [{ required: true, message: '请输入效果名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '效果名称',
      component: 'input',
      placeholder: '输入效果名称',
    },
    table: {
      title: '效果名称',
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
      placeholder: '例如：badly-poison',
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
    key: 'effect',
    trim: true,
    form: {
      label: '投掷效果',
      component: 'input',
      placeholder: '输入投掷效果',
      props: {
        type: 'textarea',
        autosize: { minRows: 3, maxRows: 6 },
      },
    },
    search: {
      label: '投掷效果',
      component: 'input',
      placeholder: '输入投掷效果',
    },
    table: {
      title: '投掷效果',
      width: 360,
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudListSchema<
    ItemFlingEffect,
    ItemFlingEffectQuery,
    ItemFlingEffectFormModel,
    ItemFlingEffectFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<ItemFlingEffect, ItemFlingEffectFormModel>({
  create: {
    buttonLabel: '新增道具投掷效果',
    successMessage: '道具投掷效果新增成功',
  },
  delete: {
    confirmMessage: '确认删除该道具投掷效果吗？',
    successMessage: '道具投掷效果删除成功',
  },
  edit: {
    dialogTitle: '编辑道具投掷效果',
    successMessage: '道具投掷效果更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(96vw, 820px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<
  ItemFlingEffect,
  ItemFlingEffectQuery,
  ItemFlingEffectFormModel,
  ItemFlingEffectFormModel
>({
  fields,
  loadList: listItemFlingEffects,
  createRecord: createItemFlingEffect,
  deleteRecord: deleteItemFlingEffect,
  updateRecord: updateItemFlingEffect,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
