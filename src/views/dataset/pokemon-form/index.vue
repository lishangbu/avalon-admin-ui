<script setup lang="ts">
import { ref } from 'vue'

import {
  createPokemonForm,
  deletePokemonForm,
  getPokemonFormPage,
  getPokemonPage,
  updatePokemonForm,
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

import type { SelectOption } from 'naive-ui'

defineOptions({
  name: 'PokemonFormPage',
})

const POKEMON_OPTION_PAGE_SIZE = 2000

const optionLoading = ref(false)
const pokemonOptions = ref<SelectOption[]>([])

const flagOptions: SelectOption[] = [
  { label: '是', value: YesNo.Yes },
  { label: '否', value: YesNo.No },
]

const flagSearchOptions: SelectOption[] = [
  { label: '是', value: String(YesNo.Yes) },
  { label: '否', value: String(YesNo.No) },
]

function toNullableText(value: unknown) {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

async function loadOptions() {
  optionLoading.value = true

  try {
    const pokemonRes = await getPokemonPage({
      page: 1,
      size: POKEMON_OPTION_PAGE_SIZE,
      sort: 'sortingOrder,asc',
      query: {},
    })
    pokemonOptions.value = toSelectOptions(pokemonRes.data.rows)
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
      label: '形态名称',
      component: 'input',
      placeholder: '例如：bulbasaur',
      rules: [{ required: true, message: '请输入形态名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '形态名称',
      component: 'input',
      placeholder: '输入形态名称',
    },
    table: {
      title: '形态名称',
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
      width: 200,
    },
  },
  {
    key: 'pokemonId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.pokemon),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '所属宝可梦',
      component: 'select',
      placeholder: '选择所属宝可梦',
      clearable: true,
      filterable: true,
      options: pokemonOptions,
      loading: optionLoading,
      rules: [{ required: true, message: '请选择所属宝可梦', trigger: ['change'] }],
    },
    search: {
      label: '所属宝可梦',
      component: 'select',
      placeholder: '选择所属宝可梦',
      clearable: true,
      filterable: true,
      options: pokemonOptions,
      loading: optionLoading,
    },
    table: {
      title: '所属宝可梦',
      width: 180,
      render: (record) => record.pokemon?.name || record.pokemon?.internalName || '-',
    },
  },
  {
    key: 'formName',
    trim: true,
    payload: {
      toValue: (value) => toNullableText(value),
    },
    form: {
      label: '表单名称',
      component: 'input',
      placeholder: '例如：origin',
    },
    search: {
      label: '表单名称',
      component: 'input',
      placeholder: '输入表单名称',
    },
    table: {
      title: '表单名称',
      width: 160,
      render: (record) => record.formName || '-',
    },
  },
  {
    key: 'formOrder',
    form: {
      label: '表单顺序',
      component: 'number',
      props: numberInputProps,
      rules: [{ required: true, type: 'number', message: '请输入表单顺序', trigger: ['change'] }],
    },
    table: {
      title: '表单顺序',
      width: 120,
    },
  },
  {
    key: 'sortingOrder',
    form: {
      label: '排序顺序',
      component: 'number',
      props: numberInputProps,
      rules: [{ required: true, type: 'number', message: '请输入排序顺序', trigger: ['change'] }],
    },
    table: {
      title: '排序顺序',
      width: 120,
    },
  },
  {
    key: 'defaultForm',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => toFlagValue(record.defaultForm),
    },
    payload: {
      toValue: (value) => fromFlagValue(value as NullableYesNo),
    },
    form: {
      label: '默认形态',
      component: 'select',
      placeholder: '请选择',
      options: flagOptions,
      rules: [{ required: true, type: 'number', message: '请选择是否默认形态', trigger: ['change'] }],
    },
    search: {
      label: '默认形态',
      component: 'select',
      placeholder: '请选择',
      clearable: true,
      options: flagSearchOptions,
    },
    table: {
      title: '默认形态',
      width: 110,
      render: (record) => (typeof record.defaultForm === 'boolean' ? (record.defaultForm ? '是' : '否') : '-'),
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
      label: '仅战斗形态',
      component: 'select',
      placeholder: '请选择',
      options: flagOptions,
      rules: [{ required: true, type: 'number', message: '请选择是否仅战斗形态', trigger: ['change'] }],
    },
    search: {
      label: '仅战斗形态',
      component: 'select',
      placeholder: '请选择',
      clearable: true,
      options: flagSearchOptions,
    },
    table: {
      title: '仅战斗形态',
      width: 120,
      render: (record) => (typeof record.battleOnly === 'boolean' ? (record.battleOnly ? '是' : '否') : '-'),
    },
  },
  {
    key: 'mega',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => toFlagValue(record.mega),
    },
    payload: {
      toValue: (value) => fromFlagValue(value as NullableYesNo),
    },
    form: {
      label: '超级进化形态',
      component: 'select',
      placeholder: '请选择',
      options: flagOptions,
      rules: [{ required: true, type: 'number', message: '请选择是否超级进化形态', trigger: ['change'] }],
    },
    search: {
      label: '超级进化形态',
      component: 'select',
      placeholder: '请选择',
      clearable: true,
      options: flagSearchOptions,
    },
    table: {
      title: '超级进化形态',
      width: 130,
      render: (record) => (typeof record.mega === 'boolean' ? (record.mega ? '是' : '否') : '-'),
    },
  },
  {
    key: 'frontDefault',
    trim: true,
    payload: {
      toValue: (value) => toNullableText(value),
    },
    form: {
      label: '正面默认图片',
      component: 'input',
      placeholder: '输入图片 URL',
    },
    table: false,
  },
  {
    key: 'frontFemale',
    trim: true,
    payload: {
      toValue: (value) => toNullableText(value),
    },
    form: {
      label: '正面雌性图片',
      component: 'input',
      placeholder: '输入图片 URL',
    },
    table: false,
  },
  {
    key: 'frontShiny',
    trim: true,
    payload: {
      toValue: (value) => toNullableText(value),
    },
    form: {
      label: '正面闪光图片',
      component: 'input',
      placeholder: '输入图片 URL',
    },
    table: false,
  },
  {
    key: 'frontShinyFemale',
    trim: true,
    payload: {
      toValue: (value) => toNullableText(value),
    },
    form: {
      label: '正面闪光雌性图片',
      component: 'input',
      placeholder: '输入图片 URL',
    },
    table: false,
  },
  {
    key: 'backDefault',
    trim: true,
    payload: {
      toValue: (value) => toNullableText(value),
    },
    form: {
      label: '背面默认图片',
      component: 'input',
      placeholder: '输入图片 URL',
    },
    table: false,
  },
  {
    key: 'backFemale',
    trim: true,
    payload: {
      toValue: (value) => toNullableText(value),
    },
    form: {
      label: '背面雌性图片',
      component: 'input',
      placeholder: '输入图片 URL',
    },
    table: false,
  },
  {
    key: 'backShiny',
    trim: true,
    payload: {
      toValue: (value) => toNullableText(value),
    },
    form: {
      label: '背面闪光图片',
      component: 'input',
      placeholder: '输入图片 URL',
    },
    table: false,
  },
  {
    key: 'backShinyFemale',
    trim: true,
    payload: {
      toValue: (value) => toNullableText(value),
    },
    form: {
      label: '背面闪光雌性图片',
      component: 'input',
      placeholder: '输入图片 URL',
    },
    table: false,
  },
] as const satisfies Parameters<
  typeof createFlatCrudPageSchema<PokemonForm, PokemonFormQuery, PokemonFormModel, PokemonFormModel>
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<PokemonForm, PokemonFormModel>({
  create: {
    buttonLabel: '新增宝可梦形态',
    disabled: optionLoading,
    successMessage: '宝可梦形态新增成功',
  },
  delete: {
    confirmMessage: '确认删除该宝可梦形态吗？',
    successMessage: '宝可梦形态删除成功',
  },
  edit: {
    dialogTitle: '编辑宝可梦形态',
    successMessage: '宝可梦形态更新成功',
  },
  fields,
  formGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3',
  indexColumn: true,
  modalWidth: 'min(96vw, 1280px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const pageSchema = {
  initialize: loadOptions,
  ...createFlatCrudPageSchema<PokemonForm, PokemonFormQuery, PokemonFormModel, PokemonFormModel>({
    fields,
    loadPage: getPokemonFormPage,
    createRecord: createPokemonForm,
    deleteRecord: deletePokemonForm,
    updateRecord: updatePokemonForm,
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
