<script setup lang="ts">
import {
  createCreatureColor,
  deleteCreatureColor,
  listCreatureColors,
  updateCreatureColor,
} from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'CreatureColorPage',
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
      label: '颜色名称',
      component: 'input',
      placeholder: '例如：黑色',
      rules: [{ required: true, message: '请输入颜色名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '颜色名称',
      component: 'input',
      placeholder: '输入颜色名称',
    },
    table: {
      title: '颜色名称',
      width: 160,
      fixed: 'left',
    },
  },
  {
    key: 'internalName',
    trim: true,
    form: {
      label: '内部名称',
      component: 'input',
      placeholder: '例如：black',
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
    CreatureColor,
    CreatureColorQuery,
    CreatureColorFormModel,
    CreatureColorFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<CreatureColor, CreatureColorFormModel>({
  create: {
    buttonLabel: '新增生物颜色',
    successMessage: '生物颜色新增成功',
  },
  delete: {
    confirmMessage: '确认删除该生物颜色吗？',
    successMessage: '生物颜色删除成功',
  },
  edit: {
    dialogTitle: '编辑生物颜色',
    successMessage: '生物颜色更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(92vw, 560px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<
  CreatureColor,
  CreatureColorQuery,
  CreatureColorFormModel,
  CreatureColorFormModel
>({
  fields,
  loadList: listCreatureColors,
  createRecord: createCreatureColor,
  deleteRecord: deleteCreatureColor,
  updateRecord: updateCreatureColor,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
