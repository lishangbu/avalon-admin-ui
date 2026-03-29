<script setup lang="ts">
import { createItemPocket, deleteItemPocket, listItemPockets, updateItemPocket } from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'ItemPocketPage',
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
      label: '口袋名称',
      component: 'input',
      placeholder: '例如：道具',
      rules: [{ required: true, message: '请输入口袋名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '口袋名称',
      component: 'input',
      placeholder: '输入口袋名称',
    },
    table: {
      title: '口袋名称',
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
      placeholder: '例如：misc',
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
    ItemPocket,
    ItemPocketQuery,
    ItemPocketFormModel,
    ItemPocketFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<ItemPocket, ItemPocketFormModel>({
  create: {
    buttonLabel: '新增道具口袋',
    successMessage: '道具口袋新增成功',
  },
  delete: {
    confirmMessage: '确认删除该道具口袋吗？',
    successMessage: '道具口袋删除成功',
  },
  edit: {
    dialogTitle: '编辑道具口袋',
    successMessage: '道具口袋更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(92vw, 560px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<
  ItemPocket,
  ItemPocketQuery,
  ItemPocketFormModel,
  ItemPocketFormModel
>({
  fields,
  loadList: listItemPockets,
  createRecord: createItemPocket,
  deleteRecord: deleteItemPocket,
  updateRecord: updateItemPocket,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
