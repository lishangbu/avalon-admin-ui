<script setup lang="ts">
import { ref } from 'vue'

import {
  createCreature,
  deleteCreature,
  getCreaturePage,
  getCreatureSpeciesPage,
  updateCreature,
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
  name: 'CreaturePage',
})

const CREATURE_SPECIES_OPTION_PAGE_SIZE = 2000

const optionLoading = ref(false)
const creatureSpeciesOptions = ref<SelectOption[]>([])

async function loadOptions() {
  optionLoading.value = true

  try {
    const creatureSpeciesRes = await getCreatureSpeciesPage({
      page: 1,
      size: CREATURE_SPECIES_OPTION_PAGE_SIZE,
      sort: 'sortingOrder,asc',
      query: {},
    })
    creatureSpeciesOptions.value = toSelectOptions(creatureSpeciesRes.data.rows)
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
      label: '生物名称',
      component: 'input',
      placeholder: '例如：bulbasaur',
      rules: [{ required: true, message: '请输入生物名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '生物名称',
      component: 'input',
      placeholder: '输入生物名称',
    },
    table: {
      title: '生物名称',
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
    key: 'creatureSpeciesId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.creatureSpecies),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '生物种族',
      component: 'select',
      placeholder: '选择生物种族',
      clearable: true,
      filterable: true,
      options: creatureSpeciesOptions,
      loading: optionLoading,
    },
    search: {
      label: '生物种族',
      component: 'select',
      placeholder: '选择生物种族',
      clearable: true,
      filterable: true,
      options: creatureSpeciesOptions,
      loading: optionLoading,
    },
    table: {
      title: '种族',
      width: 220,
      render: (record) => record.creatureSpecies?.name || record.creatureSpecies?.internalName || '-',
    },
  },
  {
    key: 'height',
    form: {
      label: '身高',
      component: 'number',
      props: numberInputProps,
    },
    table: {
      title: '身高',
      width: 100,
    },
  },
  {
    key: 'weight',
    form: {
      label: '体重',
      component: 'number',
      props: numberInputProps,
    },
    table: {
      title: '体重',
      width: 100,
    },
  },
  {
    key: 'baseExperience',
    form: {
      label: '基础经验',
      component: 'number',
      props: numberInputProps,
    },
    table: {
      title: '基础经验',
      width: 120,
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
] as const satisfies Parameters<
  typeof createFlatCrudPageSchema<Creature, CreatureQuery, CreatureCrudFormModel, CreatureCrudFormModel>
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<Creature, CreatureCrudFormModel>({
  create: {
    buttonLabel: '新增生物',
    disabled: optionLoading,
    successMessage: '生物新增成功',
  },
  delete: {
    confirmMessage: '确认删除该生物吗？',
    successMessage: '生物删除成功',
  },
  edit: {
    dialogTitle: '编辑生物',
    successMessage: '生物更新成功',
  },
  fields,
  formGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3',
  indexColumn: true,
  modalWidth: 'min(96vw, 1080px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const pageSchema = {
  initialize: loadOptions,
  ...createFlatCrudPageSchema<Creature, CreatureQuery, CreatureCrudFormModel, CreatureCrudFormModel>({
    fields,
    loadPage: getCreaturePage,
    createRecord: createCreature,
    deleteRecord: deleteCreature,
    updateRecord: updateCreature,
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
