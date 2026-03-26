<script setup lang="ts">
import { ref } from 'vue'

import { createStat, deleteStat, listMoveDamageClasses, listStats, updateStat } from '@/api'
import { createCrudListConfig, CrudList, hasId, toSelectOptions } from '@/components'

import type { CrudInterfaceSchema, CrudListSchema } from '@/components'
import type { FormRules, SelectOption } from 'naive-ui'

defineOptions({
  name: 'StatPage',
})

const optionLoading = ref(false)
const moveDamageClassOptions = ref<SelectOption[]>([])

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

const formRules: FormRules = {
  internalName: [{ required: true, message: '请输入内部名称', trigger: ['input', 'blur'] }],
  name: [{ required: true, message: '请输入属性名称', trigger: ['input', 'blur'] }],
  gameIndex: [
    { required: true, type: 'number', message: '请输入游戏索引', trigger: ['change', 'blur'] },
  ],
  battleOnly: [
    { required: true, type: 'number', message: '请选择是否仅战斗属性', trigger: ['change'] },
  ],
}

async function loadOptions() {
  optionLoading.value = true

  try {
    const moveDamageClassRes = await listMoveDamageClasses()
    moveDamageClassOptions.value = toSelectOptions(moveDamageClassRes.data)
  } finally {
    optionLoading.value = false
  }
}

const interfaceSchema: CrudInterfaceSchema<Stat> = {
  createLabel: '新增能力',
  createDisabled: optionLoading,
  createTitle: '新增能力',
  createSuccessMessage: '能力新增成功',
  deleteConfirmMessage: '确认删除该能力吗？',
  deleteSuccessMessage: '能力删除成功',
  editTitle: '编辑能力',
  formFields: [
    {
      key: 'name',
      label: '能力名称',
      type: 'input',
      placeholder: '例如：HP',
    },
    {
      key: 'internalName',
      label: '内部名称',
      type: 'input',
      placeholder: '例如：hp',
    },
    {
      key: 'gameIndex',
      label: '游戏索引',
      type: 'number',
      props: {
        min: 0,
        style: 'width: 100%',
      },
    },
    {
      key: 'battleOnly',
      label: '仅战斗属性',
      type: 'select',
      placeholder: '请选择',
      options: battleOnlyOptions,
    },
    {
      key: 'moveDamageClassId',
      label: '招式伤害类别',
      type: 'select',
      placeholder: '选择招式伤害类别',
      clearable: true,
      filterable: true,
      options: moveDamageClassOptions,
      loading: optionLoading,
    },
  ],
  formGridClass: 'grid gap-4 md:grid-cols-2',
  formRules,
  modalWidth: 'min(92vw, 680px)',
  searchFields: [
    {
      key: 'name',
      label: '能力名称',
      type: 'input',
      placeholder: '输入能力名称',
    },
    {
      key: 'internalName',
      label: '内部名称',
      type: 'input',
      placeholder: '输入内部名称',
    },
    {
      key: 'moveDamageClassId',
      label: '招式伤害类别',
      type: 'select',
      placeholder: '选择招式伤害类别',
      clearable: true,
      filterable: true,
      options: moveDamageClassOptions,
      loading: optionLoading,
    },
  ],
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
  indexColumn: true,
  tableColumns: [
    {
      title: '能力名称',
      key: 'name',
      width: 140,
      fixed: 'left',
    },
    {
      title: '内部名称',
      key: 'internalName',
      width: 160,
    },
    {
      title: '游戏索引',
      key: 'gameIndex',
      width: 120,
    },
    {
      title: '仅战斗属性',
      key: 'battleOnly',
      width: 120,
      render: (record) => {
        if (typeof record.battleOnly !== 'boolean') {
          return '-'
        }

        return record.battleOnly ? '是' : '否'
      },
    },
    {
      title: '招式伤害类别',
      key: 'moveDamageClass',
      width: 180,
      render: (record) =>
        record.moveDamageClass?.name || record.moveDamageClass?.internalName || '-',
    },
  ],
  updateSuccessMessage: '能力更新成功',
}

const listSchema: CrudListSchema<Stat, StatQuery, StatFormModel, Stat> = {
  initialize: loadOptions,
  loadList: listStats,
  mapRecordToFormModel: (record) => ({
    id: record.id ?? null,
    internalName: record.internalName ?? '',
    name: record.name ?? '',
    gameIndex: record.gameIndex ?? null,
    battleOnly: record.battleOnly === true ? 1 : record.battleOnly === false ? 0 : null,
    moveDamageClassId: record.moveDamageClass?.id ?? null,
  }),
  createRecord: createStat,
  createFormModel: () => ({
    id: null,
    internalName: '',
    name: '',
    gameIndex: null,
    battleOnly: null,
    moveDamageClassId: null,
  }),
  createPayload: (form) => ({
    ...(hasId(form.id) ? { id: form.id } : {}),
    internalName: form.internalName.trim(),
    name: form.name.trim(),
    gameIndex: form.gameIndex,
    battleOnly: form.battleOnly === 1,
    moveDamageClass: hasId(form.moveDamageClassId) ? { id: form.moveDamageClassId } : null,
  }),
  createSearchModel: () => ({
    internalName: '',
    name: '',
    moveDamageClassId: null,
  }),
  deleteRecord: (record) => {
    if (!hasId(record.id)) {
      return Promise.reject(new Error('Missing stat id'))
    }

    return deleteStat(record.id)
  },
  updateRecord: updateStat,
}

const config = createCrudListConfig({
  interface: interfaceSchema,
  list: listSchema,
})
</script>

<template>
  <CrudList :config="config" />
</template>
