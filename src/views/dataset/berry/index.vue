<script lang="ts" setup>
import { createBerry, getBerryPage, removeBerry, updateBerry } from '@/api/dataset/berry'
import { CrudTable, ScrollContainer } from '@/components'

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
  { title: '坚硬度', key: 'firmnessInternalName' },
  { title: '自然之恩属性', key: 'naturalGiftTypeInternalName' },
  { title: '自然之恩威力', key: 'naturalGiftPower' }
]

// 表单项配置
const fields = [
  { label: '内部名称', key: 'internalName' },
  { label: '名称', key: 'name' },
  { label: '生长时间(小时)', key: 'growthTime', type: 'number' },
  { label: '最大结果数', key: 'maxHarvest', type: 'number' },
  { label: '大小（毫米）', key: 'bulk', type: 'number' },
  { label: '光滑度', key: 'smoothness', type: 'number' },
  { label: '土壤干燥速度', key: 'soilDryness', type: 'number' },
  { label: '坚硬度', key: 'firmnessInternalName' },
  { label: '自然之恩属性', key: 'naturalGiftTypeInternalName' },
  { label: '自然之恩威力', key: 'naturalGiftPower', type: 'number' }
]

// 查询表单项配置
const searchFields = [
  { label: '内部名称', key: 'internalName' },
  { label: '名称', key: 'name' },
  { label: '坚硬度', key: 'firmnessInternalName' },
  { label: '自然之恩属性', key: 'naturalGiftTypeInternalName' }
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

