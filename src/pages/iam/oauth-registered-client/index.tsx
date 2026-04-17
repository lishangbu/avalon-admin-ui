import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import dayjs from 'dayjs'
import {
  App,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Result,
  Select,
  Space,
  Switch,
  Table,
  Tag,
} from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { PermissionGuard } from '@/components/PermissionGuard'
import { IAM_PERMISSION_CODES } from '@/constants/permissions'
import { usePermission } from '@/hooks/usePermission'
import {
  createOauthRegisteredClient,
  deleteOauthRegisteredClient,
  getOauthRegisteredClientById,
  getOauthRegisteredClientPage,
  updateOauthRegisteredClient,
} from './service'
import type {
  OauthRegisteredClientFormValues,
  OauthRegisteredClientQuery,
  OauthRegisteredClientView,
  SaveOauthRegisteredClientInput,
  UpdateOauthRegisteredClientInput,
} from './types'

type SearchFormValues = {
  clientId?: string
  clientName?: string
}

type DetailItem = {
  label: string
  value: ReactNode
}

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const TOKEN_SEPARATORS = [',']
const SECRET_REQUIRED_METHODS = new Set([
  'client_secret_basic',
  'client_secret_post',
  'client_secret_jwt',
])
const SIGNING_ALGORITHM_REQUIRED_METHODS = new Set([
  'client_secret_jwt',
  'private_key_jwt',
])

const clientAuthenticationMethodOptions = [
  'client_secret_basic',
  'client_secret_post',
  'client_secret_jwt',
  'private_key_jwt',
  'none',
  'tls_client_auth',
  'self_signed_tls_client_auth',
].map((value) => ({ label: value, value }))

const authorizationGrantTypeOptions = [
  'authorization_code',
  'refresh_token',
  'client_credentials',
  'password',
  'sms',
  'email',
  'urn:ietf:params:oauth:grant-type:device_code',
  'urn:ietf:params:oauth:grant-type:token-exchange',
].map((value) => ({ label: value, value }))

const signingAlgorithmOptions = [
  'HS256',
  'HS384',
  'HS512',
  'RS256',
  'RS384',
  'RS512',
  'ES256',
  'ES384',
  'ES512',
  'PS256',
  'PS384',
  'PS512',
  'EdDSA',
].map((value) => ({ label: value, value }))

const accessTokenFormatOptions = [
  { label: 'self-contained', value: 'self-contained' },
  { label: 'reference', value: 'reference' },
]

const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: 16,
}

const formGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 16,
}

const fullSpanStyle: CSSProperties = {
  gridColumn: '1 / -1',
}

const sectionTitleStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
}

function splitCommaSeparatedValues(value?: string | null) {
  return (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

function normalizeStringArray(values: string[]) {
  return Array.from(
    new Set(
      values.map((item) => item.trim()).filter((item) => item.length > 0),
    ),
  )
}

function joinCommaSeparatedValues(values: string[]) {
  const normalized = normalizeStringArray(values)
  return normalized.length > 0 ? normalized.join(',') : null
}

function toOptionalString(value?: string | null) {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

function toDateValue(value?: string | null) {
  if (!value) {
    return null
  }

  const parsed = dayjs(value)
  return parsed.isValid() ? parsed : null
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return '-'
  }

  const parsed = dayjs(value)
  return parsed.isValid() ? parsed.format(DATE_TIME_FORMAT) : value
}

function toSearchQuery(values: SearchFormValues): OauthRegisteredClientQuery {
  return {
    clientId: values.clientId?.trim() || undefined,
    clientName: values.clientName?.trim() || undefined,
  }
}

function toFormValues(
  record?: OauthRegisteredClientView | null,
): OauthRegisteredClientFormValues {
  return {
    id: record?.id ?? '',
    clientId: record?.clientId ?? '',
    clientIdIssuedAt: toDateValue(record?.clientIdIssuedAt),
    clientSecret: record?.clientSecret ?? '',
    clientSecretExpiresAt: toDateValue(record?.clientSecretExpiresAt),
    clientName: record?.clientName ?? '',
    clientAuthenticationMethods: splitCommaSeparatedValues(
      record?.clientAuthenticationMethods,
    ),
    authorizationGrantTypes: splitCommaSeparatedValues(
      record?.authorizationGrantTypes,
    ),
    redirectUris: splitCommaSeparatedValues(record?.redirectUris),
    postLogoutRedirectUris: splitCommaSeparatedValues(
      record?.postLogoutRedirectUris,
    ),
    scopes: splitCommaSeparatedValues(record?.scopes),
    requireProofKey: record?.requireProofKey ?? false,
    requireAuthorizationConsent: record?.requireAuthorizationConsent ?? false,
    jwkSetUrl: record?.jwkSetUrl ?? '',
    tokenEndpointAuthenticationSigningAlgorithm:
      record?.tokenEndpointAuthenticationSigningAlgorithm ?? undefined,
    x509CertificateSubjectDn: record?.x509CertificateSubjectDn ?? '',
    authorizationCodeTimeToLive: record?.authorizationCodeTimeToLive ?? '',
    accessTokenTimeToLive: record?.accessTokenTimeToLive ?? '',
    accessTokenFormat: record?.accessTokenFormat ?? undefined,
    deviceCodeTimeToLive: record?.deviceCodeTimeToLive ?? '',
    reuseRefreshTokens: record?.reuseRefreshTokens ?? true,
    refreshTokenTimeToLive: record?.refreshTokenTimeToLive ?? '',
    idTokenSignatureAlgorithm: record?.idTokenSignatureAlgorithm ?? undefined,
    x509CertificateBoundAccessTokens:
      record?.x509CertificateBoundAccessTokens ?? false,
  }
}

function normalizePayload(
  values: OauthRegisteredClientFormValues,
): SaveOauthRegisteredClientInput | UpdateOauthRegisteredClientInput {
  const payload: SaveOauthRegisteredClientInput = {
    id: values.id.trim() || undefined,
    clientId: values.clientId.trim(),
    clientIdIssuedAt: values.clientIdIssuedAt?.toISOString() ?? null,
    clientSecret: toOptionalString(values.clientSecret),
    clientSecretExpiresAt: values.clientSecretExpiresAt?.toISOString() ?? null,
    clientName: values.clientName.trim(),
    clientAuthenticationMethods: joinCommaSeparatedValues(
      values.clientAuthenticationMethods,
    ),
    authorizationGrantTypes: joinCommaSeparatedValues(
      values.authorizationGrantTypes,
    ),
    redirectUris: joinCommaSeparatedValues(values.redirectUris),
    postLogoutRedirectUris: joinCommaSeparatedValues(
      values.postLogoutRedirectUris,
    ),
    scopes: joinCommaSeparatedValues(values.scopes),
    requireProofKey: values.requireProofKey,
    requireAuthorizationConsent: values.requireAuthorizationConsent,
    jwkSetUrl: toOptionalString(values.jwkSetUrl),
    tokenEndpointAuthenticationSigningAlgorithm:
      values.tokenEndpointAuthenticationSigningAlgorithm || null,
    x509CertificateSubjectDn: toOptionalString(values.x509CertificateSubjectDn),
    authorizationCodeTimeToLive: toOptionalString(
      values.authorizationCodeTimeToLive,
    ),
    accessTokenTimeToLive: toOptionalString(values.accessTokenTimeToLive),
    accessTokenFormat: values.accessTokenFormat || null,
    deviceCodeTimeToLive: toOptionalString(values.deviceCodeTimeToLive),
    reuseRefreshTokens: values.reuseRefreshTokens,
    refreshTokenTimeToLive: toOptionalString(values.refreshTokenTimeToLive),
    idTokenSignatureAlgorithm: values.idTokenSignatureAlgorithm || null,
    x509CertificateBoundAccessTokens: values.x509CertificateBoundAccessTokens,
  }

  if (payload.id) {
    return payload as UpdateOauthRegisteredClientInput
  }

  return payload
}

function renderBooleanTag(value?: boolean | null) {
  if (value == null) {
    return '-'
  }

  return value ? <Tag color="green">是</Tag> : <Tag>否</Tag>
}

function renderTagList(rawValue?: string | null, limit = 3, color?: string) {
  const values = splitCommaSeparatedValues(rawValue)

  if (values.length === 0) {
    return '-'
  }

  return (
    <Space size={4} wrap>
      {values.slice(0, limit).map((value) => (
        <Tag color={color} key={value}>
          {value}
        </Tag>
      ))}
      {values.length > limit ? (
        <Tag color={color}>+{values.length - limit}</Tag>
      ) : null}
    </Space>
  )
}

function renderFullTagList(rawValue?: string | null, color?: string) {
  const values = splitCommaSeparatedValues(rawValue)

  if (values.length === 0) {
    return '-'
  }

  return (
    <Space size={4} wrap>
      {values.map((value) => (
        <Tag color={color} key={value}>
          {value}
        </Tag>
      ))}
    </Space>
  )
}

function renderTextValue(value?: string | null, monospace = false) {
  const text = value?.trim()

  if (!text) {
    return '-'
  }

  return (
    <span
      style={
        monospace
          ? {
              fontFamily:
                'SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace',
            }
          : undefined
      }
    >
      {text}
    </span>
  )
}

function DetailSection({
  title,
  items,
}: {
  title: string
  items: DetailItem[]
}) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 12,
        padding: 16,
        borderRadius: 12,
        background: 'rgba(148, 163, 184, 0.08)',
      }}
    >
      <div style={sectionTitleStyle}>{title}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}
      >
        {items.map((item) => (
          <div key={item.label}>
            <div
              style={{
                marginBottom: 6,
                color: 'var(--ant-colorTextDescription)',
                fontSize: 12,
              }}
            >
              {item.label}
            </div>
            <div style={{ wordBreak: 'break-word' }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function OauthRegisteredClientPage() {
  const { message } = App.useApp()
  const { has } = usePermission()
  const [searchForm] = Form.useForm<SearchFormValues>()
  const [form] = Form.useForm<OauthRegisteredClientFormValues>()
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [query, setQuery] = useState<OauthRegisteredClientQuery>({})
  const watchedClientAuthenticationMethods =
    Form.useWatch('clientAuthenticationMethods', form) ?? []
  const watchedAuthorizationGrantTypes =
    Form.useWatch('authorizationGrantTypes', form) ?? []

  const canQuery = has(IAM_PERMISSION_CODES.oauthClient.query)
  const canUpdate = has(IAM_PERMISSION_CODES.oauthClient.update)
  const canDelete = has(IAM_PERMISSION_CODES.oauthClient.delete)
  const requiresClientSecret = watchedClientAuthenticationMethods.some(
    (method) => SECRET_REQUIRED_METHODS.has(method),
  )
  const requiresSigningAlgorithm = watchedClientAuthenticationMethods.some(
    (method) => SIGNING_ALGORITHM_REQUIRED_METHODS.has(method),
  )
  const requiresRedirectUri =
    watchedAuthorizationGrantTypes.includes('authorization_code')
  const rowsQuery = useQuery({
    queryKey: [
      'system',
      'oauth-registered-client',
      'page',
      page,
      pageSize,
      query,
    ],
    queryFn: () =>
      getOauthRegisteredClientPage({
        page,
        size: pageSize,
        sort: 'clientId,asc',
        query,
      }),
    enabled: canQuery,
    placeholderData: keepPreviousData,
  })
  const loading = canQuery ? rowsQuery.isFetching : false
  const rows = rowsQuery.data?.items ?? []
  const total = rowsQuery.data?.totalItems ?? 0

  async function loadRows(
    nextPage = page,
    nextPageSize = pageSize,
    nextQuery: OauthRegisteredClientQuery = query,
  ) {
    const isSameQuery =
      nextPage === page &&
      nextPageSize === pageSize &&
      JSON.stringify(nextQuery) === JSON.stringify(query)

    if (!isSameQuery) {
      await queryClient.ensureQueryData({
        queryKey: [
          'system',
          'oauth-registered-client',
          'page',
          nextPage,
          nextPageSize,
          nextQuery,
        ],
        queryFn: () =>
          getOauthRegisteredClientPage({
            page: nextPage,
            size: nextPageSize,
            sort: 'clientId,asc',
            query: nextQuery,
          }),
      })
      setPage(nextPage)
      setPageSize(nextPageSize)
      setQuery(nextQuery)
      return
    }

    await rowsQuery.refetch()
  }

  function openCreate() {
    setEditingId(null)
    form.resetFields()
    form.setFieldsValue(toFormValues())
    setModalOpen(true)
  }

  async function openEdit(record: OauthRegisteredClientView) {
    if (!record.id) {
      return
    }

    setDetailLoading(true)
    setEditingId(record.id)
    try {
      const result = await getOauthRegisteredClientById(record.id)
      form.resetFields()
      form.setFieldsValue(toFormValues(result))
      setModalOpen(true)
    } finally {
      setDetailLoading(false)
    }
  }

  async function handleDelete(record: OauthRegisteredClientView) {
    if (!record.id) {
      return
    }

    await deleteOauthRegisteredClient(record.id)
    message.success('OAuth2 客户端删除成功')
    const nextPage = rows.length === 1 && page > 1 ? page - 1 : page
    await loadRows(nextPage, pageSize)
  }

  async function handleSubmit() {
    const values = await form.validateFields()
    setSaving(true)
    try {
      const payload = normalizePayload(values)
      if (values.id) {
        await updateOauthRegisteredClient(
          payload as UpdateOauthRegisteredClientInput,
        )
        message.success('OAuth2 客户端更新成功')
      } else {
        await createOauthRegisteredClient(
          payload as SaveOauthRegisteredClientInput,
        )
        message.success('OAuth2 客户端创建成功')
      }
      setModalOpen(false)
      setEditingId(null)
      form.resetFields()
      await loadRows(page, pageSize)
    } finally {
      setSaving(false)
    }
  }

  function handleTableChange(pagination: TablePaginationConfig) {
    const nextPage = pagination.current ?? 1
    const nextPageSize = pagination.pageSize ?? 10
    void loadRows(nextPage, nextPageSize)
  }

  const columns: ColumnsType<OauthRegisteredClientView> = [
    {
      title: '客户端 ID',
      dataIndex: 'clientId',
      key: 'clientId',
      width: 220,
      fixed: 'left',
      render: (value?: string | null) => renderTextValue(value, true),
    },
    {
      title: '客户端名称',
      dataIndex: 'clientName',
      key: 'clientName',
      width: 220,
      render: (value?: string | null) => renderTextValue(value),
    },
    {
      title: '认证方式',
      dataIndex: 'clientAuthenticationMethods',
      key: 'clientAuthenticationMethods',
      width: 220,
      render: (value?: string | null) => renderTagList(value, 2),
    },
    {
      title: '授权方式',
      dataIndex: 'authorizationGrantTypes',
      key: 'authorizationGrantTypes',
      width: 260,
      render: (value?: string | null) => renderTagList(value, 2, 'blue'),
    },
    {
      title: 'Scopes',
      dataIndex: 'scopes',
      key: 'scopes',
      width: 220,
      render: (value?: string | null) => renderTagList(value, 3, 'gold'),
    },
    {
      title: 'PKCE',
      dataIndex: 'requireProofKey',
      key: 'requireProofKey',
      width: 90,
      render: (value?: boolean | null) => renderBooleanTag(value),
    },
    {
      title: '授权确认',
      dataIndex: 'requireAuthorizationConsent',
      key: 'requireAuthorizationConsent',
      width: 110,
      render: (value?: boolean | null) => renderBooleanTag(value),
    },
    {
      title: '签发时间',
      dataIndex: 'clientIdIssuedAt',
      key: 'clientIdIssuedAt',
      width: 180,
      render: (value?: string | null) => formatDateTime(value),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          {canUpdate ? (
            <Button
              size="small"
              icon={<EditOutlined />}
              loading={detailLoading && editingId === record.id}
              onClick={() => void openEdit(record)}
            >
              编辑
            </Button>
          ) : null}
          {canDelete ? (
            <Popconfirm
              title="确定删除当前 OAuth2 客户端吗？"
              onConfirm={() => void handleDelete(record)}
            >
              <Button size="small" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          ) : null}
        </Space>
      ),
    },
  ]

  if (!canQuery) {
    return (
      <PageContainer title="OAuth2 客户端管理">
        <Result
          status="403"
          title="无权查看"
          subTitle="当前账号没有 iam:oauth-client:query 权限，无法查看 OAuth2 客户端数据。"
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="OAuth2 客户端管理"
      subTitle="对接后端注册客户端接口，支持按客户端 ID/名称搜索、分页查看、新增、编辑和删除。"
      extra={[
        <PermissionGuard
          key="add"
          permission={IAM_PERMISSION_CODES.oauthClient.create}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => void openCreate()}
          >
            新增客户端
          </Button>
        </PermissionGuard>,
        <Button
          key="reload"
          icon={<ReloadOutlined />}
          loading={loading}
          onClick={() => void loadRows(page, pageSize)}
        >
          刷新
        </Button>,
      ]}
    >
      <div
        style={{
          marginBottom: 16,
          padding: 16,
          border: '1px solid var(--tabs-shell-border)',
          borderRadius: 12,
          background: 'var(--tabs-shell-bg)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Form
          form={searchForm}
          layout="inline"
          onFinish={(values) =>
            void loadRows(1, pageSize, toSearchQuery(values))
          }
        >
          <Form.Item name="clientId" label="客户端 ID">
            <Input allowClear placeholder="输入客户端 ID" />
          </Form.Item>
          <Form.Item name="clientName" label="客户端名称">
            <Input allowClear placeholder="输入客户端名称" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                onClick={() => {
                  searchForm.resetFields()
                  void loadRows(1, pageSize, {})
                }}
              >
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      <Table<OauthRegisteredClientView>
        rowKey={(record) => record.id ?? record.clientId ?? 'oauth-client-row'}
        loading={loading}
        columns={columns}
        dataSource={rows}
        onChange={handleTableChange}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (count) => `共 ${count} 条`,
        }}
        scroll={{ x: 1500 }}
        expandable={{
          expandedRowRender: (record) => (
            <div style={sectionStyle}>
              <DetailSection
                title="基础信息"
                items={[
                  { label: '主键 ID', value: renderTextValue(record.id, true) },
                  {
                    label: '客户端 ID',
                    value: renderTextValue(record.clientId, true),
                  },
                  {
                    label: '客户端名称',
                    value: renderTextValue(record.clientName),
                  },
                  {
                    label: '客户端密钥',
                    value: renderTextValue(record.clientSecret, true),
                  },
                  {
                    label: '签发时间',
                    value: formatDateTime(record.clientIdIssuedAt),
                  },
                  {
                    label: '密钥过期时间',
                    value: formatDateTime(record.clientSecretExpiresAt),
                  },
                ]}
              />
              <DetailSection
                title="协议配置"
                items={[
                  {
                    label: '认证方式',
                    value: renderFullTagList(
                      record.clientAuthenticationMethods,
                    ),
                  },
                  {
                    label: '授权方式',
                    value: renderFullTagList(
                      record.authorizationGrantTypes,
                      'blue',
                    ),
                  },
                  {
                    label: 'Scopes',
                    value: renderFullTagList(record.scopes, 'gold'),
                  },
                  {
                    label: '回调地址',
                    value: renderFullTagList(record.redirectUris),
                  },
                  {
                    label: '登出回调地址',
                    value: renderFullTagList(record.postLogoutRedirectUris),
                  },
                  {
                    label: 'JWK Set URL',
                    value: renderTextValue(record.jwkSetUrl),
                  },
                ]}
              />
              <DetailSection
                title="安全与令牌设置"
                items={[
                  {
                    label: '要求 PKCE',
                    value: renderBooleanTag(record.requireProofKey),
                  },
                  {
                    label: '要求授权确认',
                    value: renderBooleanTag(record.requireAuthorizationConsent),
                  },
                  {
                    label: '复用刷新令牌',
                    value: renderBooleanTag(record.reuseRefreshTokens),
                  },
                  {
                    label: '绑定 x509 访问令牌',
                    value: renderBooleanTag(
                      record.x509CertificateBoundAccessTokens,
                    ),
                  },
                  {
                    label: '端点认证签名算法',
                    value: renderTextValue(
                      record.tokenEndpointAuthenticationSigningAlgorithm,
                      true,
                    ),
                  },
                  {
                    label: 'ID Token 签名算法',
                    value: renderTextValue(
                      record.idTokenSignatureAlgorithm,
                      true,
                    ),
                  },
                  {
                    label: '访问令牌格式',
                    value: renderTextValue(record.accessTokenFormat, true),
                  },
                  {
                    label: 'X509 Subject DN',
                    value: renderTextValue(record.x509CertificateSubjectDn),
                  },
                  {
                    label: '授权码有效期',
                    value: renderTextValue(
                      record.authorizationCodeTimeToLive,
                      true,
                    ),
                  },
                  {
                    label: '访问令牌有效期',
                    value: renderTextValue(record.accessTokenTimeToLive, true),
                  },
                  {
                    label: '设备码有效期',
                    value: renderTextValue(record.deviceCodeTimeToLive, true),
                  },
                  {
                    label: '刷新令牌有效期',
                    value: renderTextValue(record.refreshTokenTimeToLive, true),
                  },
                ]}
              />
            </div>
          ),
        }}
      />

      <Modal
        destroyOnHidden
        title={editingId ? '编辑 OAuth2 客户端' : '新增 OAuth2 客户端'}
        open={modalOpen}
        width={1100}
        confirmLoading={saving}
        styles={{
          body: {
            maxHeight: '72vh',
            overflowY: 'auto',
            paddingTop: 8,
          },
        }}
        onCancel={() => {
          setEditingId(null)
          setModalOpen(false)
          form.resetFields()
        }}
        onOk={() => void handleSubmit()}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={toFormValues()}
          scrollToFirstError
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>基础信息</div>
            <div style={formGridStyle}>
              <div>
                <Form.Item
                  name="clientId"
                  label="客户端 ID"
                  rules={[{ required: true, message: '请输入客户端 ID' }]}
                >
                  <Input allowClear placeholder="例如：admin-ui" />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="clientName"
                  label="客户端名称"
                  rules={[{ required: true, message: '请输入客户端名称' }]}
                >
                  <Input allowClear placeholder="例如：管理后台" />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="clientSecret"
                  label="客户端密钥"
                  extra={
                    requiresClientSecret
                      ? '如果选择了 client_secret_* 认证方式，这里必须填写。'
                      : '当前认证方式不要求客户端密钥，可留空。'
                  }
                  dependencies={['clientAuthenticationMethods']}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value: string | undefined) {
                        const methods = (getFieldValue(
                          'clientAuthenticationMethods',
                        ) ?? []) as string[]
                        const requiresSecret = methods.some((method) =>
                          SECRET_REQUIRED_METHODS.has(method),
                        )
                        if (
                          !requiresSecret ||
                          (value?.trim()?.length ?? 0) > 0
                        ) {
                          return Promise.resolve()
                        }
                        return Promise.reject(
                          new Error('所选认证方式需要客户端密钥'),
                        )
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    allowClear
                    autoComplete="new-password"
                    disabled={!requiresClientSecret}
                    placeholder="例如：secret"
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="clientIdIssuedAt"
                  label="客户端签发时间"
                  extra="留空时，后端创建接口会自动填充当前时间。"
                >
                  <DatePicker
                    allowClear
                    showTime
                    format={DATE_TIME_FORMAT}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item name="clientSecretExpiresAt" label="密钥过期时间">
                  <DatePicker
                    allowClear
                    showTime
                    format={DATE_TIME_FORMAT}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="clientAuthenticationMethods"
                  label="客户端认证方式"
                  rules={[
                    {
                      required: true,
                      type: 'array',
                      min: 1,
                      message: '请选择至少一种客户端认证方式',
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    mode="multiple"
                    maxTagCount="responsive"
                    options={clientAuthenticationMethodOptions}
                    placeholder="选择认证方式"
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="authorizationGrantTypes"
                  label="授权方式"
                  rules={[
                    {
                      required: true,
                      type: 'array',
                      min: 1,
                      message: '请选择至少一种授权方式',
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    mode="multiple"
                    maxTagCount="responsive"
                    options={authorizationGrantTypeOptions}
                    placeholder="选择授权方式"
                  />
                </Form.Item>
              </div>
              <div style={fullSpanStyle}>
                <Form.Item
                  name="redirectUris"
                  label="回调地址"
                  extra={
                    requiresRedirectUri
                      ? '多个地址可输入后按回车，或使用逗号分隔。授权码模式下至少需要一个回调地址。'
                      : '多个地址可输入后按回车，或使用逗号分隔。当前授权方式不强制要求回调地址。'
                  }
                  dependencies={['authorizationGrantTypes']}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value: string[] | undefined) {
                        const grantTypes = (getFieldValue(
                          'authorizationGrantTypes',
                        ) ?? []) as string[]
                        const requiresRedirectUri =
                          grantTypes.includes('authorization_code')
                        if (!requiresRedirectUri || (value?.length ?? 0) > 0) {
                          return Promise.resolve()
                        }
                        return Promise.reject(
                          new Error('授权码模式至少需要一个回调地址'),
                        )
                      },
                    }),
                  ]}
                >
                  <Select
                    allowClear
                    mode="tags"
                    maxTagCount="responsive"
                    notFoundContent={null}
                    placeholder="输入 URI 后按回车"
                    tokenSeparators={TOKEN_SEPARATORS}
                  />
                </Form.Item>
              </div>
              <div style={fullSpanStyle}>
                <Form.Item
                  name="postLogoutRedirectUris"
                  label="登出回调地址"
                  extra="多个地址可输入后按回车，或使用逗号分隔。"
                >
                  <Select
                    allowClear
                    mode="tags"
                    maxTagCount="responsive"
                    notFoundContent={null}
                    placeholder="输入登出回调 URI 后按回车"
                    tokenSeparators={TOKEN_SEPARATORS}
                  />
                </Form.Item>
              </div>
              <div style={fullSpanStyle}>
                <Form.Item
                  name="scopes"
                  label="Scopes"
                  extra="多个 scope 可输入后按回车，或使用逗号分隔。"
                >
                  <Select
                    allowClear
                    mode="tags"
                    maxTagCount="responsive"
                    notFoundContent={null}
                    placeholder="例如：openid、profile、read"
                    tokenSeparators={TOKEN_SEPARATORS}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div style={{ ...sectionStyle, marginTop: 24 }}>
            <div style={sectionTitleStyle}>高级配置</div>
            <div style={formGridStyle}>
              <div>
                <Form.Item
                  name="tokenEndpointAuthenticationSigningAlgorithm"
                  label="端点认证签名算法"
                  extra={
                    requiresSigningAlgorithm
                      ? '使用 client_secret_jwt 或 private_key_jwt 时建议明确配置。'
                      : '仅在 client_secret_jwt 或 private_key_jwt 认证方式下需要关注。'
                  }
                  dependencies={['clientAuthenticationMethods']}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value: string | undefined) {
                        const methods = (getFieldValue(
                          'clientAuthenticationMethods',
                        ) ?? []) as string[]
                        const requiresSigningAlgorithm = methods.some(
                          (method) =>
                            SIGNING_ALGORITHM_REQUIRED_METHODS.has(method),
                        )
                        if (!requiresSigningAlgorithm || value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(
                          new Error('所选认证方式需要签名算法'),
                        )
                      },
                    }),
                  ]}
                >
                  <Select
                    allowClear
                    disabled={!requiresSigningAlgorithm}
                    showSearch
                    options={signingAlgorithmOptions}
                    placeholder="例如：HS256 / RS256"
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="idTokenSignatureAlgorithm"
                  label="ID Token 签名算法"
                >
                  <Select
                    allowClear
                    showSearch
                    options={signingAlgorithmOptions}
                    placeholder="例如：RS256"
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item name="accessTokenFormat" label="访问令牌格式">
                  <Select
                    allowClear
                    options={accessTokenFormatOptions}
                    placeholder="选择访问令牌格式"
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item name="jwkSetUrl" label="JWK Set URL">
                  <Input
                    allowClear
                    placeholder="例如：https://example.com/.well-known/jwks.json"
                  />
                </Form.Item>
              </div>
              <div style={fullSpanStyle}>
                <Form.Item
                  name="x509CertificateSubjectDn"
                  label="X509 Subject DN"
                >
                  <Input allowClear placeholder="例如：CN=client" />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="authorizationCodeTimeToLive"
                  label="授权码有效期"
                  extra="使用 ISO-8601 Duration，例如 PT5M。"
                >
                  <Input allowClear placeholder="PT5M" />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="accessTokenTimeToLive"
                  label="访问令牌有效期"
                  extra="使用 ISO-8601 Duration，例如 PT30M。"
                >
                  <Input allowClear placeholder="PT30M" />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="deviceCodeTimeToLive"
                  label="设备码有效期"
                  extra="使用 ISO-8601 Duration，例如 PT3M。"
                >
                  <Input allowClear placeholder="PT3M" />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="refreshTokenTimeToLive"
                  label="刷新令牌有效期"
                  extra="使用 ISO-8601 Duration，例如 PT8H。"
                >
                  <Input allowClear placeholder="PT8H" />
                </Form.Item>
              </div>
            </div>
          </div>

          <div style={{ ...sectionStyle, marginTop: 24 }}>
            <div style={sectionTitleStyle}>开关项</div>
            <div style={formGridStyle}>
              <div>
                <Form.Item
                  name="requireProofKey"
                  label="要求 PKCE"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="是" unCheckedChildren="否" />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="requireAuthorizationConsent"
                  label="要求授权确认"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="是" unCheckedChildren="否" />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="reuseRefreshTokens"
                  label="复用刷新令牌"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="是" unCheckedChildren="否" />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="x509CertificateBoundAccessTokens"
                  label="绑定 x509 访问令牌"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="是" unCheckedChildren="否" />
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    </PageContainer>
  )
}
