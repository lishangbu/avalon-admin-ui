<script lang="ts" setup>
import { NInputNumber, NSelect, type SelectOption } from 'naive-ui'

import { listTypes } from '@/api/dataset/type'
import {
  createTypeDamageRelation,
  getTypeDamageRelationPage,
  removeTypeDamageRelation,
  updateTypeDamageRelation,
} from '@/api/dataset/type-damage-relation'
import { CrudTable, DictionarySelect, ScrollContainer } from '@/components'

const damageMultiplierOptions: Array<SelectOption> = [
  { label: '效果绝佳', value: 2 },
  { label: '效果一般', value: 1 },
  { label: '效果不好', value: 0.5 },
  { label: '没有效果', value: 0 },
]

// 表格列配置
const columns = [
  { title: '主键', key: 'id', width: 100 },
  { title: '攻击方属性', key: 'attackingTypeId' },
  { title: '防御方属性', key: 'defendingTypeId' },
  { title: '伤害系数', key: 'multiplier' },
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
