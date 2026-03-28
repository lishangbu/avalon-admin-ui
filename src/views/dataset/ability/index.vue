<script setup lang="ts">
import { createAbility, deleteAbility, listAbilities, updateAbility } from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'AbilityPage',
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
      label: '特性名称',
      component: 'input',
      placeholder: '例如：恶臭',
      rules: [{ required: true, message: '请输入特性名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '特性名称',
      component: 'input',
      placeholder: '输入特性名称',
    },
    table: {
      title: '特性名称',
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
      placeholder: '例如：stench',
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
  {
    key: 'effect',
    trim: true,
    form: {
      label: '效果描述',
      component: 'input',
      placeholder: '输入特性效果描述',
      props: {
        type: 'textarea',
        autosize: {
          minRows: 4,
          maxRows: 8,
        },
      },
    },
    search: {
      label: '效果描述',
      component: 'input',
      placeholder: '输入效果描述',
    },
    table: {
      title: '效果描述',
      width: 320,
    },
  },
  {
    key: 'introduction',
    trim: true,
    form: {
      label: '中文介绍',
      component: 'input',
      placeholder: '输入中文介绍',
      props: {
        type: 'textarea',
        autosize: {
          minRows: 3,
          maxRows: 6,
        },
      },
    },
    search: {
      label: '中文介绍',
      component: 'input',
      placeholder: '输入中文介绍',
    },
    table: {
      title: '中文介绍',
      width: 280,
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudListSchema<Ability, AbilityQuery, AbilityFormModel, AbilityFormModel>
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<Ability, AbilityFormModel>({
  create: {
    buttonLabel: '新增特性',
    successMessage: '特性新增成功',
  },
  delete: {
    confirmMessage: '确认删除该特性吗？',
    successMessage: '特性删除成功',
  },
  edit: {
    dialogTitle: '编辑特性',
    successMessage: '特性更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(96vw, 820px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<
  Ability,
  AbilityQuery,
  AbilityFormModel,
  AbilityFormModel
>({
  fields,
  loadList: listAbilities,
  createRecord: createAbility,
  deleteRecord: deleteAbility,
  updateRecord: updateAbility,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
