<script setup lang="ts">
import { ref } from 'vue'

import {
  createSystemRole,
  deleteSystemRole,
  getSystemRolePage,
  listSystemMenus,
  updateSystemRole,
} from '@/api'
import { createCrudConfig, CrudPage, hasId } from '@/components'

import type { CrudInterfaceSchema, CrudPageSchema } from '@/components'
import type { FormRules, SelectOption } from 'naive-ui'

defineOptions({
  name: 'SystemRolePage',
})

const optionLoading = ref(false)
const menuOptions = ref<SelectOption[]>([])

const enabledOptions: SelectOption[] = [
  {
    label: '启用',
    value: 1,
  },
  {
    label: '禁用',
    value: 0,
  },
]

const formRules: FormRules = {
  code: [{ required: true, message: '请输入角色代码', trigger: ['input', 'blur'] }],
  name: [{ required: true, message: '请输入角色名称', trigger: ['input', 'blur'] }],
  enabled: [{ required: true, type: 'number', message: '请选择角色状态', trigger: ['change'] }],
}

function toMenuOption(item: SystemMenu): SelectOption | null {
  if (!hasId(item.id)) {
    return null
  }

  return {
    value: item.id,
    label: item.label || item.name || item.key || `#${item.id}`,
  }
}

async function loadOptions() {
  optionLoading.value = true

  try {
    const menuRes = await listSystemMenus()
    menuOptions.value = menuRes.data.map(toMenuOption).filter((item): item is SelectOption => Boolean(item))
  } finally {
    optionLoading.value = false
  }
}

const interfaceSchema: CrudInterfaceSchema<SystemRole> = {
  createLabel: '新增角色',
  createDisabled: optionLoading,
  createTitle: '新增角色',
  createSuccessMessage: '角色新增成功',
  deleteConfirmMessage: '确认删除该角色吗？',
  deleteSuccessMessage: '角色删除成功',
  editTitle: '编辑角色',
  formFields: [
    {
      key: 'code',
      label: '角色代码',
      type: 'input',
      placeholder: '例如：ADMIN',
    },
    {
      key: 'name',
      label: '角色名称',
      type: 'input',
      placeholder: '例如：管理员',
    },
    {
      key: 'enabled',
      label: '状态',
      type: 'select',
      placeholder: '请选择状态',
      options: enabledOptions,
    },
    {
      key: 'menuIds',
      label: '角色菜单',
      type: 'select',
      placeholder: '选择菜单',
      clearable: true,
      filterable: true,
      options: menuOptions,
      loading: optionLoading,
      props: {
        multiple: true,
      },
    },
  ],
  formGridClass: 'grid gap-4 md:grid-cols-2',
  formRules,
  modalWidth: 'min(96vw, 900px)',
  searchFields: [
    {
      key: 'code',
      label: '角色代码',
      type: 'input',
      placeholder: '输入角色代码',
    },
    {
      key: 'name',
      label: '角色名称',
      type: 'input',
      placeholder: '输入角色名称',
    },
  ],
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
  indexColumn: true,
  tableColumns: [
    {
      title: '角色代码',
      key: 'code',
      width: 180,
      fixed: 'left',
    },
    {
      title: '角色名称',
      key: 'name',
      width: 180,
    },
    {
      title: '状态',
      key: 'enabled',
      width: 100,
      render: (record) => {
        if (typeof record.enabled !== 'boolean') {
          return '-'
        }

        return record.enabled ? '启用' : '禁用'
      },
    },
    {
      title: '关联菜单',
      key: 'menus',
      render: (record) =>
        record.menus
          ?.map((menu) => menu.label || menu.name || menu.key)
          .filter((value): value is string => Boolean(value))
          .join(', ') || '-',
    },
  ],
  updateSuccessMessage: '角色更新成功',
}

const pageSchema: CrudPageSchema<SystemRole, SystemRoleQuery, SystemRoleFormModel, SystemRole> = {
  initialize: loadOptions,
  loadPage: getSystemRolePage,
  mapRecordToFormModel: (record) => ({
    id: record.id ?? null,
    code: record.code ?? '',
    name: record.name ?? '',
    enabled: record.enabled === true ? 1 : record.enabled === false ? 0 : null,
    menuIds:
      record.menus
        ?.map((menu) => menu.id)
        .filter((id): id is Id => hasId(id)) ?? [],
  }),
  createRecord: createSystemRole,
  createFormModel: () => ({
    id: null,
    code: '',
    name: '',
    enabled: 1,
    menuIds: [],
  }),
  createPayload: (form) => ({
    ...(hasId(form.id) ? { id: form.id } : {}),
    code: form.code.trim(),
    name: form.name.trim(),
    enabled: form.enabled === 1,
    menus: form.menuIds.map((id) => ({ id })),
  }),
  createSearchModel: () => ({
    code: '',
    name: '',
  }),
  deleteRecord: (record) => {
    if (!hasId(record.id)) {
      return Promise.reject(new Error('Missing role id'))
    }

    return deleteSystemRole(record.id)
  },
  updateRecord: updateSystemRole,
}

const config = createCrudConfig({
  interface: interfaceSchema,
  page: pageSchema,
})
</script>

<template>
  <CrudPage :config="config" />
</template>
