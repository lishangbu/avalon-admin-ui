<script lang="ts" setup>
import { NButton, type PaginationProps } from 'naive-ui'
import { defineForm, defineTable, NuForm, NuTable, useColumns } from 'naive-ultra'
import { reactive } from 'vue'

import { getTypePage } from '@/api/dataset/type.ts'
import { ScrollContainer } from '@/components'

import type { Type } from '@/types/modules/dataset/type'
import type { ServerPaginationResolve } from '@naive-ultra/table'

const columns = useColumns<Type>([
  { key: 'id', title: '主键',width:50 },
  { key: 'internalName', title: '内部名称' },
  { key: 'name', title: '名称' }
])

const form = defineForm({
  internalName: {
    type: 'input',
    placeholder: '内部名称'
  },
  name: {
    type: 'input',
    placeholder: '名称'
  }
})

const pagination = reactive<PaginationProps>({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100, 500],
  showQuickJumper: true,
  showQuickJumpDropdown: true,
  onUpdatePage: (page: number) => {
    pagination.page = page
    getTypePage({ page: page - 1 }).then(res => {
      table.data = res?.data?.content ?? []
    })
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    getTypePage({ page: pagination.page - 1, size: pagination.pageSize }).then(res => {
      table.data = res?.data?.content ?? []
    })
  }
})

const table = defineTable<Type[]>({
  request: async (pagination: ServerPaginationResolve) => {
    const res = await getTypePage({ page: pagination.page - 1, size: pagination.pageSize })
    return {
      data: res?.data?.content ?? [],
      total: Number(res?.data?.totalElements ?? 0)
    }
  }
})
</script>

<template>
  <ScrollContainer
    wrapper-class="flex flex-col gap-y-2"
  >
    <nu-form :is="form">
      <template #toolbars>
        <n-button>搜索</n-button>
      </template>
    </nu-form>
    <nu-table :is="table"
              :pagination="pagination"
              :columns="columns" />
  </ScrollContainer>
</template>
