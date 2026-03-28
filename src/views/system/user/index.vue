<script setup lang="ts">
import { ref } from 'vue'

import { createUser, deleteUser, getUserPage, listRoles, updateUser } from '@/api'
import {
  collectRelationIds,
  createCrudConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudPageSchema,
  createRelations,
  CrudPage,
  hasId,
  toSelectOptions,
} from '@/components'

import type { SelectOption } from 'naive-ui'

defineOptions({
  name: 'SystemUserPage',
})

const optionLoading = ref(false)
const roleOptions = ref<SelectOption[]>([])

async function loadOptions() {
  optionLoading.value = true

  try {
    const roleRes = await listRoles()
    roleOptions.value = toSelectOptions(roleRes.data)
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
    key: 'username',
    trim: true,
    form: {
      label: '用户名',
      component: 'input',
      placeholder: '例如：ash',
      rules: [{ required: true, message: '请输入用户名', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '用户名',
      component: 'input',
      placeholder: '输入用户名',
    },
    table: {
      title: '用户名',
      width: 160,
      fixed: 'left',
    },
  },
  {
    key: 'phone',
    trim: true,
    form: {
      label: '手机号',
      component: 'input',
      placeholder: '例如：13800000000',
    },
    search: {
      label: '手机号',
      component: 'input',
      placeholder: '输入手机号',
    },
    table: {
      title: '手机号',
      width: 160,
    },
  },
  {
    key: 'email',
    trim: true,
    form: {
      label: '邮箱',
      component: 'input',
      placeholder: '例如：ash@example.com',
    },
    search: {
      label: '邮箱',
      component: 'input',
      placeholder: '输入邮箱',
    },
    table: {
      title: '邮箱',
      width: 220,
    },
  },
  {
    key: 'avatar',
    trim: true,
    form: {
      label: '头像地址',
      component: 'input',
      placeholder: '例如：https://example.com/avatar.png',
    },
  },
  {
    key: 'hashedPassword',
    trim: true,
    form: {
      label: '密码',
      component: 'input',
      placeholder: '留空则不修改密码',
      defaultValue: '',
    },
    payload: {
      omitWhen: (value) => typeof value !== 'string' || value.length === 0,
    },
  },
  {
    key: 'roleIds',
    formModel: {
      defaultValue: [],
      fromRecord: (record) => collectRelationIds(record.roles),
    },
    payload: {
      key: 'roles',
      toValue: (value) => createRelations(value as Id[]),
    },
    form: {
      label: '角色',
      component: 'select',
      placeholder: '选择角色',
      clearable: true,
      filterable: true,
      options: roleOptions,
      loading: optionLoading,
      props: {
        multiple: true,
      },
      defaultValue: [],
    },
    table: {
      title: '角色',
      render: (record) =>
        record.roles
          ?.map((role) => role.name || role.code)
          .filter((value): value is string => Boolean(value))
          .join(', ') || '-',
    },
  },
] as const satisfies Parameters<typeof createFlatCrudPageSchema<User, UserQuery, UserFormModel, User>>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<User, UserFormModel>({
  create: {
    buttonLabel: '新增用户',
    disabled: optionLoading,
    successMessage: '用户新增成功',
  },
  delete: {
    confirmMessage: '确认删除该用户吗？',
    successMessage: '用户删除成功',
  },
  edit: {
    dialogTitle: '编辑用户',
    successMessage: '用户更新成功',
  },
  fields,
  formGridClass: 'grid gap-4 md:grid-cols-2',
  indexColumn: true,
  modalWidth: 'min(96vw, 900px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const pageSchema = {
  initialize: loadOptions,
  ...createFlatCrudPageSchema<User, UserQuery, UserFormModel, User>({
    fields,
    loadPage: getUserPage,
    createRecord: createUser,
    deleteRecord: deleteUser,
    updateRecord: updateUser,
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
