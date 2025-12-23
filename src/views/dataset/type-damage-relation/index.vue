<script lang="ts" setup>
import { NSelect, NTag, type SelectOption } from 'naive-ui'
import { h, onMounted, ref } from 'vue'

import { listTypes } from '@/api/dataset/type'
import {
  createTypeDamageRelation,
  getTypeDamageRelationPage,
  removeTypeDamageRelation,
  updateTypeDamageRelation,
} from '@/api/dataset/type-damage-relation'
import { CrudTable, DictionarySelect, ScrollContainer } from '@/components'
import { useDictionary } from '@/composables'

import type { TypeDamageRelation } from '@/types/modules/dataset/type-damage-relation'

// 使用字典缓存工具
const { getDictionary } = useDictionary()

const damageMultiplierOptions: Array<
  SelectOption & { type: 'success' | 'info' | 'warning' | 'error' }
> = [
  { label: '效果绝佳', value: 2, type: 'success' },
  { label: '效果一般', value: 1, type: 'info' },
  { label: '效果不好', value: 0.5, type: 'warning' },
  { label: '没有效果', value: 0, type: 'error' },
]

const typeDict = ref<Record<string, string>>({})
// 加载字典数据（并行）
onMounted(async () => {
  typeDict.value = await getDictionary(listTypes, 'id', 'name')
})

// 表格列配置
const columns = [
  {
    title: '攻击方属性',
    key: 'attackingTypeId',
    render: (rowData: TypeDamageRelation) =>
      typeDict.value[rowData.attackingTypeId] || rowData.attackingTypeId,
  },
  {
    title: '防御方属性',
    key: 'defendingTypeId',
    render: (rowData: TypeDamageRelation) =>
      typeDict.value[rowData.defendingTypeId] || rowData.defendingTypeId,
  },
  {
    title: '伤害效果',
    key: 'multiplier',
    render: (rowData: TypeDamageRelation) => {
      const option = damageMultiplierOptions.find((opt) => opt.value === rowData.multiplier)
      if (option) {
        return h(NTag, { type: option.type, size: 'small' }, { default: () => option.label })
      }
      return rowData.multiplier
    },
  },
]

// 查询表单项配置
const searchFormOption = {
  formItemProps: [
    {
      label: '攻击方属性',
      path: 'attackingTypeId',
      component: DictionarySelect,
      componentProps: { api: listTypes, labelField: 'name', valueField: 'id' },
      placeholder: '请选择攻击方属性',
    },
    {
      label: '防御方属性',
      path: 'defendingTypeId',
      component: DictionarySelect,
      componentProps: { api: listTypes, labelField: 'name', valueField: 'id' },
      placeholder: '请选择防御方属性',
    },
  ],
}

// 表单项配置（用于新增/编辑）
const actionModalFormOption = {
  formItemProps: [
    {
      label: '攻击方属性',
      path: 'attackingTypeId',
      component: DictionarySelect,
      componentProps: { api: listTypes, labelField: 'name', valueField: 'id' },
      render(row: TypeDamageRelation) {
        const name = typeDict.value[row.attackingTypeId]
        return name
          ? h(NTag, { type: 'info', size: 'small' }, { default: () => name })
          : row.attackingTypeId || '-'
      },
    },
    {
      label: '防御方属性',
      path: 'defendingTypeId',
      component: DictionarySelect,
      componentProps: { api: listTypes, labelField: 'name', valueField: 'id' },
    },
    {
      label: '伤害系数',
      path: 'multiplier',
      component: NSelect,
      componentProps: { options: damageMultiplierOptions, placeholder: '请选择克制效果' },
    },
  ],
}
</script>

<template>
  <ScrollContainer wrapper-class="flex flex-col gap-y-2">
    <CrudTable
      :columns="columns"
      :action-modal-form-option="actionModalFormOption"
      :search-form-option="searchFormOption"
      :page="getTypeDamageRelationPage"
      :create="createTypeDamageRelation"
      :update="updateTypeDamageRelation"
      :remove="removeTypeDamageRelation"
    />
  </ScrollContainer>
</template>
