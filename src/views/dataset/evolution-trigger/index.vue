<script setup lang="ts">
import {
  createEvolutionTrigger,
  deleteEvolutionTrigger,
  listEvolutionTriggers,
  updateEvolutionTrigger,
} from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'EvolutionTriggerPage',
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
      label: '进化触发方式名称',
      component: 'input',
      placeholder: '例如：Level up',
      rules: [{ required: true, message: '请输入进化触发方式名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '进化触发方式名称',
      component: 'input',
      placeholder: '输入进化触发方式名称',
    },
    table: {
      title: '进化触发方式名称',
      width: 220,
      fixed: 'left',
    },
  },
  {
    key: 'internalName',
    trim: true,
    form: {
      label: '内部名称',
      component: 'input',
      placeholder: '例如：level-up',
      rules: [{ required: true, message: '请输入内部名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '内部名称',
      component: 'input',
      placeholder: '输入内部名称',
    },
    table: {
      title: '内部名称',
      width: 220,
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudListSchema<
    EvolutionTrigger,
    EvolutionTriggerQuery,
    EvolutionTriggerFormModel,
    EvolutionTriggerFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<EvolutionTrigger, EvolutionTriggerFormModel>({
  create: {
    buttonLabel: '新增进化触发方式',
    successMessage: '进化触发方式新增成功',
  },
  delete: {
    confirmMessage: '确认删除该进化触发方式吗？',
    successMessage: '进化触发方式删除成功',
  },
  edit: {
    dialogTitle: '编辑进化触发方式',
    successMessage: '进化触发方式更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(92vw, 620px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<
  EvolutionTrigger,
  EvolutionTriggerQuery,
  EvolutionTriggerFormModel,
  EvolutionTriggerFormModel
>({
  fields,
  loadList: listEvolutionTriggers,
  createRecord: createEvolutionTrigger,
  deleteRecord: deleteEvolutionTrigger,
  updateRecord: updateEvolutionTrigger,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
