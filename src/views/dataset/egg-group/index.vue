<script setup lang="ts">
import { createEggGroup, deleteEggGroup, listEggGroups, updateEggGroup } from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'EggGroupPage',
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
      label: '蛋组名称',
      component: 'input',
      placeholder: '例如：怪兽',
      rules: [{ required: true, message: '请输入蛋组名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '蛋组名称',
      component: 'input',
      placeholder: '输入蛋组名称',
    },
    table: {
      title: '蛋组名称',
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
      placeholder: '例如：monster',
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
    key: 'text',
    trim: true,
    form: {
      label: '简要说明',
      component: 'input',
      placeholder: '输入简要说明',
      props: {
        type: 'textarea',
        autosize: {
          minRows: 3,
          maxRows: 6,
        },
      },
    },
    search: {
      label: '简要说明',
      component: 'input',
      placeholder: '输入简要说明',
    },
    table: {
      title: '简要说明',
      width: 260,
    },
  },
  {
    key: 'characteristics',
    trim: true,
    form: {
      label: '详细特征',
      component: 'input',
      placeholder: '输入详细特征',
      props: {
        type: 'textarea',
        autosize: {
          minRows: 4,
          maxRows: 8,
        },
      },
    },
    search: {
      label: '详细特征',
      component: 'input',
      placeholder: '输入详细特征',
    },
    table: {
      title: '详细特征',
      width: 360,
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudListSchema<EggGroup, EggGroupQuery, EggGroupFormModel, EggGroupFormModel>
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<EggGroup, EggGroupFormModel>({
  create: {
    buttonLabel: '新增蛋组',
    successMessage: '蛋组新增成功',
  },
  delete: {
    confirmMessage: '确认删除该蛋组吗？',
    successMessage: '蛋组删除成功',
  },
  edit: {
    dialogTitle: '编辑蛋组',
    successMessage: '蛋组更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(96vw, 860px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<
  EggGroup,
  EggGroupQuery,
  EggGroupFormModel,
  EggGroupFormModel
>({
  fields,
  loadList: listEggGroups,
  createRecord: createEggGroup,
  deleteRecord: deleteEggGroup,
  updateRecord: updateEggGroup,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
