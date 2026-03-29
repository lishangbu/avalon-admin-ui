<script setup lang="ts">
import {
  createEncounterCondition,
  deleteEncounterCondition,
  listEncounterConditions,
  updateEncounterCondition,
} from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'EncounterConditionPage',
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
      label: '遭遇条件名称',
      component: 'input',
      placeholder: '例如：Swarm',
      rules: [{ required: true, message: '请输入遭遇条件名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '遭遇条件名称',
      component: 'input',
      placeholder: '输入遭遇条件名称',
    },
    table: {
      title: '遭遇条件名称',
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
      placeholder: '例如：swarm',
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
] as const satisfies Parameters<
  typeof createFlatCrudListSchema<
    EncounterCondition,
    EncounterConditionQuery,
    EncounterConditionFormModel,
    EncounterConditionFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<
  EncounterCondition,
  EncounterConditionFormModel
>({
  create: {
    buttonLabel: '新增遭遇条件',
    successMessage: '遭遇条件新增成功',
  },
  delete: {
    confirmMessage: '确认删除该遭遇条件吗？',
    successMessage: '遭遇条件删除成功',
  },
  edit: {
    dialogTitle: '编辑遭遇条件',
    successMessage: '遭遇条件更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(92vw, 560px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<
  EncounterCondition,
  EncounterConditionQuery,
  EncounterConditionFormModel,
  EncounterConditionFormModel
>({
  fields,
  loadList: listEncounterConditions,
  createRecord: createEncounterCondition,
  deleteRecord: deleteEncounterCondition,
  updateRecord: updateEncounterCondition,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
