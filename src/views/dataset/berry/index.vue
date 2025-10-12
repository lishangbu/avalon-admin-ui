<script lang="ts" setup>
import { h, onMounted, ref } from 'vue'
import { NInputNumber, NTag } from 'naive-ui'

import { createBerry, getBerryPage, removeBerry, updateBerry } from '@/api/dataset/berry'
import { listBerryFirmness } from '@/api/dataset/berry-firmness'
import { listTypes } from '@/api/dataset/type'
import { CrudTable, DictionarySelect, ScrollContainer } from '@/components'
import { useDictionary } from '@/composables'

import type { FieldConfig } from '@/components'

// 使用字典缓存
const { getDictionary } = useDictionary()

// 字典数据缓存
const berryFirmnessDict = ref<Record<string, string>>({})
const typeDict = ref<Record<string, string>>({})

// 加载字典数据
onMounted(async () => {
  try {
    // 并行加载所有字典数据（cacheKey 自动从函数名生成）
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

// 表单项配置
const fields: FieldConfig[] = [
  { label: '内部名称', key: 'internalName' },
  { label: '名称', key: 'name' },
  {
    label: '生长时间(小时)',
    key: 'growthTime',
    component: NInputNumber
  },
  {
    label: '最大结果数',
    key: 'maxHarvest',
    component: NInputNumber
  },
  {
    label: '大小（毫米）',
    key: 'bulk',
    component: NInputNumber
  },
  {
    label: '光滑度',
    key: 'smoothness',
    component: NInputNumber
  },
  {
    label: '土壤干燥速度',
    key: 'soilDryness',
    component: NInputNumber
  },
  {
    label: '坚硬度',
    key: 'firmnessInternalName',
    component: DictionarySelect,
    props: {
      api: listBerryFirmness,
      labelField: 'name',
      valueField: 'internalName'
    }
  },
  {
    label: '自然之恩属性',
    key: 'naturalGiftTypeInternalName',
    component: DictionarySelect,
    props: {
      api: listTypes,
      labelField: 'name',
      valueField: 'internalName'
    }
  },
  {
    label: '自然之恩威力',
    key: 'naturalGiftPower',
    component: NInputNumber
  },
]

// 查询表单项配置
const searchFields: FieldConfig[] = [
  { label: '内部名称', key: 'internalName' },
  { label: '名称', key: 'name' },
  {
    label: '坚硬度',
    key: 'firmnessInternalName',
    component: DictionarySelect,
    placeholder:'请选择坚硬度',
    props: {
      api: listBerryFirmness,
      labelField: 'name',
      valueField: 'internalName'
    }
  },
  {
    label: '自然之恩属性',
    key: 'naturalGiftTypeInternalName',
    placeholder:'请选择自然之恩属性',
    component: DictionarySelect,
    props: {
      api: listTypes,
      labelField: 'name',
      valueField: 'internalName'
    }
  }
]

</script>

<template>
  <ScrollContainer wrapper-class="flex flex-col gap-y-2">
    <CrudTable
      :columns="columns"
      :fields="fields"
      :search-fields="searchFields"
      :page="getBerryPage"
      :create="createBerry"
      :update="updateBerry"
      :remove="removeBerry"
    />
  </ScrollContainer>
</template>
