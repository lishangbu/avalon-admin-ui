<script lang="ts" setup>
import { createBerryFlavor, getBerryFlavorPage, removeBerryFlavor, updateBerryFlavor } from '@/api/dataset/berry-flavor'
import { CrudTable, ScrollContainer } from '@/components'

// 表格列配置
const columns = [
  { title: '主键', key: 'id', width: 200 },
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
      :page="getBerryFlavorPage"
      :create="createBerryFlavor"
      :update="updateBerryFlavor"
      :remove="removeBerryFlavor"
    />
  </ScrollContainer>
</template>
