<script setup lang="ts">
import { ref } from 'vue'

import {
  createLocationArea,
  deleteLocationArea,
  getLocationAreaPage,
  listLocations,
  updateLocationArea,
} from '@/api'
import {
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
  name: 'LocationAreaPage',
})

const optionLoading = ref(false)
const locationOptions = ref<SelectOption[]>([])

async function loadOptions() {
  optionLoading.value = true

  try {
    const locationRes = await listLocations()
    locationOptions.value = toSelectOptions(locationRes.data)
  } finally {
    optionLoading.value = false
  }
}

const numberInputProps = {
  min: 0,
  style: 'width: 100%',
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
      label: 'ID',
      component: 'input',
      placeholder: '输入 ID',
    },
    table: {
      title: 'ID',
      width: 120,
    },
  },
  {
    key: 'name',
    trim: true,
    form: {
      label: '地点区域名称',
      component: 'input',
      placeholder: '例如：Canalave City',
      rules: [{ required: true, message: '请输入地点区域名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '地点区域名称',
      component: 'input',
      placeholder: '输入地点区域名称',
    },
    table: {
      title: '地点区域名称',
      width: 220,
      fixed: 'left',
    },
  },
  {
    key: 'internalName',
    trim: true,
    form: {
      label: '内部名称',
      component: 'input',
      placeholder: '例如：canalave-city-area',
      rules: [{ required: true, message: '请输入内部名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '内部名称',
      component: 'input',
      placeholder: '输入内部名称',
    },
    table: {
      title: '内部名称',
      width: 240,
    },
  },
  {
    key: 'locationId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.location),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '所属地点',
      component: 'select',
      placeholder: '选择所属地点',
      clearable: true,
      filterable: true,
      options: locationOptions,
      loading: optionLoading,
      rules: [{ required: true, message: '请选择所属地点', trigger: ['change'] }],
    },
    search: {
      label: '所属地点',
      component: 'select',
      placeholder: '选择所属地点',
      clearable: true,
      filterable: true,
      options: locationOptions,
      loading: optionLoading,
    },
    table: {
      title: '所属地点',
      width: 180,
      render: (record) => record.location?.name || record.location?.internalName || '-',
    },
  },
  {
    key: 'gameIndex',
    form: {
      label: '游戏索引',
      component: 'number',
      props: numberInputProps,
      rules: [{ required: true, type: 'number', message: '请输入游戏索引', trigger: ['change'] }],
    },
    table: {
      title: '游戏索引',
      width: 120,
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudPageSchema<
    LocationArea,
    LocationAreaQuery,
    LocationAreaFormModel,
    LocationAreaFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<LocationArea, LocationAreaFormModel>({
  create: {
    buttonLabel: '新增地点区域',
    disabled: optionLoading,
    successMessage: '地点区域新增成功',
  },
  delete: {
    confirmMessage: '确认删除该地点区域吗？',
    successMessage: '地点区域删除成功',
  },
  edit: {
    dialogTitle: '编辑地点区域',
    successMessage: '地点区域更新成功',
  },
  fields,
  formGridClass: 'grid gap-4 md:grid-cols-2',
  indexColumn: true,
  modalWidth: 'min(96vw, 980px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const pageSchema = {
  initialize: loadOptions,
  ...createFlatCrudPageSchema<
    LocationArea,
    LocationAreaQuery,
    LocationAreaFormModel,
    LocationAreaFormModel
  >({
    fields,
    loadPage: getLocationAreaPage,
    createRecord: createLocationArea,
    deleteRecord: deleteLocationArea,
    updateRecord: updateLocationArea,
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
