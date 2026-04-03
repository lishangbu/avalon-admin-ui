<script setup lang="ts">
import { ref } from 'vue'

import {
  createCreatureSpecies,
  deleteCreatureSpecies,
  getCreatureSpeciesPage,
  listGrowthRates,
  listCreatureColors,
  listCreatureHabitats,
  listCreatureShapes,
  updateCreatureSpecies,
} from '@/api'
import {
  createCrudConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudPageSchema,
  CrudPage,
  fromFlagValue,
  hasId,
  pickRelationId,
  toFlagValue,
  toSelectOptions,
} from '@/components'
import { YesNo } from '@/constants/yes-no'

import type { SelectOption } from 'naive-ui'

defineOptions({
  name: 'CreatureSpeciesPage',
})

const CREATURE_SPECIES_OPTION_PAGE_SIZE = 2000

const optionLoading = ref(false)
const growthRateOptions = ref<SelectOption[]>([])
const creatureColorOptions = ref<SelectOption[]>([])
const creatureHabitatOptions = ref<SelectOption[]>([])
const creatureShapeOptions = ref<SelectOption[]>([])
const creatureSpeciesOptions = ref<SelectOption[]>([])
const creatureSpeciesLabelMap = ref<Record<string, string>>({})

const flagOptions: SelectOption[] = [
  { label: '是', value: YesNo.Yes },
  { label: '否', value: YesNo.No },
]

function buildSpeciesLabelMap(items: CreatureSpecies[]) {
  return Object.fromEntries(
    items
      .filter((item): item is CreatureSpecies & { id: Id } => hasId(item.id))
      .map((item) => {
        const key = String(item.id)
        const label = item.name || item.internalName || `#${key}`
        return [key, label]
      }),
  )
}

function getSpeciesLabelById(id: NullableId | undefined) {
  if (!hasId(id)) {
    return '-'
  }

  return creatureSpeciesLabelMap.value[String(id)] || `#${id}`
}

function renderFlag(value: boolean | null | undefined) {
  if (typeof value !== 'boolean') {
    return '-'
  }

  return value ? '是' : '否'
}

async function loadOptions() {
  optionLoading.value = true

  try {
    const [growthRateRes, creatureColorRes, creatureHabitatRes, creatureShapeRes, creatureSpeciesRes] =
      await Promise.all([
        listGrowthRates(),
        listCreatureColors(),
        listCreatureHabitats(),
        listCreatureShapes(),
        getCreatureSpeciesPage({
          page: 1,
          size: CREATURE_SPECIES_OPTION_PAGE_SIZE,
          sort: 'sortingOrder,asc',
          query: {},
        }),
      ])

    growthRateOptions.value = toSelectOptions(growthRateRes.data)
    creatureColorOptions.value = toSelectOptions(creatureColorRes.data)
    creatureHabitatOptions.value = toSelectOptions(creatureHabitatRes.data)
    creatureShapeOptions.value = toSelectOptions(creatureShapeRes.data)
    creatureSpeciesOptions.value = toSelectOptions(creatureSpeciesRes.data.rows)
    creatureSpeciesLabelMap.value = buildSpeciesLabelMap(creatureSpeciesRes.data.rows)
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
      label: '种族名称',
      component: 'input',
      placeholder: '例如：妙蛙种子',
      rules: [{ required: true, message: '请输入种族名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '种族名称',
      component: 'input',
      placeholder: '输入种族名称',
    },
    table: {
      title: '种族名称',
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
      placeholder: '例如：bulbasaur',
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
    key: 'growthRateId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.growthRate),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '成长速度',
      component: 'select',
      placeholder: '选择成长速度',
      clearable: true,
      filterable: true,
      options: growthRateOptions,
      loading: optionLoading,
    },
    search: {
      label: '成长速度',
      component: 'select',
      placeholder: '选择成长速度',
      clearable: true,
      filterable: true,
      options: growthRateOptions,
      loading: optionLoading,
    },
    table: {
      title: '成长速度',
      width: 160,
      render: (record) => record.growthRate?.name || record.growthRate?.internalName || '-',
    },
  },
  {
    key: 'creatureColorId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.creatureColor),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '颜色',
      component: 'select',
      placeholder: '选择颜色',
      clearable: true,
      filterable: true,
      options: creatureColorOptions,
      loading: optionLoading,
    },
    search: {
      label: '颜色',
      component: 'select',
      placeholder: '选择颜色',
      clearable: true,
      filterable: true,
      options: creatureColorOptions,
      loading: optionLoading,
    },
    table: {
      title: '颜色',
      width: 140,
      render: (record) => record.creatureColor?.name || record.creatureColor?.internalName || '-',
    },
  },
  {
    key: 'creatureHabitatId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.creatureHabitat),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '栖息地',
      component: 'select',
      placeholder: '选择栖息地',
      clearable: true,
      filterable: true,
      options: creatureHabitatOptions,
      loading: optionLoading,
    },
    search: {
      label: '栖息地',
      component: 'select',
      placeholder: '选择栖息地',
      clearable: true,
      filterable: true,
      options: creatureHabitatOptions,
      loading: optionLoading,
    },
    table: {
      title: '栖息地',
      width: 160,
      render: (record) =>
        record.creatureHabitat?.name || record.creatureHabitat?.internalName || '-',
    },
  },
  {
    key: 'creatureShapeId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.creatureShape),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '形状',
      component: 'select',
      placeholder: '选择形状',
      clearable: true,
      filterable: true,
      options: creatureShapeOptions,
      loading: optionLoading,
    },
    search: {
      label: '形状',
      component: 'select',
      placeholder: '选择形状',
      clearable: true,
      filterable: true,
      options: creatureShapeOptions,
      loading: optionLoading,
    },
    table: {
      title: '形状',
      width: 160,
      render: (record) => record.creatureShape?.name || record.creatureShape?.internalName || '-',
    },
  },
  {
    key: 'sortingOrder',
    form: {
      label: '排序顺序',
      component: 'number',
      props: numberInputProps,
    },
    table: {
      title: '排序顺序',
      width: 120,
    },
  },
  {
    key: 'genderRate',
    form: {
      label: '性别比率',
      component: 'number',
      props: numberInputProps,
    },
    table: {
      title: '性别比率',
      width: 120,
    },
  },
  {
    key: 'captureRate',
    form: {
      label: '捕获率',
      component: 'number',
      props: numberInputProps,
    },
    table: {
      title: '捕获率',
      width: 110,
    },
  },
  {
    key: 'baseHappiness',
    form: {
      label: '基础亲密度',
      component: 'number',
      props: numberInputProps,
    },
    table: {
      title: '基础亲密度',
      width: 130,
    },
  },
  {
    key: 'hatchCounter',
    form: {
      label: '孵化计数器',
      component: 'number',
      props: numberInputProps,
    },
    table: {
      title: '孵化计数器',
      width: 130,
    },
  },
  {
    key: 'evolvesFromSpeciesId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => record.evolvesFromSpeciesId ?? null,
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '前置进化种族',
      component: 'select',
      placeholder: '选择前置进化种族',
      clearable: true,
      filterable: true,
      options: creatureSpeciesOptions,
      loading: optionLoading,
    },
    search: {
      label: '前置进化种族',
      component: 'select',
      placeholder: '选择前置进化种族',
      clearable: true,
      filterable: true,
      options: creatureSpeciesOptions,
      loading: optionLoading,
    },
    table: {
      title: '前置进化种族',
      width: 180,
      render: (record) => getSpeciesLabelById(record.evolvesFromSpeciesId),
    },
  },
  {
    key: 'evolutionChainId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => record.evolutionChainId ?? null,
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '进化链 ID',
      component: 'number',
      props: numberInputProps,
    },
    search: {
      label: '进化链 ID',
      component: 'input',
      placeholder: '输入进化链 ID',
    },
    table: {
      title: '进化链 ID',
      width: 130,
      render: (record) => record.evolutionChainId ?? '-',
    },
  },
  {
    key: 'baby',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => toFlagValue(record.baby),
    },
    payload: {
      toValue: (value) => fromFlagValue(value as NullableYesNo),
    },
    form: {
      label: '幼年种',
      component: 'select',
      placeholder: '请选择',
      clearable: true,
      options: flagOptions,
    },
    table: {
      title: '幼年种',
      width: 100,
      render: (record) => renderFlag(record.baby),
    },
  },
  {
    key: 'legendary',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => toFlagValue(record.legendary),
    },
    payload: {
      toValue: (value) => fromFlagValue(value as NullableYesNo),
    },
    form: {
      label: '传说',
      component: 'select',
      placeholder: '请选择',
      clearable: true,
      options: flagOptions,
    },
    table: {
      title: '传说',
      width: 100,
      render: (record) => renderFlag(record.legendary),
    },
  },
  {
    key: 'mythical',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => toFlagValue(record.mythical),
    },
    payload: {
      toValue: (value) => fromFlagValue(value as NullableYesNo),
    },
    form: {
      label: '是否幻之生物',
      component: 'select',
      placeholder: '请选择',
      clearable: true,
      options: flagOptions,
    },
    table: {
      title: '是否幻之生物',
      width: 100,
      render: (record) => renderFlag(record.mythical),
    },
  },
  {
    key: 'hasGenderDifferences',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => toFlagValue(record.hasGenderDifferences),
    },
    payload: {
      toValue: (value) => fromFlagValue(value as NullableYesNo),
    },
    form: {
      label: '性别差异',
      component: 'select',
      placeholder: '请选择',
      clearable: true,
      options: flagOptions,
    },
    table: {
      title: '性别差异',
      width: 120,
      render: (record) => renderFlag(record.hasGenderDifferences),
    },
  },
  {
    key: 'formsSwitchable',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => toFlagValue(record.formsSwitchable),
    },
    payload: {
      toValue: (value) => fromFlagValue(value as NullableYesNo),
    },
    form: {
      label: '形态可切换',
      component: 'select',
      placeholder: '请选择',
      clearable: true,
      options: flagOptions,
    },
    table: {
      title: '形态可切换',
      width: 130,
      render: (record) => renderFlag(record.formsSwitchable),
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudPageSchema<
    CreatureSpecies,
    CreatureSpeciesQuery,
    CreatureSpeciesFormModel,
    CreatureSpeciesFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<CreatureSpecies, CreatureSpeciesFormModel>({
  create: {
    buttonLabel: '新增生物种族',
    disabled: optionLoading,
    successMessage: '生物种族新增成功',
  },
  delete: {
    confirmMessage: '确认删除该生物种族吗？',
    successMessage: '生物种族删除成功',
  },
  edit: {
    dialogTitle: '编辑生物种族',
    successMessage: '生物种族更新成功',
  },
  fields,
  formGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3',
  indexColumn: true,
  modalWidth: 'min(96vw, 1280px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const pageSchema = {
  initialize: loadOptions,
  ...createFlatCrudPageSchema<
    CreatureSpecies,
    CreatureSpeciesQuery,
    CreatureSpeciesFormModel,
    CreatureSpeciesFormModel
  >({
    fields,
    loadPage: getCreatureSpeciesPage,
    createRecord: createCreatureSpecies,
    deleteRecord: deleteCreatureSpecies,
    updateRecord: updateCreatureSpecies,
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
