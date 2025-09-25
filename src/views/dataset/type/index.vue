<script lang="ts" setup>
import { createType, getTypePage, removeType, updateType } from '@/api/dataset/type'
import { CrudTable, ScrollContainer } from '@/components'

// 表格列配置
const columns = [
  { title: '主键', key: 'id', width: 100 },
  { title: '内部名称', key: 'internalName' },
  { title: '名称', key: 'name' }
]

// 表单项配置
const fields = [
  { label: '内部名称', key: 'internalName' },
  { label: '名称', key: 'name' }
]

// 查询表单项配置
const searchFields = [
  { label: '内部名称', key: 'internalName' },
  { label: '名称', key: 'name' }
]

</script>

<template>
  <ScrollContainer wrapper-class="flex flex-col gap-y-2">
    <CrudTable
      :columns="columns"
      :fields="fields"
      :search-fields="searchFields"
      :page="getTypePage"
      :create="createType"
      :update="updateType"
      :remove="removeType"
    />
  </ScrollContainer>
</template>
