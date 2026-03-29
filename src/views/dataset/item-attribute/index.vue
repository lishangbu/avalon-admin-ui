<script setup lang="ts">
import {
  createItemAttribute,
  deleteItemAttribute,
  listItemAttributes,
  updateItemAttribute,
} from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'ItemAttributePage',
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
      placeholder: '例如：Countable',
      rules: [{ required: true, message: '请输入属性名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '属性名称',
      component: 'input',
      placeholder: '输入属性名称',
    },
    table: {
      title: '属性名称',
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
      placeholder: '例如：countable',
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
    key: 'description',
    trim: true,
    form: {
      label: '描述',
      component: 'input',
      placeholder: '输入属性描述',
      props: {
        type: 'textarea',
        autosize: { minRows: 3, maxRows: 6 },
      },
    },
    search: {
      label: '描述',
      component: 'input',
      placeholder: '输入属性描述',
    },
    table: {
      title: '描述',
      width: 340,
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudListSchema<
    ItemAttribute,
    ItemAttributeQuery,
    ItemAttributeFormModel,
    ItemAttributeFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<ItemAttribute, ItemAttributeFormModel>({
  create: {
    buttonLabel: '新增道具属性',
    successMessage: '道具属性新增成功',
  },
  delete: {
    confirmMessage: '确认删除该道具属性吗？',
    successMessage: '道具属性删除成功',
  },
  edit: {
    dialogTitle: '编辑道具属性',
    successMessage: '道具属性更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(96vw, 820px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<
  ItemAttribute,
  ItemAttributeQuery,
  ItemAttributeFormModel,
  ItemAttributeFormModel
>({
  fields,
  loadList: listItemAttributes,
  createRecord: createItemAttribute,
  deleteRecord: deleteItemAttribute,
  updateRecord: updateItemAttribute,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
