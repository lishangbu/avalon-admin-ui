<script setup lang="ts">
import { ref } from 'vue'

import {
  createSystemUser,
  deleteSystemUser,
  getSystemUserPage,
  listSystemRoles,
  updateSystemUser,
} from '@/api'
import { createCrudConfig, CrudPage, hasId, toSelectOptions } from '@/components'

import type { CrudInterfaceSchema, CrudPageSchema } from '@/components'
import type { FormRules, SelectOption } from 'naive-ui'

defineOptions({
  name: 'SystemUserPage',
})

const optionLoading = ref(false)
const roleOptions = ref<SelectOption[]>([])

const formRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: ['input', 'blur'] }],
}

async function loadOptions() {
  optionLoading.value = true

  try {
    const roleRes = await listSystemRoles()
    roleOptions.value = toSelectOptions(roleRes.data)
  } finally {
    optionLoading.value = false
  }
}

const interfaceSchema: CrudInterfaceSchema<SystemUser> = {
  createLabel: '新增用户',
  createDisabled: optionLoading,
  createTitle: '新增用户',
  createSuccessMessage: '用户新增成功',
  deleteConfirmMessage: '确认删除该用户吗？',
  deleteSuccessMessage: '用户删除成功',
  editTitle: '编辑用户',
  formFields: [
    {
      key: 'username',
      label: '用户名',
      type: 'input',
      placeholder: '例如：ash',
    },
    {
      key: 'phone',
      label: '手机号',
      type: 'input',
      placeholder: '例如：13800000000',
    },
    {
      key: 'email',
      label: '邮箱',
      type: 'input',
      placeholder: '例如：ash@example.com',
    },
    {
      key: 'avatar',
      label: '头像地址',
      type: 'input',
      placeholder: '例如：https://example.com/avatar.png',
    },
    {
      key: 'hashedPassword',
      label: '密码',
      type: 'input',
      placeholder: '留空则不修改密码',
    },
    {
      key: 'roleIds',
      label: '角色',
      type: 'select',
      placeholder: '选择角色',
      clearable: true,
      filterable: true,
      options: roleOptions,
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
      key: 'username',
      label: '用户名',
      type: 'input',
      placeholder: '输入用户名',
    },
    {
      key: 'phone',
      label: '手机号',
      type: 'input',
      placeholder: '输入手机号',
    },
    {
      key: 'email',
      label: '邮箱',
      type: 'input',
      placeholder: '输入邮箱',
    },
  ],
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
  indexColumn: true,
  tableColumns: [
    {
      title: '用户名',
      key: 'username',
      width: 160,
      fixed: 'left',
    },
    {
      title: '手机号',
      key: 'phone',
      width: 160,
    },
    {
      title: '邮箱',
      key: 'email',
      width: 220,
    },
    {
      title: '角色',
      key: 'roles',
      render: (record) =>
        record.roles
          ?.map((role) => role.name || role.code)
          .filter((value): value is string => Boolean(value))
          .join(', ') || '-',
    },
  ],
  updateSuccessMessage: '用户更新成功',
}

const pageSchema: CrudPageSchema<SystemUser, SystemUserQuery, SystemUserFormModel, SystemUser> = {
  initialize: loadOptions,
  loadPage: getSystemUserPage,
  mapRecordToFormModel: (record) => ({
    id: record.id ?? null,
    username: record.username ?? '',
    phone: record.phone ?? '',
    email: record.email ?? '',
    avatar: record.avatar ?? '',
    hashedPassword: '',
    roleIds:
      record.roles
        ?.map((role) => role.id)
        .filter((id): id is Id => hasId(id)) ?? [],
  }),
  createRecord: createSystemUser,
  createFormModel: () => ({
    id: null,
    username: '',
    phone: '',
    email: '',
    avatar: '',
    hashedPassword: '',
    roleIds: [],
  }),
  createPayload: (form) => {
    const password = form.hashedPassword.trim()

    return {
      ...(hasId(form.id) ? { id: form.id } : {}),
      username: form.username.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      avatar: form.avatar.trim(),
      ...(password ? { hashedPassword: password } : {}),
      roles: form.roleIds.map((id) => ({ id })),
    }
  },
  createSearchModel: () => ({
    username: '',
    phone: '',
    email: '',
  }),
  deleteRecord: (record) => {
    if (!hasId(record.id)) {
      return Promise.reject(new Error('Missing user id'))
    }

    return deleteSystemUser(record.id)
  },
  updateRecord: updateSystemUser,
}

const config = createCrudConfig({
  interface: interfaceSchema,
  page: pageSchema,
})
</script>

<template>
  <CrudPage :config="config" />
</template>
