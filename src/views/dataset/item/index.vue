<script setup lang="ts">
import { ref } from 'vue'

import {
  createItem,
  deleteItem,
  getItemPage,
  listItemAttributes,
  listItemFlingEffects,
  updateItem,
} from '@/api'
import {
  collectRelationIds,
  createCrudConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudPageSchema,
  CrudPage,
  hasId,
  pickRelationId,
  toSelectOptions,
} from '@/components'

import type { SelectOption } from 'naive-ui'

defineOptions({
  name: 'ItemPage',
})

const optionLoading = ref(false)
const itemFlingEffectOptions = ref<SelectOption[]>([])
const itemAttributeOptions = ref<SelectOption[]>([])

async function loadOptions() {
  optionLoading.value = true

  try {
    const [itemFlingEffectRes, itemAttributeRes] = await Promise.all([
      listItemFlingEffects(),
      listItemAttributes(),
    ])
    itemFlingEffectOptions.value = toSelectOptions(itemFlingEffectRes.data)
    itemAttributeOptions.value = toSelectOptions(itemAttributeRes.data)
  } finally {
    optionLoading.value = false
  }
}

function getItemAttributeLabel(item: ItemAttribute) {
  return item.name || item.internalName || (hasId(item.id) ? `#${item.id}` : '')
}

function getItemAttributeDisplayText(record: Item) {
  return (
    record.itemAttributes
      ?.map(getItemAttributeLabel)
      .filter((value): value is string => value.length > 0)
      .join(', ') || '-'
  )
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
      label: '道具名称',
      component: 'input',
      placeholder: '例如：大师球',
      rules: [{ required: true, message: '请输入道具名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '道具名称',
      component: 'input',
      placeholder: '输入道具名称',
    },
    table: {
      title: '道具名称',
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
      placeholder: '例如：master-ball',
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
    key: 'cost',
    form: {
      label: '价格',
      component: 'number',
      props: {
        min: 0,
        style: 'width: 100%',
      },
    },
    table: {
      title: '价格',
      width: 110,
    },
  },
  {
    key: 'flingPower',
    form: {
      label: '投掷威力',
      component: 'number',
      props: {
        min: 0,
        style: 'width: 100%',
      },
    },
    table: {
      title: '投掷威力',
      width: 120,
    },
  },
  {
    key: 'itemFlingEffectId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.itemFlingEffect),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '道具投掷效果',
      component: 'select',
      placeholder: '选择道具投掷效果',
      clearable: true,
      filterable: true,
      options: itemFlingEffectOptions,
      loading: optionLoading,
    },
    search: {
      label: '道具投掷效果',
      component: 'select',
      placeholder: '选择道具投掷效果',
      clearable: true,
      filterable: true,
      options: itemFlingEffectOptions,
      loading: optionLoading,
    },
    table: {
      title: '投掷效果',
      width: 180,
      render: (record) =>
        record.itemFlingEffect?.name || record.itemFlingEffect?.internalName || '-',
    },
  },
  {
    key: 'itemAttributeIds',
    formModel: {
      defaultValue: [],
      fromRecord: (record) => collectRelationIds(record.itemAttributes),
    },
    payload: {
      toValue: (value) => (value as Id[]).filter(hasId).map((id) => String(id)),
    },
    form: {
      label: '道具属性',
      component: 'select',
      placeholder: '选择道具属性',
      clearable: true,
      filterable: true,
      options: itemAttributeOptions,
      loading: optionLoading,
      props: {
        maxTagCount: 'responsive',
        multiple: true,
      },
      defaultValue: [],
    },
    table: {
      title: '道具属性',
      width: 280,
      render: (record) => getItemAttributeDisplayText(record),
    },
  },
  {
    key: 'shortEffect',
    trim: true,
    form: {
      label: '简称效果',
      component: 'input',
      placeholder: '输入简称效果',
      props: {
        type: 'textarea',
        autosize: {
          minRows: 2,
          maxRows: 4,
        },
      },
    },
    table: {
      title: '简称效果',
      width: 320,
    },
  },
  {
    key: 'effect',
    trim: true,
    form: {
      label: '效果说明',
      component: 'input',
      placeholder: '输入效果说明',
      props: {
        type: 'textarea',
        autosize: {
          minRows: 4,
          maxRows: 8,
        },
      },
    },
    table: false,
  },
  {
    key: 'text',
    trim: true,
    form: {
      label: '额外文本',
      component: 'input',
      placeholder: '输入额外文本',
      props: {
        type: 'textarea',
        autosize: {
          minRows: 3,
          maxRows: 6,
        },
      },
    },
    table: false,
  },
] as const satisfies Parameters<
  typeof createFlatCrudPageSchema<Item, ItemQuery, ItemFormModel, ItemFormModel>
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<Item, ItemFormModel>({
  create: {
    buttonLabel: '新增道具',
    disabled: optionLoading,
    successMessage: '道具新增成功',
  },
  delete: {
    confirmMessage: '确认删除该道具吗？',
    successMessage: '道具删除成功',
  },
  edit: {
    dialogTitle: '编辑道具',
    successMessage: '道具更新成功',
  },
  fields,
  formGridClass: 'grid gap-4 md:grid-cols-2',
  indexColumn: true,
  modalWidth: 'min(96vw, 1080px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const pageSchema = {
  initialize: loadOptions,
  ...createFlatCrudPageSchema<Item, ItemQuery, ItemFormModel, ItemFormModel>({
    fields,
    loadPage: getItemPage,
    createRecord: createItem,
    deleteRecord: deleteItem,
    updateRecord: updateItem,
  }),
}

const config = createCrudConfig({
  interface: interfaceSchema,
  page: pageSchema,
})
</script>

<template>
  <CrudPage :config="config" />
</template>
