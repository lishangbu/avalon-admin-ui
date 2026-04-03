<script setup lang="ts">
import { ref } from 'vue'

import { createStat, deleteStat, listMoveDamageClasses, listStats, updateStat } from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  fromFlagValue,
  hasId,
  pickRelationId,
  toFlagValue,
  toSelectOptions,
} from '@/components'
import { YesNo } from '@/constants/yes-no'

import type { SelectOption } from 'naive-ui'

defineOptions({
  name: 'StatPage',
})

const optionLoading = ref(false)
const moveDamageClassOptions = ref<SelectOption[]>([])

const battleOnlyOptions: SelectOption[] = [
  { label: '是', value: YesNo.Yes },
  { label: '否', value: YesNo.No },
]

const readonlyOptions: SelectOption[] = [
  { label: '是', value: YesNo.Yes },
  { label: '否', value: YesNo.No },
]

function isReadonlyFormModel(model: Partial<StatFormModel>) {
  return model.readonly === 1
}

async function loadOptions() {
  optionLoading.value = true

  try {
    const moveDamageClassRes = await listMoveDamageClasses()
    moveDamageClassOptions.value = toSelectOptions(moveDamageClassRes.data)
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
      label: '能力名称',
      component: 'input',
      placeholder: '例如：HP',
      disabled: ({ mode, model }) => mode === 'edit' && isReadonlyFormModel(model as StatFormModel),
      rules: [{ required: true, message: '请输入属性名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '能力名称',
      component: 'input',
      placeholder: '输入能力名称',
    },
    table: {
      title: '能力名称',
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
      placeholder: '例如：hp',
      disabled: ({ mode, model }) => mode === 'edit' && isReadonlyFormModel(model as StatFormModel),
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
    key: 'gameIndex',
    form: {
      label: '游戏索引',
      component: 'number',
      disabled: ({ mode, model }) => mode === 'edit' && isReadonlyFormModel(model as StatFormModel),
      props: {
        min: 0,
        style: 'width: 100%',
      },
      rules: [
        { required: true, type: 'number', message: '请输入游戏索引', trigger: ['change', 'blur'] },
      ],
    },
    table: {
      title: '游戏索引',
      width: 120,
    },
  },
  {
    key: 'battleOnly',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => toFlagValue(record.battleOnly),
    },
    payload: {
      toValue: (value) => fromFlagValue(value as NullableYesNo),
    },
    form: {
      label: '仅战斗属性',
      component: 'select',
      placeholder: '请选择',
      disabled: ({ mode, model }) => mode === 'edit' && isReadonlyFormModel(model as StatFormModel),
      options: battleOnlyOptions,
      rules: [
        { required: true, type: 'number', message: '请选择是否仅战斗属性', trigger: ['change'] },
      ],
    },
    table: {
      title: '仅战斗属性',
      width: 120,
      render: (record) => {
        if (typeof record.battleOnly !== 'boolean') {
          return '-'
        }

        return record.battleOnly ? '是' : '否'
      },
    },
  },
  {
    key: 'readonly',
    formModel: {
      defaultValue: YesNo.No,
      fromRecord: (record) => toFlagValue(record.readonly, YesNo.No),
    },
    payload: {
      toValue: (value) => fromFlagValue(value as NullableYesNo),
    },
    form: {
      label: '只读',
      component: 'select',
      placeholder: '请选择',
      disabled: ({ mode, model }) => mode === 'edit' && isReadonlyFormModel(model as StatFormModel),
      options: readonlyOptions,
      rules: [{ required: true, type: 'number', message: '请选择是否只读', trigger: ['change'] }],
    },
    search: {
      label: '只读',
      component: 'select',
      placeholder: '请选择是否只读',
      clearable: true,
      options: readonlyOptions,
    },
    table: {
      title: '只读',
      width: 100,
      render: (record) => {
        if (typeof record.readonly !== 'boolean') {
          return '-'
        }

        return record.readonly ? '是' : '否'
      },
    },
  },
  {
    key: 'moveDamageClassId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.moveDamageClass),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '招式伤害类别',
      component: 'select',
      placeholder: '选择招式伤害类别',
      disabled: ({ mode, model }) => mode === 'edit' && isReadonlyFormModel(model as StatFormModel),
      clearable: true,
      filterable: true,
      options: moveDamageClassOptions,
      loading: optionLoading,
    },
    search: {
      label: '招式伤害类别',
      component: 'select',
      placeholder: '选择招式伤害类别',
      clearable: true,
      filterable: true,
      options: moveDamageClassOptions,
      loading: optionLoading,
    },
    table: {
      title: '招式伤害类别',
      width: 180,
      render: (record) =>
        record.moveDamageClass?.name || record.moveDamageClass?.internalName || '-',
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudListSchema<Stat, StatQuery, StatFormModel, Stat>
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<Stat, StatFormModel>({
  create: {
    buttonLabel: '新增能力',
    disabled: optionLoading,
    successMessage: '能力新增成功',
  },
  delete: {
    confirmMessage: '确认删除该能力吗？',
    disabled: (record) => record.readonly === true,
    successMessage: '能力删除成功',
  },
  edit: {
    dialogTitle: '编辑能力',
    submitDisabled: ({ model }) => isReadonlyFormModel(model as StatFormModel),
    successMessage: '能力更新成功',
  },
  fields,
  formGridClass: 'grid gap-4 md:grid-cols-2',
  indexColumn: true,
  modalWidth: 'min(92vw, 680px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = {
  initialize: loadOptions,
  ...createFlatCrudListSchema<Stat, StatQuery, StatFormModel, Stat>({
    fields,
    loadList: listStats,
    createRecord: createStat,
    deleteRecord: deleteStat,
    updateRecord: updateStat,
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
