<script setup lang="ts">
import { ref } from 'vue'

import { createRole, deleteRole, getRolePage, listMenus, updateRole } from '@/api'
import {
  collectRelationIds,
  createCrudConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudPageSchema,
  CrudPage,
  fromFlagValue,
  hasId,
  toFlagValue,
} from '@/components'

import type { SelectOption } from 'naive-ui'
import type { TreeSelectOption } from 'naive-ui/es/tree-select'

defineOptions({
  name: 'SystemRolePage',
})

const optionLoading = ref(false)
const menuOptions = ref<RoleMenuTreeOption[]>([])

type RoleMenuTreeOption = TreeSelectOption & {
  key: string
  label: string
  value: string
  children?: RoleMenuTreeOption[]
}

const enabledOptions: SelectOption[] = [
  { label: '启用', value: YesNo.Yes },
  { label: '禁用', value: YesNo.No },
]

function normalizeRoleMenuId(value: Id) {
  return String(value)
}

function getMenuDisplayName(item: MenuView) {
  return item.label || item.name || item.key || (hasId(item.id) ? `#${item.id}` : '未命名菜单')
}

function toMenuOption(item: MenuView): RoleMenuTreeOption | null {
  if (!hasId(item.id)) {
    return null
  }

  return {
    key: normalizeRoleMenuId(item.id),
    value: normalizeRoleMenuId(item.id),
    label: getMenuDisplayName(item),
    disabled: item.disabled === true,
    children: [],
  }
}

function buildMenuOptions(items: MenuView[]): RoleMenuTreeOption[] {
  const nodeMap = new Map<string, RoleMenuTreeOption>()

  for (const item of items) {
    const option = toMenuOption(item)

    if (!option) {
      continue
    }

    nodeMap.set(option.value, option)
  }

  const roots: RoleMenuTreeOption[] = []

  for (const item of items) {
    if (!hasId(item.id)) {
      continue
    }

    const currentId = normalizeRoleMenuId(item.id)
    const currentNode = nodeMap.get(currentId)

    if (!currentNode) {
      continue
    }

    if (hasId(item.parentId)) {
      const parentNode = nodeMap.get(normalizeRoleMenuId(item.parentId))

      if (parentNode) {
        ;(parentNode.children ??= []).push(currentNode)
        continue
      }
    }

    roots.push(currentNode)
  }

  for (const node of nodeMap.values()) {
    if (!node.children?.length) {
      delete node.children
    }
  }

  return roots
}

async function loadOptions() {
  optionLoading.value = true

  try {
    const menuRes = await listMenus()
    menuOptions.value = buildMenuOptions(menuRes.data)
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
      defaultValue: YesNo.Yes,
      fromRecord: (record) => toFlagValue(record.enabled, YesNo.Yes) ?? YesNo.Yes,
    },
    payload: {
      toValue: (value) => fromFlagValue(value as NullableYesNo),
    },
    form: {
      label: '状态',
      component: 'radio',
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
      fromRecord: (record) => collectRelationIds(record.menus).map(normalizeRoleMenuId),
    },
    payload: {
      key: 'menuIds',
      toValue: (value) => (value as Id[]).map(normalizeRoleMenuId),
    },
    form: {
      label: '角色菜单',
      component: 'tree-select',
      placeholder: '勾选菜单权限',
      filterable: true,
      options: menuOptions,
      loading: optionLoading,
      props: {
        cascade: false,
        checkable: true,
        defaultExpandAll: true,
        maxTagCount: 'responsive',
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
  typeof createFlatCrudPageSchema<
    RoleView,
    RoleQuery,
    RoleFormModel,
    SaveRoleInput,
    UpdateRoleInput
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<RoleView, RoleFormModel>({
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
  ...createFlatCrudPageSchema<RoleView, RoleQuery, RoleFormModel, SaveRoleInput, UpdateRoleInput>({
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
