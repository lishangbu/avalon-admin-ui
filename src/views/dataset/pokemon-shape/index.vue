<script setup lang="ts">
import {
  createPokemonShape,
  deletePokemonShape,
  listPokemonShapes,
  updatePokemonShape,
} from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'PokemonShapePage',
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
      label: '形状名称',
      component: 'input',
      placeholder: '例如：Ball',
      rules: [{ required: true, message: '请输入形状名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '形状名称',
      component: 'input',
      placeholder: '输入形状名称',
    },
    table: {
      title: '形状名称',
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
      placeholder: '例如：ball',
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
    PokemonShape,
    PokemonShapeQuery,
    PokemonShapeFormModel,
    PokemonShapeFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<PokemonShape, PokemonShapeFormModel>({
  create: {
    buttonLabel: '新增宝可梦形状',
    successMessage: '宝可梦形状新增成功',
  },
  delete: {
    confirmMessage: '确认删除该宝可梦形状吗？',
    successMessage: '宝可梦形状删除成功',
  },
  edit: {
    dialogTitle: '编辑宝可梦形状',
    successMessage: '宝可梦形状更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(92vw, 560px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<
  PokemonShape,
  PokemonShapeQuery,
  PokemonShapeFormModel,
  PokemonShapeFormModel
>({
  fields,
  loadList: listPokemonShapes,
  createRecord: createPokemonShape,
  deleteRecord: deletePokemonShape,
  updateRecord: updatePokemonShape,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
