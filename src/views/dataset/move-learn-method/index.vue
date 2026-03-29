<script setup lang="ts">
import {
  createMoveLearnMethod,
  deleteMoveLearnMethod,
  listMoveLearnMethods,
  updateMoveLearnMethod,
} from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'MoveLearnMethodPage',
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
      label: '学习方式名称',
      component: 'input',
      placeholder: '例如：Level up',
      rules: [{ required: true, message: '请输入学习方式名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '学习方式名称',
      component: 'input',
      placeholder: '输入学习方式名称',
    },
    table: {
      title: '学习方式名称',
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
      width: 360,
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudListSchema<
    MoveLearnMethod,
    MoveLearnMethodQuery,
    MoveLearnMethodFormModel,
    MoveLearnMethodFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<MoveLearnMethod, MoveLearnMethodFormModel>({
  create: {
    buttonLabel: '新增学习方式',
    successMessage: '学习方式新增成功',
  },
  delete: {
    confirmMessage: '确认删除该学习方式吗？',
    successMessage: '学习方式删除成功',
  },
  edit: {
    dialogTitle: '编辑学习方式',
    successMessage: '学习方式更新成功',
  },
  fields,
  indexColumn: true,
  modalWidth: 'min(96vw, 860px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<
  MoveLearnMethod,
  MoveLearnMethodQuery,
  MoveLearnMethodFormModel,
  MoveLearnMethodFormModel
>({
  fields,
  loadList: listMoveLearnMethods,
  createRecord: createMoveLearnMethod,
  deleteRecord: deleteMoveLearnMethod,
  updateRecord: updateMoveLearnMethod,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
