<script setup lang="ts">
import { createType, deleteType, listTypes, updateType } from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  fromFlagValue,
  hasId,
  toFlagValue,
} from '@/components'

import type { SelectOption } from 'naive-ui'

defineOptions({
  name: 'TypePage',
})

const battleOnlyOptions: SelectOption[] = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 0,
  },
]

const battleOnlySearchOptions: SelectOption[] = [
  {
    label: '是',
    value: 'true',
  },
  {
    label: '否',
    value: 'false',
  },
]

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
      label: '属性名称',
      component: 'input',
      placeholder: '例如：火',
      rules: [{ required: true, message: '请输入属性名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '属性名称',
      component: 'input',
      placeholder: '输入属性名称',
    },
    table: {
      title: '属性名称',
    },
  },
  {
    key: 'internalName',
    trim: true,
    form: {
      label: '内部名称',
      component: 'input',
      placeholder: '例如：fire',
      rules: [{ required: true, message: '请输入内部名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '内部名称',
      component: 'input',
      placeholder: '例如：fire',
    },
    table: {
      title: '内部名称',
      width: 160,
    },
  },
  {
    key: 'battleOnly',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => toFlagValue(record.battleOnly),
    },
    payload: {
      toValue: (value) => fromFlagValue(value as number | null),
    },
    form: {
      label: '仅战斗属性',
      component: 'select',
      placeholder: '请选择',
      options: battleOnlyOptions,
      rules: [
        { required: true, type: 'number', message: '请选择是否仅战斗属性', trigger: ['change'] },
      ],
    },
    search: {
      label: '仅战斗属性',
      component: 'select',
      placeholder: '请选择',
      clearable: true,
      options: battleOnlySearchOptions,
    },
    table: {
      title: '仅战斗属性',
      width: 120,
      render: (record) => {
        if (typeof record.battleOnly !== 'boolean') {
          return '-'
        }

        return record.battleOnly ? '是' : '否'
      },
    },
  },
] as const satisfies Parameters<typeof createFlatCrudListSchema<Type, TypeQuery, TypeFormModel, Type>>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<Type, TypeFormModel>({
  create: {
    buttonLabel: '新增属性',
    successMessage: '属性新增成功',
  },
  delete: {
    confirmMessage: '确认删除该属性吗？',
    successMessage: '属性删除成功',
  },
  edit: {
    dialogTitle: '编辑属性',
    successMessage: '属性更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(92vw, 520px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<Type, TypeQuery, TypeFormModel, Type>({
  fields,
  loadList: listTypes,
  createRecord: createType,
  deleteRecord: deleteType,
  updateRecord: updateType,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
