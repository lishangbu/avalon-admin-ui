<script setup lang="ts">
import {
  createOauthRegisteredClient,
  deleteOauthRegisteredClient,
  getOauthRegisteredClientPage,
  updateOauthRegisteredClient,
} from '@/api'
import { createCrudConfig, CrudPage, hasId } from '@/components'

import type { CrudInterfaceSchema, CrudPageSchema } from '@/components'
import type { FormRules, SelectOption } from 'naive-ui'

defineOptions({
  name: 'SystemOauthRegisteredClientPage',
})

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

const formRules: FormRules = {
  clientId: [{ required: true, message: '请输入客户端 ID', trigger: ['input', 'blur'] }],
  clientName: [{ required: true, message: '请输入客户端名称', trigger: ['input', 'blur'] }],
}

function toFlag(value: boolean | null | undefined) {
  if (value === true) {
    return 1
  }

  if (value === false) {
    return 0
  }

  return null
}

function toBoolean(value: number | null) {
  if (value === null) {
    return undefined
  }

  return value === 1
}

function renderBoolean(value: boolean | null | undefined) {
  if (typeof value !== 'boolean') {
    return '-'
  }

  return value ? '是' : '否'
}

const interfaceSchema: CrudInterfaceSchema<OauthRegisteredClient> = {
  createLabel: '新增注册客户端',
  createTitle: '新增注册客户端',
  createSuccessMessage: '注册客户端新增成功',
  deleteConfirmMessage: '确认删除该注册客户端吗？',
  deleteSuccessMessage: '注册客户端删除成功',
  editTitle: '编辑注册客户端',
  formFields: [
    {
      key: 'id',
      label: '主键',
      type: 'input',
      placeholder: '可留空，由后端生成',
    },
    {
      key: 'clientId',
      label: '客户端 ID',
      type: 'input',
      placeholder: '例如：admin-ui',
    },
    {
      key: 'clientName',
      label: '客户端名称',
      type: 'input',
      placeholder: '例如：管理后台',
    },
    {
      key: 'clientSecret',
      label: '客户端密钥',
      type: 'input',
      placeholder: '例如：secret',
    },
    {
      key: 'clientAuthenticationMethods',
      label: '客户端认证方式',
      type: 'input',
      placeholder: '例如：client_secret_basic',
    },
    {
      key: 'authorizationGrantTypes',
      label: '授权方式',
      type: 'input',
      placeholder: '例如：authorization_code,refresh_token',
    },
    {
      key: 'redirectUris',
      label: '回调地址',
      type: 'input',
      placeholder: '例如：http://localhost:5173/callback',
    },
    {
      key: 'postLogoutRedirectUris',
      label: '登出回调地址',
      type: 'input',
      placeholder: '例如：http://localhost:5173/',
    },
    {
      key: 'scopes',
      label: 'Scopes',
      type: 'input',
      placeholder: '例如：openid,profile',
    },
    {
      key: 'authorizationCodeTimeToLive',
      label: '授权码有效期',
      type: 'input',
      placeholder: '例如：PT5M',
    },
    {
      key: 'accessTokenTimeToLive',
      label: '访问令牌有效期',
      type: 'input',
      placeholder: '例如：PT30M',
    },
    {
      key: 'refreshTokenTimeToLive',
      label: '刷新令牌有效期',
      type: 'input',
      placeholder: '例如：PT8H',
    },
    {
      key: 'requireProofKey',
      label: '要求 PKCE',
      type: 'select',
      placeholder: '请选择',
      options: booleanOptions,
    },
    {
      key: 'requireAuthorizationConsent',
      label: '要求授权确认',
      type: 'select',
      placeholder: '请选择',
      options: booleanOptions,
    },
    {
      key: 'reuseRefreshTokens',
      label: '复用刷新令牌',
      type: 'select',
      placeholder: '请选择',
      options: booleanOptions,
    },
    {
      key: 'x509CertificateBoundAccessTokens',
      label: '绑定 x509 访问令牌',
      type: 'select',
      placeholder: '请选择',
      options: booleanOptions,
    },
  ],
  formGridClass: 'grid gap-4 md:grid-cols-2',
  formRules,
  modalWidth: 'min(96vw, 1100px)',
  searchFields: [
    {
      key: 'id',
      label: '主键',
      type: 'input',
      placeholder: '输入主键',
    },
    {
      key: 'clientId',
      label: '客户端 ID',
      type: 'input',
      placeholder: '输入客户端 ID',
    },
    {
      key: 'clientName',
      label: '客户端名称',
      type: 'input',
      placeholder: '输入客户端名称',
    },
  ],
  searchGridClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
  indexColumn: true,
  tableColumns: [
    {
      title: '主键',
      key: 'id',
      width: 220,
      fixed: 'left',
    },
    {
      title: '客户端 ID',
      key: 'clientId',
      width: 200,
    },
    {
      title: '客户端名称',
      key: 'clientName',
      width: 200,
    },
    {
      title: '授权方式',
      key: 'authorizationGrantTypes',
      width: 240,
    },
    {
      title: 'Scopes',
      key: 'scopes',
      width: 200,
    },
    {
      title: 'PKCE',
      key: 'requireProofKey',
      width: 100,
      render: (record) => renderBoolean(record.requireProofKey),
    },
    {
      title: '授权确认',
      key: 'requireAuthorizationConsent',
      width: 100,
      render: (record) => renderBoolean(record.requireAuthorizationConsent),
    },
  ],
  updateSuccessMessage: '注册客户端更新成功',
}

const pageSchema: CrudPageSchema<
  OauthRegisteredClient,
  OauthRegisteredClientQuery,
  OauthRegisteredClientFormModel,
  OauthRegisteredClient
> = {
  loadPage: getOauthRegisteredClientPage,
  mapRecordToFormModel: (record) => ({
    id: record.id ?? '',
    clientId: record.clientId ?? '',
    clientSecret: record.clientSecret ?? '',
    clientName: record.clientName ?? '',
    clientAuthenticationMethods: record.clientAuthenticationMethods ?? '',
    authorizationGrantTypes: record.authorizationGrantTypes ?? '',
    redirectUris: record.redirectUris ?? '',
    postLogoutRedirectUris: record.postLogoutRedirectUris ?? '',
    scopes: record.scopes ?? '',
    authorizationCodeTimeToLive: record.authorizationCodeTimeToLive ?? '',
    accessTokenTimeToLive: record.accessTokenTimeToLive ?? '',
    refreshTokenTimeToLive: record.refreshTokenTimeToLive ?? '',
    requireProofKey: toFlag(record.requireProofKey),
    requireAuthorizationConsent: toFlag(record.requireAuthorizationConsent),
    reuseRefreshTokens: toFlag(record.reuseRefreshTokens),
    x509CertificateBoundAccessTokens: toFlag(record.x509CertificateBoundAccessTokens),
  }),
  createRecord: createOauthRegisteredClient,
  createFormModel: () => ({
    id: '',
    clientId: '',
    clientSecret: '',
    clientName: '',
    clientAuthenticationMethods: '',
    authorizationGrantTypes: '',
    redirectUris: '',
    postLogoutRedirectUris: '',
    scopes: '',
    authorizationCodeTimeToLive: '',
    accessTokenTimeToLive: '',
    refreshTokenTimeToLive: '',
    requireProofKey: null,
    requireAuthorizationConsent: null,
    reuseRefreshTokens: null,
    x509CertificateBoundAccessTokens: null,
  }),
  createPayload: (form) => ({
    ...(form.id.trim() ? { id: form.id.trim() } : {}),
    clientId: form.clientId.trim(),
    clientSecret: form.clientSecret.trim(),
    clientName: form.clientName.trim(),
    clientAuthenticationMethods: form.clientAuthenticationMethods.trim(),
    authorizationGrantTypes: form.authorizationGrantTypes.trim(),
    redirectUris: form.redirectUris.trim(),
    postLogoutRedirectUris: form.postLogoutRedirectUris.trim(),
    scopes: form.scopes.trim(),
    authorizationCodeTimeToLive: form.authorizationCodeTimeToLive.trim(),
    accessTokenTimeToLive: form.accessTokenTimeToLive.trim(),
    refreshTokenTimeToLive: form.refreshTokenTimeToLive.trim(),
    ...(toBoolean(form.requireProofKey) !== undefined
      ? { requireProofKey: toBoolean(form.requireProofKey) }
      : {}),
    ...(toBoolean(form.requireAuthorizationConsent) !== undefined
      ? { requireAuthorizationConsent: toBoolean(form.requireAuthorizationConsent) }
      : {}),
    ...(toBoolean(form.reuseRefreshTokens) !== undefined
      ? { reuseRefreshTokens: toBoolean(form.reuseRefreshTokens) }
      : {}),
    ...(toBoolean(form.x509CertificateBoundAccessTokens) !== undefined
      ? { x509CertificateBoundAccessTokens: toBoolean(form.x509CertificateBoundAccessTokens) }
      : {}),
  }),
  createSearchModel: () => ({
    id: '',
    clientId: '',
    clientName: '',
  }),
  deleteRecord: (record) => {
    if (!record.id || !hasId(record.id)) {
      return Promise.reject(new Error('Missing registered client id'))
    }

    return deleteOauthRegisteredClient(record.id)
  },
  updateRecord: updateOauthRegisteredClient,
}

const config = createCrudConfig({
  interface: interfaceSchema,
  page: pageSchema,
})
</script>

<template>
  <CrudPage :config="config" />
</template>
