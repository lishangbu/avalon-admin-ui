<script setup lang="ts">
import {
  createOauthRegisteredClient,
  deleteOauthRegisteredClient,
  getOauthRegisteredClientById,
  getOauthRegisteredClientPage,
  updateOauthRegisteredClient,
} from '@/api'
import {
  createCrudConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudPageSchema,
  CrudPage,
  fromFlagValue,
  joinCommaSeparatedValues,
  splitCommaSeparatedValues,
  toFlagValue,
} from '@/components'

import type { SelectOption } from 'naive-ui'

defineOptions({
  name: 'SystemOauthRegisteredClientPage',
})

const clientAuthenticationMethodOptions: SelectOption[] = [
  { label: 'client_secret_basic', value: 'client_secret_basic' },
  { label: 'client_secret_post', value: 'client_secret_post' },
  { label: 'client_secret_jwt', value: 'client_secret_jwt' },
  { label: 'private_key_jwt', value: 'private_key_jwt' },
  { label: 'none', value: 'none' },
  { label: 'tls_client_auth', value: 'tls_client_auth' },
  { label: 'self_signed_tls_client_auth', value: 'self_signed_tls_client_auth' },
]

const authorizationGrantTypeOptions: SelectOption[] = [
  { label: 'authorization_code', value: 'authorization_code' },
  { label: 'refresh_token', value: 'refresh_token' },
  { label: 'client_credentials', value: 'client_credentials' },
  { label: 'password', value: 'password' },
  { label: 'sms', value: 'sms' },
  { label: 'email', value: 'email' },
  {
    label: 'urn:ietf:params:oauth:grant-type:device_code',
    value: 'urn:ietf:params:oauth:grant-type:device_code',
  },
  {
    label: 'urn:ietf:params:oauth:grant-type:token-exchange',
    value: 'urn:ietf:params:oauth:grant-type:token-exchange',
  },
]

const booleanOptions: SelectOption[] = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 0,
  },
]

function renderBoolean(value: boolean | null | undefined) {
  if (typeof value !== 'boolean') {
    return '-'
  }

  return value ? '是' : '否'
}

const fields = [
  {
    key: 'id',
    formModel: {
      defaultValue: '',
      fromRecord: (record) => record.id ?? '',
    },
    payload: {
      trim: true,
      omitWhen: (value) => typeof value !== 'string' || value.length === 0,
    },
  },
  {
    key: 'clientId',
    trim: true,
    form: {
      label: '客户端 ID',
      component: 'input',
      placeholder: '例如：admin-ui',
      rules: [{ required: true, message: '请输入客户端 ID', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '客户端 ID',
      component: 'input',
      placeholder: '输入客户端 ID',
    },
    table: {
      title: '客户端 ID',
      width: 220,
      fixed: 'left',
    },
  },
  {
    key: 'clientName',
    trim: true,
    form: {
      label: '客户端名称',
      component: 'input',
      placeholder: '例如：管理后台',
      rules: [{ required: true, message: '请输入客户端名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '客户端名称',
      component: 'input',
      placeholder: '输入客户端名称',
    },
    table: {
      title: '客户端名称',
      width: 200,
    },
  },
  {
    key: 'clientSecret',
    trim: true,
    form: {
      label: '客户端密钥',
      component: 'input',
      placeholder: '例如：secret',
    },
  },
  {
    key: 'clientAuthenticationMethods',
    formModel: {
      defaultValue: [],
      fromRecord: (record) => splitCommaSeparatedValues(record.clientAuthenticationMethods),
    },
    payload: {
      toValue: (value) => joinCommaSeparatedValues(value as string[]),
    },
    form: {
      label: '客户端认证方式',
      component: 'select',
      placeholder: '请选择客户端认证方式',
      clearable: true,
      filterable: true,
      options: clientAuthenticationMethodOptions,
      rules: [
        {
          required: true,
          type: 'array',
          min: 1,
          message: '请选择客户端认证方式',
          trigger: ['change'],
        },
      ],
      props: {
        multiple: true,
      },
      defaultValue: [],
    },
  },
  {
    key: 'authorizationGrantTypes',
    formModel: {
      defaultValue: [],
      fromRecord: (record) => splitCommaSeparatedValues(record.authorizationGrantTypes),
    },
    payload: {
      toValue: (value) => joinCommaSeparatedValues(value as string[]),
    },
    form: {
      label: '授权方式',
      component: 'select',
      placeholder: '请选择授权方式',
      clearable: true,
      filterable: true,
      options: authorizationGrantTypeOptions,
      rules: [
        { required: true, type: 'array', min: 1, message: '请选择授权方式', trigger: ['change'] },
      ],
      props: {
        multiple: true,
      },
      defaultValue: [],
    },
    table: {
      title: '授权方式',
      width: 240,
    },
  },
  {
    key: 'redirectUris',
    trim: true,
    form: {
      label: '回调地址',
      component: 'input',
      placeholder: '例如：http://localhost:5173/callback',
    },
  },
  {
    key: 'postLogoutRedirectUris',
    trim: true,
    form: {
      label: '登出回调地址',
      component: 'input',
      placeholder: '例如：http://localhost:5173/',
    },
  },
  {
    key: 'scopes',
    trim: true,
    form: {
      label: 'Scopes',
      component: 'input',
      placeholder: '例如：openid,profile',
    },
    table: {
      title: 'Scopes',
      width: 200,
    },
  },
  {
    key: 'authorizationCodeTimeToLive',
    trim: true,
    form: {
      label: '授权码有效期',
      component: 'input',
      placeholder: '例如：PT5M',
    },
  },
  {
    key: 'accessTokenTimeToLive',
    trim: true,
    form: {
      label: '访问令牌有效期',
      component: 'input',
      placeholder: '例如：PT30M',
    },
  },
  {
    key: 'refreshTokenTimeToLive',
    trim: true,
    form: {
      label: '刷新令牌有效期',
      component: 'input',
      placeholder: '例如：PT8H',
    },
  },
  {
    key: 'requireProofKey',
    formModel: {
      defaultValue: 0,
      fromRecord: (record) => toFlagValue(record.requireProofKey, 0),
    },
    payload: {
      toValue: (value) => fromFlagValue(value as number | null),
      omitWhen: (value) => value === undefined,
    },
    form: {
      label: '要求 PKCE',
      component: 'radio',
      options: booleanOptions,
      defaultValue: 0,
    },
    table: {
      title: 'PKCE',
      width: 100,
      render: (record) => renderBoolean(record.requireProofKey),
    },
  },
  {
    key: 'requireAuthorizationConsent',
    formModel: {
      defaultValue: 0,
      fromRecord: (record) => toFlagValue(record.requireAuthorizationConsent, 0),
    },
    payload: {
      toValue: (value) => fromFlagValue(value as number | null),
      omitWhen: (value) => value === undefined,
    },
    form: {
      label: '要求授权确认',
      component: 'radio',
      options: booleanOptions,
      defaultValue: 0,
    },
    table: {
      title: '授权确认',
      width: 100,
      render: (record) => renderBoolean(record.requireAuthorizationConsent),
    },
  },
  {
    key: 'reuseRefreshTokens',
    formModel: {
      defaultValue: 1,
      fromRecord: (record) => toFlagValue(record.reuseRefreshTokens, 1),
    },
    payload: {
      toValue: (value) => fromFlagValue(value as number | null),
      omitWhen: (value) => value === undefined,
    },
    form: {
      label: '复用刷新令牌',
      component: 'radio',
      options: booleanOptions,
      defaultValue: 1,
    },
  },
  {
    key: 'x509CertificateBoundAccessTokens',
    formModel: {
      defaultValue: 0,
      fromRecord: (record) => toFlagValue(record.x509CertificateBoundAccessTokens, 0),
    },
    payload: {
      toValue: (value) => fromFlagValue(value as number | null),
      omitWhen: (value) => value === undefined,
    },
    form: {
      label: '绑定 x509 访问令牌',
      component: 'radio',
      options: booleanOptions,
      defaultValue: 0,
    },
  },
] as const satisfies Parameters<
  typeof createFlatCrudPageSchema<
    OauthRegisteredClientView,
    OauthRegisteredClientQuery,
    OauthRegisteredClientFormModel,
    SaveOauthRegisteredClientInput,
    UpdateOauthRegisteredClientInput
  >
>[0]['fields']

const interfaceSchema = createFlatCrudInterfaceSchema<
  OauthRegisteredClientView,
  OauthRegisteredClientFormModel
>({
  create: {
    buttonLabel: '新增注册客户端',
    successMessage: '注册客户端新增成功',
  },
  delete: {
    confirmMessage: '确认删除该注册客户端吗？',
    successMessage: '注册客户端删除成功',
  },
  edit: {
    dialogTitle: '编辑注册客户端',
    successMessage: '注册客户端更新成功',
  },
  fields,
  formGridClass: 'grid gap-4 md:grid-cols-2',
  indexColumn: true,
  modalWidth: 'min(96vw, 1100px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
})

const pageSchema = {
  loadRecordForEdit: async (record: OauthRegisteredClientView) => {
    if (!record.id) {
      return record
    }

    const res = await getOauthRegisteredClientById(record.id)
    return res.data
  },
  ...createFlatCrudPageSchema<
    OauthRegisteredClientView,
    OauthRegisteredClientQuery,
    OauthRegisteredClientFormModel,
    SaveOauthRegisteredClientInput,
    UpdateOauthRegisteredClientInput
  >({
    fields,
    loadPage: getOauthRegisteredClientPage,
    createRecord: createOauthRegisteredClient,
    deleteRecord: (id) => deleteOauthRegisteredClient(String(id)),
    updateRecord: updateOauthRegisteredClient,
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
