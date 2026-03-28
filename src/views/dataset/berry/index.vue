<script setup lang="ts">
import { ref } from 'vue'

import {
  createBerry,
  deleteBerry,
  getBerryPage,
  listBerryFirmnesses,
  listTypes,
  updateBerry,
} from '@/api'
import {
  createCrudConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudPageSchema,
  createIdRule,
  createRelation,
  CrudPage,
  hasId,
  pickRelationId,
  toSelectOptions,
} from '@/components'

import type { SelectOption } from 'naive-ui'

defineOptions({
  name: 'BerryPage',
})

const optionLoading = ref(false)
const firmnessOptions = ref<SelectOption[]>([])
const typeOptions = ref<SelectOption[]>([])

async function loadOptions() {
  optionLoading.value = true

  try {
    const [typeRes, firmnessRes] = await Promise.all([listTypes(), listBerryFirmnesses()])
    typeOptions.value = toSelectOptions(typeRes.data)
    firmnessOptions.value = toSelectOptions(firmnessRes.data)
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
      omitWhen: (value) => !hasId(value),
    },
  },
  {
    key: 'name',
    trim: true,
    form: {
      label: '树果名称',
      component: 'input',
      placeholder: '例如：桃桃果',
      rules: [{ required: true, message: '请输入树果名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '树果名称',
      component: 'input',
      placeholder: '输入树果名称',
    },
    table: {
      title: '树果名称',
      width: 140,
      fixed: 'left',
    },
  },
  {
    key: 'internalName',
    trim: true,
    form: {
      label: '内部名称',
      component: 'input',
      placeholder: '例如：pecha',
      rules: [{ required: true, message: '请输入内部名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '内部名称',
      component: 'input',
      placeholder: '输入内部名称',
    },
    table: {
      title: '内部名称',
      width: 160,
    },
  },
  {
    key: 'berryFirmnessId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.berryFirmness),
    },
    payload: {
      key: 'berryFirmness',
      toValue: (value) => createRelation(value as NullableId | undefined),
    },
    form: {
      label: '树果坚硬度',
      component: 'select',
      placeholder: '选择树果坚硬度',
      filterable: true,
      options: firmnessOptions,
      loading: optionLoading,
      rules: [createIdRule('树果坚硬度')],
    },
    search: {
      label: '树果坚硬度',
      component: 'select',
      placeholder: '选择树果坚硬度',
      clearable: true,
      filterable: true,
      options: firmnessOptions,
      loading: optionLoading,
    },
    table: {
      title: '坚硬度',
      width: 140,
      render: (record) => record.berryFirmness?.name || record.berryFirmness?.internalName || '-',
    },
  },
  {
    key: 'naturalGiftTypeId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.naturalGiftType),
    },
    payload: {
      key: 'naturalGiftType',
      toValue: (value) => createRelation(value as NullableId | undefined),
    },
    form: {
      label: '自然之恩属性',
      component: 'select',
      placeholder: '选择属性',
      filterable: true,
      options: typeOptions,
      loading: optionLoading,
      rules: [createIdRule('自然之恩属性')],
    },
    search: {
      label: '自然之恩属性',
      component: 'select',
      placeholder: '选择属性',
      clearable: true,
      filterable: true,
      options: typeOptions,
      loading: optionLoading,
    },
    table: {
      title: '自然之恩属性',
      width: 160,
      render: (record) =>
        record.naturalGiftType?.name || record.naturalGiftType?.internalName || '-',
    },
  },
  {
    key: 'naturalGiftPower',
    form: {
      label: '自然之恩威力',
      component: 'number',
      props: {
        min: 0,
        style: 'width: 100%',
      },
      rules: [
        { required: true, type: 'number', message: '请输入自然之恩威力', trigger: ['change', 'blur'] },
      ],
    },
    table: {
      title: '自然之恩威力',
      width: 140,
    },
  },
  {
    key: 'growthTime',
    form: {
      label: '生长时间（小时）',
      component: 'number',
      props: {
        min: 0,
        style: 'width: 100%',
      },
      rules: [
        { required: true, type: 'number', message: '请输入生长时间', trigger: ['change', 'blur'] },
      ],
    },
    table: {
      title: '生长时间(小时)',
      width: 140,
    },
  },
  {
    key: 'maxHarvest',
    form: {
      label: '最大结果数',
      component: 'number',
      props: {
        min: 0,
        style: 'width: 100%',
      },
      rules: [
        { required: true, type: 'number', message: '请输入最大结果数', trigger: ['change', 'blur'] },
      ],
    },
    table: {
      title: '最大结果数',
      width: 120,
    },
  },
  {
    key: 'bulk',
    form: {
      label: '大小（毫米）',
      component: 'number',
      props: {
        min: 0,
        style: 'width: 100%',
      },
      rules: [{ required: true, type: 'number', message: '请输入大小', trigger: ['change', 'blur'] }],
    },
    table: {
      title: '大小(mm)',
      width: 110,
    },
  },
  {
    key: 'smoothness',
    form: {
      label: '光滑度',
      component: 'number',
      props: {
        min: 0,
        style: 'width: 100%',
      },
      rules: [{ required: true, type: 'number', message: '请输入光滑度', trigger: ['change', 'blur'] }],
    },
    table: {
      title: '光滑度',
      width: 100,
    },
  },
  {
    key: 'soilDryness',
    form: {
      label: '土壤干燥速度',
      component: 'number',
      props: {
        min: 0,
        style: 'width: 100%',
      },
      rules: [
        { required: true, type: 'number', message: '请输入土壤干燥速度', trigger: ['change', 'blur'] },
      ],
    },
    table: {
      title: '土壤干燥速度',
      width: 130,
    },
  },
] as const satisfies Parameters<typeof createFlatCrudPageSchema<Berry, BerryQuery, BerryFormModel, Berry>>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<Berry, BerryFormModel>({
  create: {
    buttonLabel: '新增树果',
    disabled: optionLoading,
    successMessage: '树果新增成功',
  },
  delete: {
    confirmMessage: '确认删除该树果吗？',
    successMessage: '树果删除成功',
  },
  edit: {
    dialogTitle: '编辑树果',
    successMessage: '树果更新成功',
  },
  fields,
  formGridClass: 'grid gap-4 md:grid-cols-2',
  indexColumn: true,
  modalWidth: 'min(96vw, 900px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const pageSchema = {
  initialize: loadOptions,
  ...createFlatCrudPageSchema<Berry, BerryQuery, BerryFormModel, Berry>({
    fields,
    loadPage: getBerryPage,
    createRecord: createBerry,
    deleteRecord: deleteBerry,
    updateRecord: updateBerry,
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
