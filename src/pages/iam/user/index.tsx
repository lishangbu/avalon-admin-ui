import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import {
  App,
  Button,
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
import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { PermissionGuard } from '@/components/PermissionGuard'
import { IAM_PERMISSION_CODES } from '@/constants/permissions'
import { usePermission } from '@/hooks/usePermission'
import { lookupRoles } from '@/pages/iam/role/service'
import type { RoleView } from '@/pages/iam/role/types'
import { collectRelationIds } from '@/pages/iam/shared/tree-options'
import {
  createUser,
  deleteUser,
  getUserById,
  getUserPage,
  updateUser,
} from './service'
import type {
  SaveUserInput,
  UpdateUserInput,
  UserFormValues,
  UserQuery,
  UserView,
} from './types'

type UserSearchValues = {
  username?: string
  phone?: string
  email?: string
  enabled?: boolean
}

type RoleOption = {
  label: string
  value: string
  disabled?: boolean
}

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

function toSearchQuery(values: UserSearchValues): UserQuery {
  return {
    username: values.username?.trim() || undefined,
    phone: values.phone?.trim() || undefined,
    email: values.email?.trim() || undefined,
    enabled: values.enabled,
  }
}

function toOptionalString(value?: string | null) {
  const normalized = value?.trim()
  return normalized ? normalized : undefined
}

function toFormValues(user?: UserView | null): UserFormValues {
  return {
    id: user?.id ?? '',
    username: user?.username ?? '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    avatar: user?.avatar ?? '',
    enabled: user?.enabled !== false,
    passwordHash: '',
    roleIds: user?.roleIds ?? collectRelationIds(user?.roles),
  }
}

function normalizePayload(
  values: UserFormValues,
): SaveUserInput | UpdateUserInput {
  const payload: SaveUserInput = {
    username: values.username.trim(),
    phone: toOptionalString(values.phone),
    email: toOptionalString(values.email),
    avatar: toOptionalString(values.avatar),
    enabled: values.enabled,
    passwordHash: toOptionalString(values.passwordHash),
    roleIds: values.roleIds,
  }

  if (values.id) {
    return {
      id: values.id,
      ...payload,
    }
  }

  return payload
}

function getRoleDisplayName(role?: RoleView | null) {
  if (!role) {
    return '未命名角色'
  }

  return (
    role.name || role.code || (role.id != null ? `#${role.id}` : '未命名角色')
  )
}

function buildRoleOptions(roles: RoleView[]) {
  const options: RoleOption[] = []

  roles.forEach((role) => {
    const value = role.id
    if (!value) {
      return
    }

    const label = getRoleDisplayName(role)
    options.push({
      label: role.enabled === false ? `${label}（已禁用）` : label,
      value,
      disabled: role.enabled === false,
    })
  })

  return options
}

function renderEnabledTag(value?: boolean | null) {
  return value === false ? (
    <Tag color="red">禁用</Tag>
  ) : (
    <Tag color="green">启用</Tag>
  )
}

function renderRoleTags(
  roleIds: string[] | undefined,
  roleById: Map<string, RoleView>,
) {
  const names = (roleIds ?? []).map((id) =>
    getRoleDisplayName(roleById.get(id) ?? { id }),
  )

  if (names.length === 0) {
    return '-'
  }

  return (
    <Space size={4} wrap>
      {names.slice(0, 3).map((name) => (
        <Tag color="blue" key={name}>
          {name}
        </Tag>
      ))}
      {names.length > 3 ? <Tag color="blue">+{names.length - 3}</Tag> : null}
    </Space>
  )
}

function renderAvatarValue(value?: string | null) {
  const text = value?.trim()

  if (!text) {
    return '-'
  }

  return (
    <a href={text} target="_blank" rel="noreferrer">
      {text}
    </a>
  )
}

export default function UserManagementPage() {
  const { message } = App.useApp()
  const { has } = usePermission()
  const [searchForm] = Form.useForm<UserSearchValues>()
  const [form] = Form.useForm<UserFormValues>()
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [query, setQuery] = useState<UserQuery>({})

  const canQuery = has(IAM_PERMISSION_CODES.user.query)
  const canUpdate = has(IAM_PERMISSION_CODES.user.update)
  const canDelete = has(IAM_PERMISSION_CODES.user.delete)
  const roleOptionsQuery = useQuery({
    queryKey: ['iam', 'role', 'lookup'],
    queryFn: () => lookupRoles({}),
    enabled: canQuery,
  })
  const rowsQuery = useQuery({
    queryKey: ['iam', 'user', 'page', page, pageSize, query],
    queryFn: () =>
      getUserPage({
        page,
        size: pageSize,
        sort: 'id,asc',
        query,
      }),
    enabled: canQuery,
    placeholderData: keepPreviousData,
  })
  const loading = canQuery ? rowsQuery.isFetching : false
  const optionLoading = canQuery ? roleOptionsQuery.isFetching : false
  const rows = rowsQuery.data?.items ?? []
  const total = rowsQuery.data?.totalItems ?? 0
  const roleRows = useMemo(
    () => roleOptionsQuery.data ?? [],
    [roleOptionsQuery.data],
  )
  const roleOptions = buildRoleOptions(roleRows)
  const roleById = useMemo(() => {
    return new Map(
      roleRows.flatMap((role) => (role.id ? [[role.id, role] as const] : [])),
    )
  }, [roleRows])

  async function loadRows(
    nextPage = page,
    nextPageSize = pageSize,
    nextQuery: UserQuery = query,
  ) {
    const isSameQuery =
      nextPage === page &&
      nextPageSize === pageSize &&
      JSON.stringify(nextQuery) === JSON.stringify(query)

    if (!isSameQuery) {
      await queryClient.ensureQueryData({
        queryKey: ['iam', 'user', 'page', nextPage, nextPageSize, nextQuery],
        queryFn: () =>
          getUserPage({
            page: nextPage,
            size: nextPageSize,
            sort: 'id,asc',
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

  async function openEdit(record: UserView) {
    const id = record.id
    if (!id) {
      return
    }

    setDetailLoading(true)
    setEditingId(id)
    try {
      const result = await getUserById(id)
      form.resetFields()
      form.setFieldsValue(toFormValues(result))
      setModalOpen(true)
    } finally {
      setDetailLoading(false)
    }
  }

  async function handleDelete(record: UserView) {
    const id = record.id
    if (!id) {
      return
    }

    await deleteUser(id)
    message.success('用户删除成功')
    const nextPage = rows.length === 1 && page > 1 ? page - 1 : page
    await loadRows(nextPage, pageSize)
  }

  async function handleSubmit() {
    const values = await form.validateFields()
    setSaving(true)
    try {
      const payload = normalizePayload(values)
      if (values.id) {
        await updateUser(payload as UpdateUserInput)
        message.success('用户更新成功')
      } else {
        await createUser(payload as SaveUserInput)
        message.success('用户创建成功')
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

  const columns: ColumnsType<UserView> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 180,
      fixed: 'left',
      render: (value?: string | null) => value || '-',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 160,
      render: (value?: string | null) => value || '-',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 240,
      render: (value?: string | null) => value || '-',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (value?: boolean | null) => renderEnabledTag(value),
    },
    {
      title: '角色',
      dataIndex: 'roleIds',
      key: 'roles',
      width: 260,
      render: (value?: string[]) => renderRoleTags(value, roleById),
    },
    {
      title: '头像地址',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 280,
      render: (value?: string | null) => renderAvatarValue(value),
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
              title="确认删除该用户吗？"
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
      <PageContainer title="用户管理">
        <Result
          status="403"
          title="无权查看"
          subTitle="当前账号没有 iam:user:query 权限，无法查看用户数据。"
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="用户管理"
      subTitle="对接后端用户接口，支持按用户名、手机号、邮箱和启用状态检索，并维护用户角色。"
      extra={[
        <PermissionGuard
          key="add"
          permission={IAM_PERMISSION_CODES.user.create}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => void openCreate()}
          >
            新增用户
          </Button>
        </PermissionGuard>,
        <Button
          key="reload"
          icon={<ReloadOutlined />}
          loading={loading || optionLoading}
          onClick={() =>
            void Promise.all([roleOptionsQuery.refetch(), rowsQuery.refetch()])
          }
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
          <Form.Item name="username" label="用户名">
            <Input allowClear placeholder="输入用户名" />
          </Form.Item>
          <Form.Item name="phone" label="手机号">
            <Input allowClear placeholder="输入手机号" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input allowClear placeholder="输入邮箱" />
          </Form.Item>
          <Form.Item name="enabled" label="状态">
            <Select
              allowClear
              options={[
                { label: '启用', value: true },
                { label: '禁用', value: false },
              ]}
              placeholder="全部状态"
              style={{ width: 140 }}
            />
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

      <Table<UserView>
        rowKey={(record) => record.id || record.username || 'iam-user-row'}
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
        scroll={{ x: 1400 }}
      />

      <Modal
        destroyOnHidden
        title={editingId ? '编辑用户' : '新增用户'}
        open={modalOpen}
        width={920}
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
                  name="username"
                  label="用户名"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input allowClear placeholder="例如：admin" />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="enabled"
                  label="启用状态"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                </Form.Item>
              </div>
              <div>
                <Form.Item name="phone" label="手机号">
                  <Input allowClear placeholder="例如：13800000000" />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
                >
                  <Input allowClear placeholder="例如：admin@example.com" />
                </Form.Item>
              </div>
              <div style={fullSpanStyle}>
                <Form.Item name="avatar" label="头像地址">
                  <Input
                    allowClear
                    placeholder="例如：https://example.com/avatar.png"
                  />
                </Form.Item>
              </div>
              <div style={fullSpanStyle}>
                <Form.Item
                  name="roleIds"
                  label="角色"
                  extra="禁用角色会显示为不可选，避免继续分配。"
                >
                  <Select
                    allowClear
                    mode="multiple"
                    showSearch={{ optionFilterProp: 'label' }}
                    maxTagCount="responsive"
                    loading={optionLoading}
                    options={roleOptions}
                    placeholder="选择角色"
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div style={{ ...sectionStyle, marginTop: 24 }}>
            <div style={sectionTitleStyle}>安全设置</div>
            <div style={formGridStyle}>
              <div style={fullSpanStyle}>
                <Form.Item
                  name="passwordHash"
                  label="密码散列"
                  extra={
                    form.getFieldValue('id')
                      ? '留空表示不修改当前密码散列。'
                      : '新增用户时必须填写密码散列。'
                  }
                  dependencies={['id']}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value: string | undefined) {
                        const isEdit = Boolean(getFieldValue('id'))
                        if (isEdit || (value?.trim()?.length ?? 0) > 0) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('请输入密码散列'))
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    allowClear
                    autoComplete="new-password"
                    placeholder={
                      form.getFieldValue('id')
                        ? '留空则不修改'
                        : '请输入 Bcrypt 散列'
                    }
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    </PageContainer>
  )
}
