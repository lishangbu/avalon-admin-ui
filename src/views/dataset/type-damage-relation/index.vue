<script setup lang="ts">
import { ref } from 'vue'

import {
  createTypeDamageRelation,
  deleteTypeDamageRelation,
  getTypeDamageRelationPage,
  listTypes,
  updateTypeDamageRelation,
} from '@/api'
import { createCrudConfig, createIdRule, CrudPage, hasId, toSelectOptions } from '@/components'

import type { CrudInterfaceSchema, CrudPageSchema } from '@/components'
import type { FormRules, SelectOption } from 'naive-ui'

defineOptions({
  name: 'TypeDamageRelationPage',
})

const optionLoading = ref(false)
const typeOptions = ref<SelectOption[]>([])

const formRules: FormRules = {
  attackingTypeId: [createIdRule('攻击方属性')],
  defendingTypeId: [createIdRule('防御方属性')],
  multiplier: [
    { required: true, type: 'number', message: '请输入伤害倍率', trigger: ['blur', 'change'] },
  ],
}

async function loadTypeOptions() {
  optionLoading.value = true

  try {
    const response = await listTypes()
    typeOptions.value = toSelectOptions(response.data)
  } finally {
    optionLoading.value = false
  }
}

const interfaceSchema: CrudInterfaceSchema<TypeDamageRelation> = {
  createLabel: '新增关系',
  createDisabled: optionLoading,
  createTitle: '新增属性克制关系',
  createSuccessMessage: '属性克制关系新增成功',
  deleteConfirmMessage: '确认删除该属性克制关系吗？',
  deleteSuccessMessage: '属性克制关系删除成功',
  editTitle: '编辑属性克制关系',
  formFields: [
    {
      key: 'attackingTypeId',
      label: '攻击方属性',
      type: 'select',
      placeholder: '选择攻击方属性',
      filterable: true,
      options: typeOptions,
      loading: optionLoading,
      disabled: ({ mode }) => mode === 'edit',
    },
    {
      key: 'defendingTypeId',
      label: '防御方属性',
      type: 'select',
      placeholder: '选择防御方属性',
      filterable: true,
      options: typeOptions,
      loading: optionLoading,
      disabled: ({ mode }) => mode === 'edit',
    },
    {
      key: 'multiplier',
      label: '伤害倍率',
      type: 'number',
      props: {
        precision: 2,
        min: 0,
        style: 'width: 100%',
      },
    },
  ],
  formRules,
  modalWidth: 'min(92vw, 560px)',
  searchFields: [
    {
      key: 'attackingTypeId',
      label: '攻击方属性',
      type: 'select',
      placeholder: '选择攻击方属性',
      clearable: true,
      filterable: true,
      options: typeOptions,
      loading: optionLoading,
    },
    {
      key: 'defendingTypeId',
      label: '防御方属性',
      type: 'select',
      placeholder: '选择防御方属性',
      clearable: true,
      filterable: true,
      options: typeOptions,
      loading: optionLoading,
    },
    {
      key: 'multiplier',
      label: '伤害倍率',
      type: 'number',
      placeholder: '例如：2',
      props: {
        precision: 2,
        showButton: false,
        style: 'width: 100%',
      },
    },
  ],
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
  indexColumn: true,
  tableColumns: [
    {
      title: '攻击方属性',
      key: 'attackingType',
      render: (record) => {
        const attackingType = record.id?.attackingType
        return attackingType?.name || attackingType?.internalName || '-'
      },
    },
    {
      title: '防御方属性',
      key: 'defendingType',
      render: (record) => {
        const defendingType = record.id?.defendingType
        return defendingType?.name || defendingType?.internalName || '-'
      },
    },
    {
      title: '伤害倍率',
      key: 'multiplier',
      width: 120,
    },
  ],
  updateSuccessMessage: '属性克制关系更新成功',
}

const pageSchema: CrudPageSchema<
  TypeDamageRelation,
  TypeDamageRelationQuery,
  TypeDamageRelationFormModel,
  TypeDamageRelation
> = {
  initialize: loadTypeOptions,
  loadPage: getTypeDamageRelationPage,
  mapRecordToFormModel: (record) => ({
    attackingTypeId: record.id?.attackingType?.id ?? null,
    defendingTypeId: record.id?.defendingType?.id ?? null,
    multiplier: record.multiplier ?? null,
  }),
  createRecord: createTypeDamageRelation,
  createFormModel: () => ({
    attackingTypeId: null,
    defendingTypeId: null,
    multiplier: null,
  }),
  createPayload: (form) => ({
    id: {
      attackingType: hasId(form.attackingTypeId) ? { id: form.attackingTypeId } : undefined,
      defendingType: hasId(form.defendingTypeId) ? { id: form.defendingTypeId } : undefined,
    },
    multiplier: form.multiplier,
  }),
  createSearchModel: () => ({
    attackingTypeId: null,
    defendingTypeId: null,
    multiplier: null,
  }),
  deleteRecord: (record) => {
    const attackingTypeId = record.id?.attackingType?.id
    const defendingTypeId = record.id?.defendingType?.id

    if (!hasId(attackingTypeId) || !hasId(defendingTypeId)) {
      return Promise.reject(new Error('Missing type relation id'))
    }

    return deleteTypeDamageRelation(attackingTypeId, defendingTypeId)
  },
  updateRecord: updateTypeDamageRelation,
}

const config = createCrudConfig({
  interface: interfaceSchema,
  page: pageSchema,
})
</script>

<template>
  <CrudPage :config="config" />
</template>
