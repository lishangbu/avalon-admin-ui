<script setup lang="ts">
import {
  createCreatureHabitat,
  deleteCreatureHabitat,
  listCreatureHabitats,
  updateCreatureHabitat,
} from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'CreatureHabitatPage',
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
    CreatureHabitat,
    CreatureHabitatQuery,
    CreatureHabitatFormModel,
    CreatureHabitatFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<CreatureHabitat, CreatureHabitatFormModel>({
  create: {
    buttonLabel: '新增生物栖息地',
    successMessage: '生物栖息地新增成功',
  },
  delete: {
    confirmMessage: '确认删除该生物栖息地吗？',
    successMessage: '生物栖息地删除成功',
  },
  edit: {
    dialogTitle: '编辑生物栖息地',
    successMessage: '生物栖息地更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(92vw, 560px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<
  CreatureHabitat,
  CreatureHabitatQuery,
  CreatureHabitatFormModel,
  CreatureHabitatFormModel
>({
  fields,
  loadList: listCreatureHabitats,
  createRecord: createCreatureHabitat,
  deleteRecord: deleteCreatureHabitat,
  updateRecord: updateCreatureHabitat,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
