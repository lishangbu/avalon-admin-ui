<script setup lang="ts">
import {
  createPokemonHabitat,
  deletePokemonHabitat,
  listPokemonHabitats,
  updatePokemonHabitat,
} from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'PokemonHabitatPage',
})

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
      label: '栖息地名称',
      component: 'input',
      placeholder: '例如：cave',
      rules: [{ required: true, message: '请输入栖息地名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '栖息地名称',
      component: 'input',
      placeholder: '输入栖息地名称',
    },
    table: {
      title: '栖息地名称',
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
      placeholder: '例如：cave',
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
] as const satisfies Parameters<
  typeof createFlatCrudListSchema<
    PokemonHabitat,
    PokemonHabitatQuery,
    PokemonHabitatFormModel,
    PokemonHabitatFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<PokemonHabitat, PokemonHabitatFormModel>({
  create: {
    buttonLabel: '新增宝可梦栖息地',
    successMessage: '宝可梦栖息地新增成功',
  },
  delete: {
    confirmMessage: '确认删除该宝可梦栖息地吗？',
    successMessage: '宝可梦栖息地删除成功',
  },
  edit: {
    dialogTitle: '编辑宝可梦栖息地',
    successMessage: '宝可梦栖息地更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(92vw, 560px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<
  PokemonHabitat,
  PokemonHabitatQuery,
  PokemonHabitatFormModel,
  PokemonHabitatFormModel
>({
  fields,
  loadList: listPokemonHabitats,
  createRecord: createPokemonHabitat,
  deleteRecord: deletePokemonHabitat,
  updateRecord: updatePokemonHabitat,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
