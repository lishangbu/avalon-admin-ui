<script setup lang="ts">
import { ref } from 'vue'

import {
  createMove,
  deleteMove,
  getMovePage,
  listMoveAilments,
  listMoveCategories,
  listMoveDamageClasses,
  listMoveTargets,
  listTypes,
  updateMove,
} from '@/api'
import {
  createCrudConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudPageSchema,
  CrudPage,
  hasId,
  pickRelationId,
  toSelectOptions,
} from '@/components'

import type { SelectOption } from 'naive-ui'

defineOptions({
  name: 'MovePage',
})

const optionLoading = ref(false)
const typeOptions = ref<SelectOption[]>([])
const moveDamageClassOptions = ref<SelectOption[]>([])
const moveTargetOptions = ref<SelectOption[]>([])
const moveCategoryOptions = ref<SelectOption[]>([])
const moveAilmentOptions = ref<SelectOption[]>([])

async function loadOptions() {
  optionLoading.value = true

  try {
    const [typeRes, moveDamageClassRes, moveTargetRes, moveCategoryRes, moveAilmentRes] =
      await Promise.all([
        listTypes(),
        listMoveDamageClasses(),
        listMoveTargets(),
        listMoveCategories(),
        listMoveAilments(),
      ])
    typeOptions.value = toSelectOptions(typeRes.data)
    moveDamageClassOptions.value = toSelectOptions(moveDamageClassRes.data)
    moveTargetOptions.value = toSelectOptions(moveTargetRes.data)
    moveCategoryOptions.value = toSelectOptions(moveCategoryRes.data)
    moveAilmentOptions.value = toSelectOptions(moveAilmentRes.data)
  } finally {
    optionLoading.value = false
  }
}

const numberInputProps = {
  style: 'width: 100%',
}

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
    search: {
      label: 'ID',
      component: 'input',
      placeholder: '输入 ID',
    },
    table: {
      title: 'ID',
      width: 120,
    },
  },
  {
    key: 'name',
    trim: true,
    form: {
      label: '招式名称',
      component: 'input',
      placeholder: '例如：拍击',
      rules: [{ required: true, message: '请输入招式名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '招式名称',
      component: 'input',
      placeholder: '输入招式名称',
    },
    table: {
      title: '招式名称',
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
      placeholder: '例如：pound',
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
    key: 'typeId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.type),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '属性',
      component: 'select',
      placeholder: '选择属性',
      clearable: true,
      filterable: true,
      options: typeOptions,
      loading: optionLoading,
    },
    search: {
      label: '属性',
      component: 'select',
      placeholder: '选择属性',
      clearable: true,
      filterable: true,
      options: typeOptions,
      loading: optionLoading,
    },
    table: {
      title: '属性',
      width: 140,
      render: (record) => record.type?.name || record.type?.internalName || '-',
    },
  },
  {
    key: 'moveDamageClassId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.moveDamageClass),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '伤害分类',
      component: 'select',
      placeholder: '选择伤害分类',
      clearable: true,
      filterable: true,
      options: moveDamageClassOptions,
      loading: optionLoading,
    },
    search: {
      label: '伤害分类',
      component: 'select',
      placeholder: '选择伤害分类',
      clearable: true,
      filterable: true,
      options: moveDamageClassOptions,
      loading: optionLoading,
    },
    table: {
      title: '伤害分类',
      width: 150,
      render: (record) =>
        record.moveDamageClass?.name || record.moveDamageClass?.internalName || '-',
    },
  },
  {
    key: 'moveTargetId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.moveTarget),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '招式目标',
      component: 'select',
      placeholder: '选择招式目标',
      clearable: true,
      filterable: true,
      options: moveTargetOptions,
      loading: optionLoading,
    },
    search: {
      label: '招式目标',
      component: 'select',
      placeholder: '选择招式目标',
      clearable: true,
      filterable: true,
      options: moveTargetOptions,
      loading: optionLoading,
    },
    table: {
      title: '招式目标',
      width: 170,
      render: (record) => record.moveTarget?.name || record.moveTarget?.internalName || '-',
    },
  },
  {
    key: 'moveCategoryId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.moveCategory),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '招式分类',
      component: 'select',
      placeholder: '选择招式分类',
      clearable: true,
      filterable: true,
      options: moveCategoryOptions,
      loading: optionLoading,
    },
    search: {
      label: '招式分类',
      component: 'select',
      placeholder: '选择招式分类',
      clearable: true,
      filterable: true,
      options: moveCategoryOptions,
      loading: optionLoading,
    },
    table: {
      title: '招式分类',
      width: 150,
      render: (record) => record.moveCategory?.name || record.moveCategory?.internalName || '-',
    },
  },
  {
    key: 'moveAilmentId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.moveAilment),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    form: {
      label: '异常状态',
      component: 'select',
      placeholder: '选择异常状态',
      clearable: true,
      filterable: true,
      options: moveAilmentOptions,
      loading: optionLoading,
    },
    search: {
      label: '异常状态',
      component: 'select',
      placeholder: '选择异常状态',
      clearable: true,
      filterable: true,
      options: moveAilmentOptions,
      loading: optionLoading,
    },
    table: {
      title: '异常状态',
      width: 150,
      render: (record) => record.moveAilment?.name || record.moveAilment?.internalName || '-',
    },
  },
  {
    key: 'power',
    form: {
      label: '威力',
      component: 'number',
      props: numberInputProps,
    },
    table: {
      title: '威力',
      width: 100,
    },
  },
  {
    key: 'accuracy',
    form: {
      label: '命中率',
      component: 'number',
      props: numberInputProps,
    },
    table: {
      title: '命中率',
      width: 100,
    },
  },
  {
    key: 'pp',
    form: {
      label: 'PP',
      component: 'number',
      props: numberInputProps,
    },
    table: {
      title: 'PP',
      width: 90,
    },
  },
  {
    key: 'priority',
    form: {
      label: '优先级',
      component: 'number',
      props: numberInputProps,
    },
    table: {
      title: '优先级',
      width: 100,
    },
  },
  {
    key: 'effectChance',
    form: {
      label: '效果触发概率',
      component: 'number',
      props: numberInputProps,
    },
  },
  {
    key: 'minHits',
    form: {
      label: '最小命中次数',
      component: 'number',
      props: numberInputProps,
    },
  },
  {
    key: 'maxHits',
    form: {
      label: '最大命中次数',
      component: 'number',
      props: numberInputProps,
    },
  },
  {
    key: 'minTurns',
    form: {
      label: '最少回合数',
      component: 'number',
      props: numberInputProps,
    },
  },
  {
    key: 'maxTurns',
    form: {
      label: '最多回合数',
      component: 'number',
      props: numberInputProps,
    },
  },
  {
    key: 'drain',
    form: {
      label: '吸收',
      component: 'number',
      props: numberInputProps,
    },
  },
  {
    key: 'healing',
    form: {
      label: '治疗',
      component: 'number',
      props: numberInputProps,
    },
  },
  {
    key: 'critRate',
    form: {
      label: '暴击速率',
      component: 'number',
      props: numberInputProps,
    },
  },
  {
    key: 'ailmentChance',
    form: {
      label: '异常状态概率',
      component: 'number',
      props: numberInputProps,
    },
  },
  {
    key: 'flinchChance',
    form: {
      label: '畏缩概率',
      component: 'number',
      props: numberInputProps,
    },
  },
  {
    key: 'statChance',
    form: {
      label: '能力值概率',
      component: 'number',
      props: numberInputProps,
    },
  },
  {
    key: 'shortEffect',
    trim: true,
    form: {
      label: '简称效果',
      component: 'input',
      placeholder: '输入简称效果',
      props: {
        type: 'textarea',
        autosize: {
          minRows: 2,
          maxRows: 4,
        },
      },
    },
    table: {
      title: '简称效果',
      width: 320,
    },
  },
  {
    key: 'effect',
    trim: true,
    form: {
      label: '效果',
      component: 'input',
      placeholder: '输入效果说明',
      props: {
        type: 'textarea',
        autosize: {
          minRows: 4,
          maxRows: 8,
        },
      },
    },
    table: false,
  },
  {
    key: 'text',
    trim: true,
    form: {
      label: '文本',
      component: 'input',
      placeholder: '输入文本',
      props: {
        type: 'textarea',
        autosize: {
          minRows: 3,
          maxRows: 6,
        },
      },
    },
    table: false,
  },
] as const satisfies Parameters<typeof createFlatCrudPageSchema<Move, MoveQuery, MoveFormModel, MoveFormModel>>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<Move, MoveFormModel>({
  create: {
    buttonLabel: '新增招式',
    disabled: optionLoading,
    successMessage: '招式新增成功',
  },
  delete: {
    confirmMessage: '确认删除该招式吗？',
    successMessage: '招式删除成功',
  },
  edit: {
    dialogTitle: '编辑招式',
    successMessage: '招式更新成功',
  },
  fields,
  formGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3',
  indexColumn: true,
  modalWidth: 'min(96vw, 1280px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const pageSchema = {
  initialize: loadOptions,
  ...createFlatCrudPageSchema<Move, MoveQuery, MoveFormModel, MoveFormModel>({
    fields,
    loadPage: getMovePage,
    createRecord: createMove,
    deleteRecord: deleteMove,
    updateRecord: updateMove,
  }),
}

const config = createCrudConfig({
  interface: interfaceSchema,
  page: pageSchema,
})
</script>

<template>
  <CrudPage :config="config" />
</template>
