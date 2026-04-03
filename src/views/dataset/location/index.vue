<script setup lang="ts">
import { ref } from 'vue'

import { createLocation, deleteLocation, getLocationPage, listRegions, updateLocation } from '@/api'
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
  name: 'LocationPage',
})

const optionLoading = ref(false)
const regionOptions = ref<SelectOption[]>([])

async function loadOptions() {
  optionLoading.value = true

  try {
    const regionRes = await listRegions()
    regionOptions.value = toSelectOptions(regionRes.data)
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
      label: '地点名称',
      component: 'input',
      placeholder: '例如：Canalave City',
      rules: [{ required: true, message: '请输入地点名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '地点名称',
      component: 'input',
      placeholder: '输入地点名称',
    },
    table: {
      title: '地点名称',
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
      placeholder: '例如：canalave-city',
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
    key: 'regionId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.region),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '所属地区',
      component: 'select',
      placeholder: '选择所属地区',
      clearable: true,
      filterable: true,
      options: regionOptions,
      loading: optionLoading,
    },
    search: {
      label: '所属地区',
      component: 'select',
      placeholder: '选择所属地区',
      clearable: true,
      filterable: true,
      options: regionOptions,
      loading: optionLoading,
    },
    table: {
      title: '所属地区',
      width: 160,
      render: (record) => record.region?.name || record.region?.internalName || '-',
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudPageSchema<Location, LocationQuery, LocationFormModel, LocationFormModel>
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<Location, LocationFormModel>({
  create: {
    buttonLabel: '新增地点',
    disabled: optionLoading,
    successMessage: '地点新增成功',
  },
  delete: {
    confirmMessage: '确认删除该地点吗？',
    successMessage: '地点删除成功',
  },
  edit: {
    dialogTitle: '编辑地点',
    successMessage: '地点更新成功',
  },
  fields,
  formGridClass: 'grid gap-4 md:grid-cols-2',
  indexColumn: true,
  modalWidth: 'min(96vw, 900px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const pageSchema = {
  initialize: loadOptions,
  ...createFlatCrudPageSchema<Location, LocationQuery, LocationFormModel, LocationFormModel>({
    fields,
    loadPage: getLocationPage,
    createRecord: createLocation,
    deleteRecord: deleteLocation,
    updateRecord: updateLocation,
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
