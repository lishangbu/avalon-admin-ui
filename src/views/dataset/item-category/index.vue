<script setup lang="ts">
import { ref } from 'vue'

import {
  createItemCategory,
  deleteItemCategory,
  listItemCategories,
  listItemPockets,
  updateItemCategory,
} from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  createIdRule,
  hasId,
  pickRelationId,
  toSelectOptions,
} from '@/components'

import type { SelectOption } from 'naive-ui'

defineOptions({
  name: 'ItemCategoryPage',
})

const optionLoading = ref(false)
const itemPocketOptions = ref<SelectOption[]>([])

async function loadOptions() {
  optionLoading.value = true

  try {
    const response = await listItemPockets()
    itemPocketOptions.value = toSelectOptions(response.data)
  } finally {
    optionLoading.value = false
  }
}

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
      label: '类别名称',
      component: 'input',
      placeholder: '例如：Medicine',
      rules: [{ required: true, message: '请输入类别名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '类别名称',
      component: 'input',
      placeholder: '输入类别名称',
    },
    table: {
      title: '类别名称',
      width: 200,
      fixed: 'left',
    },
  },
  {
    key: 'internalName',
    trim: true,
    form: {
      label: '内部名称',
      component: 'input',
      placeholder: '例如：medicine',
      rules: [{ required: true, message: '请输入内部名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '内部名称',
      component: 'input',
      placeholder: '输入内部名称',
    },
    table: {
      title: '内部名称',
      width: 220,
    },
  },
  {
    key: 'itemPocketId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.itemPocket),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '所属口袋',
      component: 'select',
      placeholder: '选择所属口袋',
      clearable: true,
      filterable: true,
      options: itemPocketOptions,
      loading: optionLoading,
      rules: [createIdRule('所属口袋')],
    },
    search: {
      label: '所属口袋',
      component: 'select',
      placeholder: '选择所属口袋',
      clearable: true,
      filterable: true,
      options: itemPocketOptions,
      loading: optionLoading,
    },
    table: {
      title: '所属口袋',
      width: 180,
      render: (record) => record.itemPocket?.name || record.itemPocket?.internalName || '-',
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudListSchema<
    ItemCategory,
    ItemCategoryQuery,
    ItemCategoryFormModel,
    ItemCategoryFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<ItemCategory, ItemCategoryFormModel>({
  create: {
    buttonLabel: '新增道具类别',
    disabled: optionLoading,
    successMessage: '道具类别新增成功',
  },
  delete: {
    confirmMessage: '确认删除该道具类别吗？',
    successMessage: '道具类别删除成功',
  },
  edit: {
    dialogTitle: '编辑道具类别',
    successMessage: '道具类别更新成功',
  },
  fields,
  formGridClass: 'grid gap-4 md:grid-cols-2',
  indexColumn: true,
  modalWidth: 'min(96vw, 820px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = {
  initialize: loadOptions,
  ...createFlatCrudListSchema<
    ItemCategory,
    ItemCategoryQuery,
    ItemCategoryFormModel,
    ItemCategoryFormModel
  >({
    fields,
    loadList: listItemCategories,
    createRecord: createItemCategory,
    deleteRecord: deleteItemCategory,
    updateRecord: updateItemCategory,
  }),
}

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
