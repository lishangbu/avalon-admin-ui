<script setup lang="ts">
import { ref } from 'vue'

import {
  createPokemonEvolution,
  deletePokemonEvolution,
  getItemPage,
  getMovePage,
  getPokemonEvolutionPage,
  getPokemonFormPage,
  getPokemonSpeciesPage,
  listEvolutionChains,
  listEvolutionTriggers,
  listGenders,
  listLocations,
  listRegions,
  listTypes,
  updatePokemonEvolution,
} from '@/api'
import {
  createCrudConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudPageSchema,
  CrudPage,
  createIdRule,
  fromFlagValue,
  hasId,
  pickRelationId,
  toFlagValue,
  toSelectOptions,
} from '@/components'

import type { SelectOption } from 'naive-ui'

defineOptions({
  name: 'PokemonEvolutionPage',
})

const SPECIES_OPTION_PAGE_SIZE = 2500
const ITEM_OPTION_PAGE_SIZE = 5000
const MOVE_OPTION_PAGE_SIZE = 5000
const FORM_OPTION_PAGE_SIZE = 3000

const optionLoading = ref(false)
const evolutionChainOptions = ref<SelectOption[]>([])
const pokemonSpeciesOptions = ref<SelectOption[]>([])
const itemOptions = ref<SelectOption[]>([])
const moveOptions = ref<SelectOption[]>([])
const typeOptions = ref<SelectOption[]>([])
const locationOptions = ref<SelectOption[]>([])
const regionOptions = ref<SelectOption[]>([])
const pokemonFormOptions = ref<SelectOption[]>([])
const triggerOptions = ref<SelectOption[]>([])
const genderOptions = ref<SelectOption[]>([])

const flagOptions: SelectOption[] = [
  { label: '是', value: YesNo.Yes },
  { label: '否', value: YesNo.No },
]

function toNullableText(value: unknown) {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

function toEvolutionChainOptions(items: EvolutionChain[]) {
  return items
    .filter((item): item is EvolutionChain & { id: Id } => hasId(item.id))
    .map((item) => ({
      value: item.id!,
      label: item.babyTriggerItem?.internalName
        ? `#${item.id} (${item.babyTriggerItem.internalName})`
        : `#${item.id}`,
    }))
}

async function loadOptions() {
  optionLoading.value = true

  try {
    const [
      evolutionChainRes,
      pokemonSpeciesRes,
      itemRes,
      moveRes,
      typeRes,
      locationRes,
      regionRes,
      pokemonFormRes,
      triggerRes,
      genderRes,
    ] = await Promise.all([
      listEvolutionChains(),
      getPokemonSpeciesPage({
        page: 1,
        size: SPECIES_OPTION_PAGE_SIZE,
        sort: 'sortingOrder,asc',
        query: {},
      }),
      getItemPage({
        page: 1,
        size: ITEM_OPTION_PAGE_SIZE,
        sort: 'id,asc',
        query: {},
      }),
      getMovePage({
        page: 1,
        size: MOVE_OPTION_PAGE_SIZE,
        sort: 'id,asc',
        query: {},
      }),
      listTypes(),
      listLocations(),
      listRegions(),
      getPokemonFormPage({
        page: 1,
        size: FORM_OPTION_PAGE_SIZE,
        sort: 'sortingOrder,asc',
        query: {},
      }),
      listEvolutionTriggers(),
      listGenders(),
    ])

    evolutionChainOptions.value = toEvolutionChainOptions(evolutionChainRes.data)
    pokemonSpeciesOptions.value = toSelectOptions(pokemonSpeciesRes.data.rows)
    itemOptions.value = toSelectOptions(itemRes.data.rows)
    moveOptions.value = toSelectOptions(moveRes.data.rows)
    typeOptions.value = toSelectOptions(typeRes.data)
    locationOptions.value = toSelectOptions(locationRes.data)
    regionOptions.value = toSelectOptions(regionRes.data)
    pokemonFormOptions.value = toSelectOptions(pokemonFormRes.data.rows)
    triggerOptions.value = toSelectOptions(triggerRes.data)
    genderOptions.value = toSelectOptions(genderRes.data)
  } finally {
    optionLoading.value = false
  }
}

const numberInputProps = {
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
    key: 'evolutionChainId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.evolutionChain),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '进化链',
      component: 'select',
      placeholder: '选择进化链',
      clearable: true,
      filterable: true,
      options: evolutionChainOptions,
      loading: optionLoading,
      rules: [createIdRule('进化链')],
    },
    search: {
      label: '进化链',
      component: 'select',
      placeholder: '选择进化链',
      clearable: true,
      filterable: true,
      options: evolutionChainOptions,
      loading: optionLoading,
    },
    table: {
      title: '进化链',
      width: 150,
      render: (record) => (hasId(record.evolutionChain?.id) ? `#${record.evolutionChain?.id}` : '-'),
    },
  },
  {
    key: 'fromPokemonSpeciesId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.fromPokemonSpecies),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '起始种族',
      component: 'select',
      placeholder: '选择起始种族',
      clearable: true,
      filterable: true,
      options: pokemonSpeciesOptions,
      loading: optionLoading,
      rules: [createIdRule('起始种族')],
    },
    search: {
      label: '起始种族',
      component: 'select',
      placeholder: '选择起始种族',
      clearable: true,
      filterable: true,
      options: pokemonSpeciesOptions,
      loading: optionLoading,
    },
    table: {
      title: '起始种族',
      width: 180,
      fixed: 'left',
      render: (record) =>
        record.fromPokemonSpecies?.name || record.fromPokemonSpecies?.internalName || '-',
    },
  },
  {
    key: 'toPokemonSpeciesId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.toPokemonSpecies),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '目标种族',
      component: 'select',
      placeholder: '选择目标种族',
      clearable: true,
      filterable: true,
      options: pokemonSpeciesOptions,
      loading: optionLoading,
      rules: [createIdRule('目标种族')],
    },
    search: {
      label: '目标种族',
      component: 'select',
      placeholder: '选择目标种族',
      clearable: true,
      filterable: true,
      options: pokemonSpeciesOptions,
      loading: optionLoading,
    },
    table: {
      title: '目标种族',
      width: 180,
      fixed: 'left',
      render: (record) =>
        record.toPokemonSpecies?.name || record.toPokemonSpecies?.internalName || '-',
    },
  },
  {
    key: 'triggerId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.trigger),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '触发方式',
      component: 'select',
      placeholder: '选择触发方式',
      clearable: true,
      filterable: true,
      options: triggerOptions,
      loading: optionLoading,
    },
    search: {
      label: '触发方式',
      component: 'select',
      placeholder: '选择触发方式',
      clearable: true,
      filterable: true,
      options: triggerOptions,
      loading: optionLoading,
    },
    table: {
      title: '触发方式',
      width: 160,
      render: (record) => record.trigger?.name || record.trigger?.internalName || '-',
    },
  },
  {
    key: 'itemId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.item),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '使用道具',
      component: 'select',
      placeholder: '选择使用道具',
      clearable: true,
      filterable: true,
      options: itemOptions,
      loading: optionLoading,
    },
    search: {
      label: '使用道具',
      component: 'select',
      placeholder: '选择使用道具',
      clearable: true,
      filterable: true,
      options: itemOptions,
      loading: optionLoading,
    },
    table: {
      title: '使用道具',
      width: 180,
      render: (record) => record.item?.name || record.item?.internalName || '-',
    },
  },
  {
    key: 'heldItemId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.heldItem),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '携带道具',
      component: 'select',
      placeholder: '选择携带道具',
      clearable: true,
      filterable: true,
      options: itemOptions,
      loading: optionLoading,
    },
    table: {
      title: '携带道具',
      width: 180,
      render: (record) => record.heldItem?.name || record.heldItem?.internalName || '-',
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
      label: '地点',
      component: 'select',
      placeholder: '选择地点',
      clearable: true,
      filterable: true,
      options: locationOptions,
      loading: optionLoading,
    },
    search: {
      label: '地点',
      component: 'select',
      placeholder: '选择地点',
      clearable: true,
      filterable: true,
      options: locationOptions,
      loading: optionLoading,
    },
    table: {
      title: '地点',
      width: 180,
      render: (record) => record.location?.name || record.location?.internalName || '-',
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
      label: '地区',
      component: 'select',
      placeholder: '选择地区',
      clearable: true,
      filterable: true,
      options: regionOptions,
      loading: optionLoading,
    },
    table: {
      title: '地区',
      width: 160,
      render: (record) => record.region?.name || record.region?.internalName || '-',
    },
  },
  {
    key: 'baseFormId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.baseForm),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '基础形态',
      component: 'select',
      placeholder: '选择基础形态',
      clearable: true,
      filterable: true,
      options: pokemonFormOptions,
      loading: optionLoading,
    },
    table: {
      title: '基础形态',
      width: 180,
      render: (record) => record.baseForm?.name || record.baseForm?.internalName || '-',
    },
  },
  {
    key: 'genderId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.gender),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '性别',
      component: 'select',
      placeholder: '选择性别',
      clearable: true,
      filterable: true,
      options: genderOptions,
      loading: optionLoading,
    },
    table: {
      title: '性别',
      width: 120,
      render: (record) => record.gender?.name || record.gender?.internalName || '-',
    },
  },
  {
    key: 'knownMoveId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.knownMove),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '已学会招式',
      component: 'select',
      placeholder: '选择已学会招式',
      clearable: true,
      filterable: true,
      options: moveOptions,
      loading: optionLoading,
    },
    table: false,
  },
  {
    key: 'usedMoveId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.usedMove),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '使用招式',
      component: 'select',
      placeholder: '选择使用招式',
      clearable: true,
      filterable: true,
      options: moveOptions,
      loading: optionLoading,
    },
    table: false,
  },
  {
    key: 'knownMoveTypeId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.knownMoveType),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '已学会招式属性',
      component: 'select',
      placeholder: '选择已学会招式属性',
      clearable: true,
      filterable: true,
      options: typeOptions,
      loading: optionLoading,
    },
    table: false,
  },
  {
    key: 'partySpeciesId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.partySpecies),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '同队种族',
      component: 'select',
      placeholder: '选择同队种族',
      clearable: true,
      filterable: true,
      options: pokemonSpeciesOptions,
      loading: optionLoading,
    },
    table: false,
  },
  {
    key: 'partyTypeId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.partyType),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '同队属性',
      component: 'select',
      placeholder: '选择同队属性',
      clearable: true,
      filterable: true,
      options: typeOptions,
      loading: optionLoading,
    },
    table: false,
  },
  {
    key: 'tradeSpeciesId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.tradeSpecies),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '交换种族',
      component: 'select',
      placeholder: '选择交换种族',
      clearable: true,
      filterable: true,
      options: pokemonSpeciesOptions,
      loading: optionLoading,
    },
    table: false,
  },
  {
    key: 'branchSortOrder',
    form: {
      label: '分支顺序',
      component: 'number',
      props: numberInputProps,
      rules: [{ required: true, type: 'number', message: '请输入分支顺序', trigger: ['change'] }],
    },
    search: {
      label: '分支顺序',
      component: 'number',
      props: numberInputProps,
    },
    table: {
      title: '分支顺序',
      width: 120,
    },
  },
  {
    key: 'detailSortOrder',
    form: {
      label: '条件顺序',
      component: 'number',
      props: numberInputProps,
      rules: [{ required: true, type: 'number', message: '请输入条件顺序', trigger: ['change'] }],
    },
    search: {
      label: '条件顺序',
      component: 'number',
      props: numberInputProps,
    },
    table: {
      title: '条件顺序',
      width: 120,
    },
  },
  {
    key: 'minLevel',
    form: {
      label: '最低等级',
      component: 'number',
      props: numberInputProps,
    },
    search: {
      label: '最低等级',
      component: 'number',
      props: numberInputProps,
    },
    table: {
      title: '最低等级',
      width: 110,
      render: (record) => record.minLevel ?? '-',
    },
  },
  {
    key: 'minHappiness',
    form: {
      label: '最低亲密度',
      component: 'number',
      props: numberInputProps,
    },
    table: false,
  },
  {
    key: 'minAffection',
    form: {
      label: '最低亲密互动值',
      component: 'number',
      props: numberInputProps,
    },
    table: false,
  },
  {
    key: 'minBeauty',
    form: {
      label: '最低美丽值',
      component: 'number',
      props: numberInputProps,
    },
    table: false,
  },
  {
    key: 'minDamageTaken',
    form: {
      label: '最低承伤值',
      component: 'number',
      props: numberInputProps,
    },
    table: false,
  },
  {
    key: 'minMoveCount',
    form: {
      label: '最低招式使用次数',
      component: 'number',
      props: numberInputProps,
    },
    table: false,
  },
  {
    key: 'minSteps',
    form: {
      label: '最低步数',
      component: 'number',
      props: numberInputProps,
    },
    table: false,
  },
  {
    key: 'relativePhysicalStats',
    form: {
      label: '相对物攻物防关系',
      component: 'number',
      props: {
        min: -1,
        max: 1,
        step: 1,
        style: 'width: 100%',
      },
    },
    table: false,
  },
  {
    key: 'timeOfDay',
    trim: true,
    payload: {
      toValue: (value) => toNullableText(value),
    },
    form: {
      label: '时间段',
      component: 'input',
      placeholder: '例如：night',
    },
    search: {
      label: '时间段',
      component: 'input',
      placeholder: '输入时间段',
    },
    table: {
      title: '时间段',
      width: 140,
      render: (record) => record.timeOfDay || '-',
    },
  },
  {
    key: 'needsMultiplayer',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => toFlagValue(record.needsMultiplayer),
    },
    payload: {
      toValue: (value) => fromFlagValue(value as NullableYesNo),
    },
    form: {
      label: '需要多人联机',
      component: 'select',
      placeholder: '请选择',
      clearable: true,
      options: flagOptions,
    },
    table: {
      title: '需要多人联机',
      width: 130,
      render: (record) =>
        typeof record.needsMultiplayer === 'boolean'
          ? (record.needsMultiplayer ? '是' : '否')
          : '-',
    },
  },
  {
    key: 'needsOverworldRain',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => toFlagValue(record.needsOverworldRain),
    },
    payload: {
      toValue: (value) => fromFlagValue(value as NullableYesNo),
    },
    form: {
      label: '需要大地图下雨',
      component: 'select',
      placeholder: '请选择',
      clearable: true,
      options: flagOptions,
    },
    table: false,
  },
  {
    key: 'turnUpsideDown',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => toFlagValue(record.turnUpsideDown),
    },
    payload: {
      toValue: (value) => fromFlagValue(value as NullableYesNo),
    },
    form: {
      label: '设备倒置',
      component: 'select',
      placeholder: '请选择',
      clearable: true,
      options: flagOptions,
    },
    table: false,
  },
] as const satisfies Parameters<
  typeof createFlatCrudPageSchema<
    PokemonEvolution,
    PokemonEvolutionQuery,
    PokemonEvolutionFormModel,
    PokemonEvolutionFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<
  PokemonEvolution,
  PokemonEvolutionFormModel
>({
  create: {
    buttonLabel: '新增进化条件',
    disabled: optionLoading,
    successMessage: '进化条件新增成功',
  },
  delete: {
    confirmMessage: '确认删除该进化条件吗？',
    successMessage: '进化条件删除成功',
  },
  edit: {
    dialogTitle: '编辑进化条件',
    successMessage: '进化条件更新成功',
  },
  fields,
  formGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3',
  indexColumn: true,
  modalWidth: 'min(96vw, 1360px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const pageSchema = {
  initialize: loadOptions,
  ...createFlatCrudPageSchema<
    PokemonEvolution,
    PokemonEvolutionQuery,
    PokemonEvolutionFormModel,
    PokemonEvolutionFormModel
  >({
    fields,
    loadPage: getPokemonEvolutionPage,
    createRecord: createPokemonEvolution,
    deleteRecord: deletePokemonEvolution,
    updateRecord: updatePokemonEvolution,
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
