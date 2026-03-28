<script setup lang="ts">
import { ref } from 'vue'

import {
  createNature,
  deleteNature,
  listBerryFlavors,
  listNatures,
  listStats,
  updateNature,
} from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
  pickRelationId,
  toSelectOptions,
} from '@/components'

import type { SelectOption } from 'naive-ui'

defineOptions({
  name: 'NaturePage',
})

const optionLoading = ref(false)
const statOptions = ref<SelectOption[]>([])
const berryFlavorOptions = ref<SelectOption[]>([])

async function loadOptions() {
  optionLoading.value = true

  try {
    const [statRes, berryFlavorRes] = await Promise.all([listStats(), listBerryFlavors()])
    statOptions.value = toSelectOptions(statRes.data)
    berryFlavorOptions.value = toSelectOptions(berryFlavorRes.data)
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
      label: '性格名称',
      component: 'input',
      placeholder: '例如：大胆',
      rules: [{ required: true, message: '请输入性格名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '性格名称',
      component: 'input',
      placeholder: '输入性格名称',
    },
    table: {
      title: '性格名称',
      width: 160,
      fixed: 'left',
    },
  },
  {
    key: 'internalName',
    trim: true,
    form: {
      label: '内部名称',
      component: 'input',
      placeholder: '例如：bold',
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
    key: 'decreasedStatId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.decreasedStat),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '降低能力',
      component: 'select',
      placeholder: '选择降低能力',
      clearable: true,
      filterable: true,
      options: statOptions,
      loading: optionLoading,
    },
    search: {
      label: '降低能力',
      component: 'select',
      placeholder: '选择降低能力',
      clearable: true,
      filterable: true,
      options: statOptions,
      loading: optionLoading,
    },
    table: {
      title: '降低能力',
      width: 180,
      render: (record) => record.decreasedStat?.name || record.decreasedStat?.internalName || '-',
    },
  },
  {
    key: 'increasedStatId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.increasedStat),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '提高能力',
      component: 'select',
      placeholder: '选择提高能力',
      clearable: true,
      filterable: true,
      options: statOptions,
      loading: optionLoading,
    },
    search: {
      label: '提高能力',
      component: 'select',
      placeholder: '选择提高能力',
      clearable: true,
      filterable: true,
      options: statOptions,
      loading: optionLoading,
    },
    table: {
      title: '提高能力',
      width: 180,
      render: (record) => record.increasedStat?.name || record.increasedStat?.internalName || '-',
    },
  },
  {
    key: 'hatesBerryFlavorId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.hatesBerryFlavor),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '讨厌风味',
      component: 'select',
      placeholder: '选择讨厌风味',
      clearable: true,
      filterable: true,
      options: berryFlavorOptions,
      loading: optionLoading,
    },
    search: {
      label: '讨厌风味',
      component: 'select',
      placeholder: '选择讨厌风味',
      clearable: true,
      filterable: true,
      options: berryFlavorOptions,
      loading: optionLoading,
    },
    table: {
      title: '讨厌风味',
      width: 180,
      render: (record) =>
        record.hatesBerryFlavor?.name || record.hatesBerryFlavor?.internalName || '-',
    },
  },
  {
    key: 'likesBerryFlavorId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.likesBerryFlavor),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '喜欢风味',
      component: 'select',
      placeholder: '选择喜欢风味',
      clearable: true,
      filterable: true,
      options: berryFlavorOptions,
      loading: optionLoading,
    },
    search: {
      label: '喜欢风味',
      component: 'select',
      placeholder: '选择喜欢风味',
      clearable: true,
      filterable: true,
      options: berryFlavorOptions,
      loading: optionLoading,
    },
    table: {
      title: '喜欢风味',
      width: 180,
      render: (record) =>
        record.likesBerryFlavor?.name || record.likesBerryFlavor?.internalName || '-',
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudListSchema<Nature, NatureQuery, NatureFormModel, NatureFormModel>
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<Nature, NatureFormModel>({
  create: {
    buttonLabel: '新增性格',
    disabled: optionLoading,
    successMessage: '性格新增成功',
  },
  delete: {
    confirmMessage: '确认删除该性格吗？',
    successMessage: '性格删除成功',
  },
  edit: {
    dialogTitle: '编辑性格',
    successMessage: '性格更新成功',
  },
  fields,
  formGridClass: 'grid gap-4 md:grid-cols-2',
  indexColumn: true,
  modalWidth: 'min(96vw, 860px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = {
  initialize: loadOptions,
  ...createFlatCrudListSchema<Nature, NatureQuery, NatureFormModel, NatureFormModel>({
    fields,
    loadList: listNatures,
    createRecord: createNature,
    deleteRecord: deleteNature,
    updateRecord: updateNature,
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
