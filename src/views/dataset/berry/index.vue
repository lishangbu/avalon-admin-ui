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
  createIdRule,
  CrudPage,
  hasId,
  toSelectOptions,
} from '@/components'

import type { CrudInterfaceSchema, CrudPageSchema } from '@/components'
import type { FormRules, SelectOption } from 'naive-ui'

defineOptions({
  name: 'BerryPage',
})

const optionLoading = ref(false)
const firmnessOptions = ref<SelectOption[]>([])
const typeOptions = ref<SelectOption[]>([])

const formRules: FormRules = {
  internalName: [{ required: true, message: '请输入内部名称', trigger: ['input', 'blur'] }],
  name: [{ required: true, message: '请输入树果名称', trigger: ['input', 'blur'] }],
  growthTime: [{ required: true, type: 'number', message: '请输入生长时间', trigger: ['change', 'blur'] }],
  maxHarvest: [{ required: true, type: 'number', message: '请输入最大结果数', trigger: ['change', 'blur'] }],
  bulk: [{ required: true, type: 'number', message: '请输入大小', trigger: ['change', 'blur'] }],
  smoothness: [{ required: true, type: 'number', message: '请输入光滑度', trigger: ['change', 'blur'] }],
  soilDryness: [{ required: true, type: 'number', message: '请输入土壤干燥速度', trigger: ['change', 'blur'] }],
  berryFirmnessId: [createIdRule('树果坚硬度')],
  naturalGiftTypeId: [createIdRule('自然之恩属性')],
  naturalGiftPower: [{ required: true, type: 'number', message: '请输入自然之恩威力', trigger: ['change', 'blur'] }],
}

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

const interfaceSchema: CrudInterfaceSchema<Berry> = {
  createLabel: '新增树果',
  createDisabled: optionLoading,
  createTitle: '新增树果',
  createSuccessMessage: '树果新增成功',
  deleteConfirmMessage: '确认删除该树果吗？',
  deleteSuccessMessage: '树果删除成功',
  editTitle: '编辑树果',
  formFields: [
    {
      key: 'name',
      label: '树果名称',
      type: 'input',
      placeholder: '例如：桃桃果',
    },
    {
      key: 'internalName',
      label: '内部名称',
      type: 'input',
      placeholder: '例如：pecha',
    },
    {
      key: 'berryFirmnessId',
      label: '树果坚硬度',
      type: 'select',
      placeholder: '选择树果坚硬度',
      filterable: true,
      options: firmnessOptions,
      loading: optionLoading,
    },
    {
      key: 'naturalGiftTypeId',
      label: '自然之恩属性',
      type: 'select',
      placeholder: '选择属性',
      filterable: true,
      options: typeOptions,
      loading: optionLoading,
    },
    {
      key: 'naturalGiftPower',
      label: '自然之恩威力',
      type: 'number',
      props: {
        min: 0,
        style: 'width: 100%',
      },
    },
    {
      key: 'growthTime',
      label: '生长时间（小时）',
      type: 'number',
      props: {
        min: 0,
        style: 'width: 100%',
      },
    },
    {
      key: 'maxHarvest',
      label: '最大结果数',
      type: 'number',
      props: {
        min: 0,
        style: 'width: 100%',
      },
    },
    {
      key: 'bulk',
      label: '大小（毫米）',
      type: 'number',
      props: {
        min: 0,
        style: 'width: 100%',
      },
    },
    {
      key: 'smoothness',
      label: '光滑度',
      type: 'number',
      props: {
        min: 0,
        style: 'width: 100%',
      },
    },
    {
      key: 'soilDryness',
      label: '土壤干燥速度',
      type: 'number',
      props: {
        min: 0,
        style: 'width: 100%',
      },
    },
  ],
  formGridClass: 'grid gap-4 md:grid-cols-2',
  formRules,
  modalWidth: 'min(96vw, 900px)',
  searchFields: [
    {
      key: 'name',
      label: '树果名称',
      type: 'input',
      placeholder: '输入树果名称',
    },
    {
      key: 'internalName',
      label: '内部名称',
      type: 'input',
      placeholder: '输入内部名称',
    },
    {
      key: 'berryFirmnessId',
      label: '树果坚硬度',
      type: 'select',
      placeholder: '选择树果坚硬度',
      clearable: true,
      filterable: true,
      options: firmnessOptions,
      loading: optionLoading,
    },
    {
      key: 'naturalGiftTypeId',
      label: '自然之恩属性',
      type: 'select',
      placeholder: '选择属性',
      clearable: true,
      filterable: true,
      options: typeOptions,
      loading: optionLoading,
    },
  ],
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
  indexColumn: true,
  tableColumns: [
    {
      title: '树果名称',
      key: 'name',
      width: 140,
      fixed: 'left',
    },
    {
      title: '内部名称',
      key: 'internalName',
      width: 160,
    },
    {
      title: '坚硬度',
      key: 'berryFirmness',
      width: 140,
      render: (record) => record.berryFirmness?.name || record.berryFirmness?.internalName || '-',
    },
    {
      title: '自然之恩属性',
      key: 'naturalGiftType',
      width: 160,
      render: (record) => record.naturalGiftType?.name || record.naturalGiftType?.internalName || '-',
    },
    {
      title: '自然之恩威力',
      key: 'naturalGiftPower',
      width: 140,
    },
    {
      title: '生长时间(小时)',
      key: 'growthTime',
      width: 140,
    },
    {
      title: '最大结果数',
      key: 'maxHarvest',
      width: 120,
    },
    {
      title: '大小(mm)',
      key: 'bulk',
      width: 110,
    },
    {
      title: '光滑度',
      key: 'smoothness',
      width: 100,
    },
    {
      title: '土壤干燥速度',
      key: 'soilDryness',
      width: 130,
    },
  ],
  updateSuccessMessage: '树果更新成功',
}

const pageSchema: CrudPageSchema<Berry, BerryQuery, BerryFormModel, Berry> = {
  initialize: loadOptions,
  loadPage: getBerryPage,
  mapRecordToFormModel: (record) => ({
    id: record.id ?? null,
    internalName: record.internalName ?? '',
    name: record.name ?? '',
    growthTime: record.growthTime ?? null,
    maxHarvest: record.maxHarvest ?? null,
    bulk: record.bulk ?? null,
    smoothness: record.smoothness ?? null,
    soilDryness: record.soilDryness ?? null,
    berryFirmnessId: record.berryFirmness?.id ?? null,
    naturalGiftTypeId: record.naturalGiftType?.id ?? null,
    naturalGiftPower: record.naturalGiftPower ?? null,
  }),
  createRecord: createBerry,
  createFormModel: () => ({
    id: null,
    internalName: '',
    name: '',
    growthTime: null,
    maxHarvest: null,
    bulk: null,
    smoothness: null,
    soilDryness: null,
    berryFirmnessId: null,
    naturalGiftTypeId: null,
    naturalGiftPower: null,
  }),
  createPayload: (form) => ({
    ...(hasId(form.id) ? { id: form.id } : {}),
    internalName: form.internalName.trim(),
    name: form.name.trim(),
    growthTime: form.growthTime,
    maxHarvest: form.maxHarvest,
    bulk: form.bulk,
    smoothness: form.smoothness,
    soilDryness: form.soilDryness,
    berryFirmness: hasId(form.berryFirmnessId) ? { id: form.berryFirmnessId } : null,
    naturalGiftType: hasId(form.naturalGiftTypeId) ? { id: form.naturalGiftTypeId } : null,
    naturalGiftPower: form.naturalGiftPower,
  }),
  createSearchModel: () => ({
    internalName: '',
    name: '',
    berryFirmnessId: null,
    naturalGiftTypeId: null,
  }),
  deleteRecord: (record) => {
    if (!hasId(record.id)) {
      return Promise.reject(new Error('Missing berry id'))
    }

    return deleteBerry(record.id)
  },
  updateRecord: updateBerry,
}

const config = createCrudConfig({
  interface: interfaceSchema,
  page: pageSchema,
})
</script>

<template>
  <CrudPage :config="config" />
</template>
