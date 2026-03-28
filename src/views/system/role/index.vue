<script setup lang="ts">
import { ref } from 'vue'

import { createRole, deleteRole, getRolePage, listMenus, updateRole } from '@/api'
import {
  collectRelationIds,
  createCrudConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudPageSchema,
  createRelations,
  CrudPage,
  fromFlagValue,
  hasId,
  toFlagValue,
} from '@/components'

import type { SelectOption } from 'naive-ui'

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

function toMenuOption(item: Menu): SelectOption | null {
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
    const menuRes = await listMenus()
    menuOptions.value = menuRes.data
      .map(toMenuOption)
      .filter((item): item is SelectOption => Boolean(item))
  } finally {
    optionLoading.value = false
  }
}

const fields = [
  {
    key: 'id',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => record.id ?? null,
    },
    payload: {
      omitWhen: (value) => !hasId(value),
    },
  },
  {
    key: 'code',
    trim: true,
    form: {
      label: '角色代码',
      component: 'input',
      placeholder: '例如：ADMIN',
      rules: [{ required: true, message: '请输入角色代码', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '角色代码',
      component: 'input',
      placeholder: '输入角色代码',
    },
    table: {
      title: '角色代码',
      width: 180,
      fixed: 'left',
    },
  },
  {
    key: 'name',
    trim: true,
    form: {
      label: '角色名称',
      component: 'input',
      placeholder: '例如：管理员',
      rules: [{ required: true, message: '请输入角色名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '角色名称',
      component: 'input',
      placeholder: '输入角色名称',
    },
    table: {
      title: '角色名称',
      width: 180,
    },
  },
  {
    key: 'enabled',
    formModel: {
      defaultValue: 1,
      fromRecord: (record) => toFlagValue(record.enabled, null) ?? 1,
    },
    payload: {
      toValue: (value) => fromFlagValue(value as number | null),
    },
    form: {
      label: '状态',
      component: 'select',
      placeholder: '请选择状态',
      options: enabledOptions,
      defaultValue: 1,
      rules: [{ required: true, type: 'number', message: '请选择角色状态', trigger: ['change'] }],
    },
    table: {
      title: '状态',
      width: 100,
      render: (record) => {
        if (typeof record.enabled !== 'boolean') {
          return '-'
        }

        return record.enabled ? '启用' : '禁用'
      },
    },
  },
  {
    key: 'menuIds',
    formModel: {
      defaultValue: [],
      fromRecord: (record) => collectRelationIds(record.menus),
    },
    payload: {
      key: 'menus',
      toValue: (value) => createRelations(value as Id[]),
    },
    form: {
      label: '角色菜单',
      component: 'select',
      placeholder: '选择菜单',
      clearable: true,
      filterable: true,
      options: menuOptions,
      loading: optionLoading,
      props: {
        multiple: true,
      },
      defaultValue: [],
    },
    table: {
      title: '关联菜单',
      render: (record) =>
        record.menus
          ?.map((menu) => menu.label || menu.name || menu.key)
          .filter((value): value is string => Boolean(value))
          .join(', ') || '-',
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudPageSchema<Role, RoleQuery, RoleFormModel, Role>
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<Role, RoleFormModel>({
  create: {
    buttonLabel: '新增角色',
    disabled: optionLoading,
    successMessage: '角色新增成功',
  },
  delete: {
    confirmMessage: '确认删除该角色吗？',
    successMessage: '角色删除成功',
  },
  edit: {
    dialogTitle: '编辑角色',
    successMessage: '角色更新成功',
  },
  fields,
  formGridClass: 'grid gap-4 md:grid-cols-2',
  indexColumn: true,
  modalWidth: 'min(96vw, 900px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const pageSchema = {
  initialize: loadOptions,
  ...createFlatCrudPageSchema<Role, RoleQuery, RoleFormModel, Role>({
    fields,
    loadPage: getRolePage,
    createRecord: createRole,
    deleteRecord: deleteRole,
    updateRecord: updateRole,
  }),
}

const config = createCrudConfig({
  interface: interfaceSchema,
  page: pageSchema,
})
</script>

<template>
  <CrudPage :config="config" />
</template>
