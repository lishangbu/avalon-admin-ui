<script setup lang="ts">
import {
  createEncounterMethod,
  deleteEncounterMethod,
  listEncounterMethods,
  updateEncounterMethod,
} from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
} from '@/components'

defineOptions({
  name: 'EncounterMethodPage',
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
      label: '遭遇方式名称',
      component: 'input',
      placeholder: '例如：Walking in tall grass or a cave',
      rules: [{ required: true, message: '请输入遭遇方式名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '遭遇方式名称',
      component: 'input',
      placeholder: '输入遭遇方式名称',
    },
    table: {
      title: '遭遇方式名称',
      width: 260,
      fixed: 'left',
    },
  },
  {
    key: 'internalName',
    trim: true,
    form: {
      label: '内部名称',
      component: 'input',
      placeholder: '例如：walk',
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
  {
    key: 'sortingOrder',
    form: {
      label: '排序顺序',
      component: 'number',
      placeholder: '输入排序顺序',
      props: {
        min: 0,
        precision: 0,
      },
    },
    search: {
      label: '排序顺序',
      component: 'number',
      placeholder: '输入排序顺序',
      props: {
        min: 0,
        precision: 0,
      },
    },
    table: {
      title: '排序顺序',
      width: 120,
      align: 'center',
      render: (record) => record.sortingOrder ?? '-',
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudListSchema<
    EncounterMethod,
    EncounterMethodQuery,
    EncounterMethodFormModel,
    EncounterMethodFormModel
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<EncounterMethod, EncounterMethodFormModel>({
  create: {
    buttonLabel: '新增遭遇方式',
    successMessage: '遭遇方式新增成功',
  },
  delete: {
    confirmMessage: '确认删除该遭遇方式吗？',
    successMessage: '遭遇方式删除成功',
  },
  edit: {
    dialogTitle: '编辑遭遇方式',
    successMessage: '遭遇方式更新成功',
  },
  fields,
  formGridClass: 'grid gap-4 md:grid-cols-2',
  indexColumn: true,
  modalWidth: 'min(96vw, 860px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const listSchema = createFlatCrudListSchema<
  EncounterMethod,
  EncounterMethodQuery,
  EncounterMethodFormModel,
  EncounterMethodFormModel
>({
  fields,
  loadList: listEncounterMethods,
  createRecord: createEncounterMethod,
  deleteRecord: deleteEncounterMethod,
  updateRecord: updateEncounterMethod,
})

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
