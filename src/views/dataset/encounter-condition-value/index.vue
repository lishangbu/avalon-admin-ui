<script setup lang="ts">
import { ref } from 'vue'

import {
  createEncounterConditionValue,
  deleteEncounterConditionValue,
  listEncounterConditions,
  listEncounterConditionValues,
  updateEncounterConditionValue,
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
  name: 'EncounterConditionValuePage',
})

const optionLoading = ref(false)
const encounterConditionOptions = ref<SelectOption[]>([])

async function loadOptions() {
  optionLoading.value = true

  try {
    const response = await listEncounterConditions()
    encounterConditionOptions.value = toSelectOptions(response.data)
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
      label: '遭遇条件值名称',
      component: 'input',
      placeholder: '例如：During a swarm',
      rules: [{ required: true, message: '请输入遭遇条件值名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '遭遇条件值名称',
      component: 'input',
      placeholder: '输入遭遇条件值名称',
    },
    table: {
      title: '遭遇条件值名称',
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
      placeholder: '例如：swarm-yes',
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
    key: 'encounterConditionId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.encounterCondition),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '遭遇条件',
      component: 'select',
      placeholder: '选择遭遇条件',
      clearable: true,
      filterable: true,
      options: encounterConditionOptions,
      loading: optionLoading,
      rules: [{ required: true, message: '请选择遭遇条件', trigger: ['change', 'blur'] }],
    },
    search: {
      label: '遭遇条件',
      component: 'select',
      placeholder: '选择遭遇条件',
      clearable: true,
      filterable: true,
      options: encounterConditionOptions,
      loading: optionLoading,
    },
    table: {
      title: '遭遇条件',
      width: 180,
      render: (record) =>
        record.encounterCondition?.name || record.encounterCondition?.internalName || '-',
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudListSchema<
    EncounterConditionValue,
    EncounterConditionValueQuery,
    EncounterConditionValueFormModel,
    EncounterConditionValueFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<
  EncounterConditionValue,
  EncounterConditionValueFormModel
>({
  create: {
    buttonLabel: '新增遭遇条件值',
    disabled: optionLoading,
    successMessage: '遭遇条件值新增成功',
  },
  delete: {
    confirmMessage: '确认删除该遭遇条件值吗？',
    successMessage: '遭遇条件值删除成功',
  },
  edit: {
    dialogTitle: '编辑遭遇条件值',
    successMessage: '遭遇条件值更新成功',
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
    EncounterConditionValue,
    EncounterConditionValueQuery,
    EncounterConditionValueFormModel,
    EncounterConditionValueFormModel
  >({
    fields,
    loadList: listEncounterConditionValues,
    createRecord: createEncounterConditionValue,
    deleteRecord: deleteEncounterConditionValue,
    updateRecord: updateEncounterConditionValue,
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
