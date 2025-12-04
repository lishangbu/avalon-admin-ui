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
const actionModalFormOption = {
  formItemProps: [
    {
      label: '内部名称',
      path: 'internalName',
      componentProps: {
        placeholder:'请输入内部名称',
      }
    },
    {
      label: '名称',
      path: 'name',
      componentProps: {
        placeholder: '请输入名称',
      }
    },
  ],
}
// 查询表单项配置
const searchFormOption = {
  formItemProps: [
    {
      label: '内部名称',
      path: 'internalName',
      componentProps: {
        placeholder:'请输入内部名称',
      }
    },
    {
      label: '名称',
      path: 'name',
      componentProps: {
        placeholder: '请输入名称',
      }
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
      :page="getBerryFlavorPage"
      :create="createBerryFlavor"
      :update="updateBerryFlavor"
      :remove="removeBerryFlavor"
    />
  </ScrollContainer>
</template>
