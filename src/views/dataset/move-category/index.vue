<script setup lang="ts">
import {
  createMoveCategory,
  deleteMoveCategory,
  listMoveCategories,
  updateMoveCategory,
} from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'MoveCategoryPage',
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
      label: '类别名称',
      component: 'input',
      placeholder: '例如：damage',
      rules: [{ required: true, message: '请输入类别名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '类别名称',
      component: 'input',
      placeholder: '输入类别名称',
    },
    table: {
      title: '类别名称',
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
      placeholder: '例如：damage',
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
    key: 'description',
    trim: true,
    form: {
      label: '描述',
      component: 'input',
      placeholder: '输入描述',
      props: {
        type: 'textarea',
        autosize: { minRows: 3, maxRows: 6 },
      },
    },
    search: {
      label: '描述',
      component: 'input',
      placeholder: '输入描述',
    },
    table: {
      title: '描述',
      width: 320,
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudListSchema<
    MoveCategory,
    MoveCategoryQuery,
    MoveCategoryFormModel,
    MoveCategoryFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<MoveCategory, MoveCategoryFormModel>({
  create: {
    buttonLabel: '新增招式类别',
    successMessage: '招式类别新增成功',
  },
  delete: {
    confirmMessage: '确认删除该招式类别吗？',
    successMessage: '招式类别删除成功',
  },
  edit: {
    dialogTitle: '编辑招式类别',
    successMessage: '招式类别更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(96vw, 820px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<
  MoveCategory,
  MoveCategoryQuery,
  MoveCategoryFormModel,
  MoveCategoryFormModel
>({
  fields,
  loadList: listMoveCategories,
  createRecord: createMoveCategory,
  deleteRecord: deleteMoveCategory,
  updateRecord: updateMoveCategory,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
