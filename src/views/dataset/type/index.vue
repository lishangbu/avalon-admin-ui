<script lang="ts" setup>
import { createType, getTypePage, removeType, updateType } from '@/api/dataset/type'
import { CrudTable, ScrollContainer } from '@/components'

// 表格列配置
const columns = [
  { title: '主键', key: 'id', width: 100 },
  { title: '内部名称', key: 'internalName' },
  { title: '名称', key: 'name' },
]

// 查询表单项配置
const searchFormOption = {
  formItemProps: [
    {
      label: '内部名称',
      path: 'internalName',
      componentProps: {
        placeholder: '请输入内部名称',
      },
    },
    {
      label: '名称',
      path: 'name',
      componentProps: {
        placeholder: '请输入名称',
      },
    },
  ],
}
// 表单项配置
const actionModalFormOption = {
  formItemProps: [
    {
      label: '内部名称',
      path: 'internalName',
      componentProps: {
        placeholder: '请输入内部名称',
      },
    },
    {
      label: '名称',
      path: 'name',
      componentProps: {
        placeholder: '请输入名称',
      },
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
      :page="getTypePage"
      :create="createType"
      :update="updateType"
      :remove="removeType"
    />
  </ScrollContainer>
</template>
