<script setup lang="ts">
import { ref } from 'vue'

import {
  createEvolutionChain,
  deleteEvolutionChain,
  getEvolutionChainPage,
  getItemPage,
  updateEvolutionChain,
} from '@/api'
import {
  createCrudConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudPageSchema,
  CrudPage,
  hasId,
  pickRelationId,
} from '@/components'

import type { SelectOption } from 'naive-ui'

defineOptions({
  name: 'EvolutionChainPage',
})

const ITEM_OPTION_PAGE_SIZE = 5000

const optionLoading = ref(false)
const babyTriggerItemOptions = ref<SelectOption[]>([])

async function loadOptions() {
  optionLoading.value = true

  try {
    const itemRes = await getItemPage({
      page: 1,
      size: ITEM_OPTION_PAGE_SIZE,
      sort: 'id,asc',
      query: {},
    })

    babyTriggerItemOptions.value = itemRes.data.rows
      .filter((item) => hasId(item.id))
      .map((item) => ({
        value: item.id!,
        label:
          item.name && item.internalName
            ? `${item.name} (${item.internalName})`
            : item.name || item.internalName || `#${item.id}`,
      }))
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
    search: {
      label: '进化链 ID',
      component: 'input',
      placeholder: '输入进化链 ID',
    },
    table: {
      title: '进化链 ID',
      width: 140,
      fixed: 'left',
      render: (record) => (hasId(record.id) ? `#${record.id}` : '-'),
    },
  },
  {
    key: 'babyTriggerItemId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.babyTriggerItem),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '幼年触发道具',
      component: 'select',
      placeholder: '选择幼年触发道具',
      clearable: true,
      filterable: true,
      options: babyTriggerItemOptions,
      loading: optionLoading,
    },
    search: {
      label: '幼年触发道具',
      component: 'select',
      placeholder: '选择幼年触发道具',
      clearable: true,
      filterable: true,
      options: babyTriggerItemOptions,
      loading: optionLoading,
    },
    table: {
      title: '幼年触发道具',
      width: 220,
      render: (record) =>
        record.babyTriggerItem?.name || record.babyTriggerItem?.internalName || '-',
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudPageSchema<
    EvolutionChain,
    EvolutionChainQuery,
    EvolutionChainFormModel,
    EvolutionChainFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<EvolutionChain, EvolutionChainFormModel>({
  create: {
    buttonLabel: '新增进化链',
    disabled: optionLoading,
    successMessage: '进化链新增成功',
  },
  delete: {
    confirmMessage: '确认删除该进化链吗？',
    successMessage: '进化链删除成功',
  },
  edit: {
    dialogTitle: '编辑进化链',
    successMessage: '进化链更新成功',
  },
  fields,
  formGridClass: 'grid gap-4 md:grid-cols-2',
  indexColumn: true,
  modalWidth: 'min(92vw, 760px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const pageSchema = {
  initialize: loadOptions,
  ...createFlatCrudPageSchema<
    EvolutionChain,
    EvolutionChainQuery,
    EvolutionChainFormModel,
    EvolutionChainFormModel
  >({
    fields,
    loadPage: getEvolutionChainPage,
    createRecord: createEvolutionChain,
    deleteRecord: deleteEvolutionChain,
    updateRecord: updateEvolutionChain,
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
