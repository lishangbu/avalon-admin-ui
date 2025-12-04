<script lang="ts" setup>
import { NInputNumber, NTag } from 'naive-ui'
import { h, onMounted, ref } from 'vue'

import { createBerry, getBerryPage, removeBerry, updateBerry } from '@/api/dataset/berry'
import { listBerryFirmness } from '@/api/dataset/berry-firmness'
import { listTypes } from '@/api/dataset/type'
import { CrudTable, DictionarySelect, ScrollContainer } from '@/components'
import { useDictionary } from '@/composables'

// 使用字典缓存工具
const { getDictionary } = useDictionary()

// 字典数据缓存
const berryFirmnessDict = ref<Record<string, string>>({})
const typeDict = ref<Record<string, string>>({})

// 加载字典数据（并行）
onMounted(async () => {
  try {
    const [firmness, type] = await Promise.all([
      getDictionary(listBerryFirmness, 'internalName', 'name'),
      getDictionary(listTypes, 'internalName', 'name')
    ])

    berryFirmnessDict.value = firmness
    typeDict.value = type
  } catch (error) {
    console.error('加载字典数据失败:', error)
  }
})

// 表格列配置
const columns = [
  { title: '主键', key: 'id', width: 120 },
  { title: '内部名称', key: 'internalName' },
  { title: '名称', key: 'name' },
  { title: '生长时间(小时)', key: 'growthTime' },
  { title: '最大结果数', key: 'maxHarvest' },
  { title: '大小（毫米）', key: 'bulk' },
  { title: '光滑度', key: 'smoothness' },
  { title: '土壤干燥速度', key: 'soilDryness' },
  {
    title: '坚硬度',
    key: 'firmnessInternalName',
    render(row: any) {
      const name = berryFirmnessDict.value[row.firmnessInternalName]
      return name ? h(NTag, { type: 'info', size: 'small' }, { default: () => name }) : row.firmnessInternalName || '-'
    }
  },
  {
    title: '自然之恩属性',
    key: 'naturalGiftTypeInternalName',
    render(row: any) {
      const name = typeDict.value[row.naturalGiftTypeInternalName]
      return name ? h(NTag, { type: 'success', size: 'small' }, { default: () => name }) : row.naturalGiftTypeInternalName || '-'
    }
  },
  { title: '自然之恩威力', key: 'naturalGiftPower' }
]

// action modal 表单配置（用于新增/编辑）
const actionModalFormOption = {
  formItemProps: [
    { label: '内部名称', path: 'internalName', componentProps: { placeholder: '请输入内部名称' } },
    { label: '名称', path: 'name', componentProps: { placeholder: '请输入名称' } },
    { label: '生长时间(小时)', path: 'growthTime', component: NInputNumber },
    { label: '最大结果数', path: 'maxHarvest', component: NInputNumber },
    { label: '大小（毫米）', path: 'bulk', component: NInputNumber },
    { label: '光滑度', path: 'smoothness', component: NInputNumber },
    { label: '土壤干燥速度', path: 'soilDryness', component: NInputNumber },
    {
      label: '坚硬度',
      path: 'firmnessInternalName',
      component: DictionarySelect,
      componentProps: {
        api: listBerryFirmness,
        labelField: 'name',
        valueField: 'internalName'
      }
    },
    {
      label: '自然之恩属性',
      path: 'naturalGiftTypeInternalName',
      component: DictionarySelect,
      componentProps: {
        api: listTypes,
        labelField: 'name',
        valueField: 'internalName'
      }
    },
    { label: '自然之恩威力', path: 'naturalGiftPower', component: NInputNumber }
  ]
}

// 查询表单配置
const searchFormOption = {
  formItemProps: [
    { label: '内部名称', path: 'internalName', componentProps: { placeholder: '请输入内部名称' } },
    { label: '名称', path: 'name', componentProps: { placeholder: '请输入名称' } },
    {
      label: '坚硬度',
      path: 'firmnessInternalName',
      component: DictionarySelect,
      componentProps: { api: listBerryFirmness, labelField: 'name', valueField: 'internalName' },
      placeholder: '请选择坚硬度'
    },
    {
      label: '自然之恩属性',
      path: 'naturalGiftTypeInternalName',
      component: DictionarySelect,
      componentProps: { api: listTypes, labelField: 'name', valueField: 'internalName' },
      placeholder: '请选择自然之恩属性'
    }
  ]
}

</script>

<template>
  <ScrollContainer wrapper-class="flex flex-col gap-y-2">
    <CrudTable
      :columns="columns"
      :action-modal-form-option="actionModalFormOption"
      :search-form-option="searchFormOption"
      :page="getBerryPage"
      :create="createBerry"
      :update="updateBerry"
      :remove="removeBerry"
    />
  </ScrollContainer>
</template>
