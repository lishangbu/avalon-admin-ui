<script setup lang="ts">
import {
  createMoveDamageClass,
  deleteMoveDamageClass,
  listMoveDamageClasses,
  updateMoveDamageClass,
} from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
} from '@/components'

defineOptions({
  name: 'MoveDamageClassPage',
})

const fields = [
  {
    key: 'name',
    trim: true,
    form: {
      label: '类别名称',
      component: 'input',
      placeholder: '例如：物理',
      rules: [{ required: true, message: '请输入类别名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '类别名称',
      component: 'input',
      placeholder: '输入类别名称',
    },
    table: {
      title: '类别名称',
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
      placeholder: '例如：physical',
      rules: [{ required: true, message: '请输入内部名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '内部名称',
      component: 'input',
      placeholder: '例如：physical',
    },
    table: {
      title: '内部名称',
      width: 160,
    },
  },
  {
    key: 'description',
    trim: true,
    form: {
      label: '描述',
      component: 'input',
      placeholder: '例如：造成物理伤害',
    },
    search: {
      label: '描述',
      component: 'input',
      placeholder: '输入描述',
    },
    table: {
      title: '描述',
      valuePath: 'description',
    },
  },
] as const satisfies Parameters<typeof createFlatCrudInterfaceSchema<MoveDamageClass>>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<MoveDamageClass>({
  create: {
    buttonLabel: '新增招式伤害类别',
    successMessage: '招式伤害类别新增成功',
  },
  delete: {
    confirmMessage: '确认删除该招式伤害类别吗？',
    successMessage: '招式伤害类别删除成功',
  },
  edit: {
    dialogTitle: '编辑招式伤害类别',
    successMessage: '招式伤害类别更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(92vw, 560px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<MoveDamageClass, MoveDamageClassQuery>({
  fields,
  loadList: listMoveDamageClasses,
  createRecord: createMoveDamageClass,
  deleteRecord: deleteMoveDamageClass,
  updateRecord: updateMoveDamageClass,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
