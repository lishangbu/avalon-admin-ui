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
  Card,
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
  TreeSelect,
  Typography,
} from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useState } from 'react'
import { PermissionGuard } from '@/components/PermissionGuard'
import { SYSTEM_PERMISSION_CODES } from '@/constants/permissions'
import { usePermission } from '@/hooks/usePermission'
import { listMenuTree } from '@/pages/system/menu/service'
import { listPermissions } from '@/pages/system/permission/service'
import type { PermissionView } from '@/pages/system/permission/types'
import {
  buildMenuTreeSelectData,
  buildPermissionTreeData,
  collectRelationIds,
  getMenuDisplayName,
  getPermissionDisplayName,
  type TreeSelectOption,
} from '@/pages/system/shared/tree-options'
import type { MenuView } from '@/types/menu'
import {
  createRole,
  deleteRole,
  getRoleById,
  getRolePage,
  updateRole,
} from './service'
import type {
  RoleQuery,
  RoleView,
  SaveRoleInput,
  UpdateRoleInput,
} from './types'

type RoleSearchValues = {
  code?: string
  name?: string
  enabled?: boolean
}

type RoleFormValues = {
  id?: string
  code: string
  name: string
  enabled: boolean
  menuIds: string[]
  permissionIds: string[]
}

function toSearchQuery(values: RoleSearchValues): RoleQuery {
  return {
    code: values.code?.trim() || undefined,
    name: values.name?.trim() || undefined,
    enabled: values.enabled,
  }
}

function toFormValues(role?: RoleView | null): RoleFormValues {
  return {
    id: role?.id ?? undefined,
    code: role?.code ?? '',
    name: role?.name ?? '',
    enabled: role?.enabled !== false,
    menuIds: collectRelationIds(role?.menus),
    permissionIds: collectRelationIds(role?.permissions),
  }
}

function normalizePayload(
  values: RoleFormValues,
): SaveRoleInput | UpdateRoleInput {
  return {
    id: values.id || undefined,
    code: values.code.trim(),
    name: values.name.trim(),
    enabled: values.enabled,
    menuIds: values.menuIds,
    permissionIds: values.permissionIds,
  }
}

function matchTreeTitle(input: string, node: { title?: unknown }) {
  return String(node.title ?? '')
    .toLowerCase()
    .includes(input.trim().toLowerCase())
}

function renderMenuTags(menus?: MenuView[] | null) {
  const names = (menus ?? []).map((menu) => getMenuDisplayName(menu))

  if (names.length === 0) {
    return '-'
  }

  return (
    <Space size={4} wrap>
      {names.slice(0, 3).map((name) => (
        <Tag key={name}>{name}</Tag>
      ))}
      {names.length > 3 ? <Tag>+{names.length - 3}</Tag> : null}
    </Space>
  )
}

function renderPermissionTags(permissions?: PermissionView[] | null) {
  const names = (permissions ?? []).map((permission) =>
    getPermissionDisplayName(permission),
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

export default function RoleManagementPage() {
  const { message } = App.useApp()
  const { has } = usePermission()
  const [searchForm] = Form.useForm<RoleSearchValues>()
  const [form] = Form.useForm<RoleFormValues>()
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [query, setQuery] = useState<RoleQuery>({})
  const canQuery = has(SYSTEM_PERMISSION_CODES.role.query)
  const canUpdate = has(SYSTEM_PERMISSION_CODES.role.update)
  const canDelete = has(SYSTEM_PERMISSION_CODES.role.delete)
  const menuTreeQuery = useQuery({
    queryKey: ['system', 'menu', 'tree'],
    queryFn: () => listMenuTree(),
    enabled: canQuery,
  })
  const permissionListQuery = useQuery({
    queryKey: ['system', 'permission', 'list', {}],
    queryFn: () => listPermissions({}),
    enabled: canQuery,
  })
  const rowsQuery = useQuery({
    queryKey: ['system', 'role', 'page', page, pageSize, query],
    queryFn: () =>
      getRolePage({
        page,
        size: pageSize,
        sort: 'id,asc',
        query,
      }),
    enabled: canQuery,
    placeholderData: keepPreviousData,
  })
  const loading = canQuery ? rowsQuery.isFetching : false
  const optionLoading = canQuery
    ? menuTreeQuery.isFetching || permissionListQuery.isFetching
    : false
  const rows = rowsQuery.data?.data?.rows ?? []
  const total = rowsQuery.data?.data?.totalRowCount ?? 0
  const menuTreeData: TreeSelectOption[] = buildMenuTreeSelectData(
    menuTreeQuery.data?.data ?? [],
  )
  const permissionTreeData: TreeSelectOption[] = buildPermissionTreeData(
    permissionListQuery.data?.data ?? [],
  )

  async function loadRows(
    nextPage = page,
    nextPageSize = pageSize,
    nextQuery: RoleQuery = query,
  ) {
    const isSameQuery =
      nextPage === page &&
      nextPageSize === pageSize &&
      JSON.stringify(nextQuery) === JSON.stringify(query)

    if (!isSameQuery) {
      await queryClient.ensureQueryData({
        queryKey: ['system', 'role', 'page', nextPage, nextPageSize, nextQuery],
        queryFn: () =>
          getRolePage({
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

  const columns: ColumnsType<RoleView> = [
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
      width: 220,
      render: (value?: string) => (
        <Typography.Text code>{value || '-'}</Typography.Text>
      ),
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (value?: string) => value || '-',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (value?: boolean | null) =>
        value === false ? (
          <Tag color="red">禁用</Tag>
        ) : (
          <Tag color="green">启用</Tag>
        ),
    },
    {
      title: '菜单权限',
      key: 'menus',
      render: (_, record) => renderMenuTags(record.menus),
    },
    {
      title: '按钮权限',
      key: 'permissions',
      render: (_, record) => renderPermissionTags(record.permissions),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          {canUpdate ? (
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => void openEdit(record)}
            >
              编辑
            </Button>
          ) : null}
          {canDelete ? (
            <Popconfirm
              title="确定删除当前角色吗？"
              onConfirm={async () => {
                if (!record.id) {
                  return
                }
                await deleteRole(record.id)
                message.success('删除成功')
                await loadRows(page, pageSize)
              }}
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

  async function openEdit(record: RoleView) {
    if (!record.id) {
      return
    }

    setDetailLoading(true)
    try {
      const result = await getRoleById(record.id)
      form.setFieldsValue(toFormValues(result.data))
      setModalOpen(true)
    } finally {
      setDetailLoading(false)
    }
  }

  async function handleSubmit() {
    const values = await form.validateFields()
    setSaving(true)
    try {
      const payload = normalizePayload(values)
      if (values.id) {
        await updateRole(payload as UpdateRoleInput)
        message.success('角色更新成功')
      } else {
        await createRole(payload as SaveRoleInput)
        message.success('角色创建成功')
      }
      setModalOpen(false)
      form.resetFields()
      await Promise.all([
        menuTreeQuery.refetch(),
        permissionListQuery.refetch(),
        rowsQuery.refetch(),
      ])
    } finally {
      setSaving(false)
    }
  }

  function handleTableChange(pagination: TablePaginationConfig) {
    const nextPage = pagination.current ?? 1
    const nextPageSize = pagination.pageSize ?? 10
    void loadRows(nextPage, nextPageSize)
  }

  if (!canQuery) {
    return (
      <PageContainer title="角色管理">
        <Result
          status="403"
          title="无权查看"
          subTitle="当前账号没有 system:role:query 权限，无法查看角色数据。"
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="角色管理"
      subTitle="角色同时绑定菜单访问范围和细粒度权限点，两者分开维护，再在角色层统一汇总。"
      extra={[
        <PermissionGuard
          key="add"
          permission={SYSTEM_PERMISSION_CODES.role.create}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.setFieldsValue(toFormValues())
              setModalOpen(true)
            }}
          >
            新增角色
          </Button>
        </PermissionGuard>,
        <Button
          key="reload"
          icon={<ReloadOutlined />}
          onClick={() =>
            void Promise.all([
              menuTreeQuery.refetch(),
              permissionListQuery.refetch(),
              rowsQuery.refetch(),
            ])
          }
        >
          刷新
        </Button>,
      ]}
    >
      <Card style={{ marginBottom: 16 }}>
        <Form
          form={searchForm}
          layout="inline"
          onFinish={(values) =>
            void loadRows(1, pageSize, toSearchQuery(values))
          }
        >
          <Form.Item name="code" label="角色编码">
            <Input allowClear placeholder="输入角色编码" />
          </Form.Item>
          <Form.Item name="name" label="角色名称">
            <Input allowClear placeholder="输入角色名称" />
          </Form.Item>
          <Form.Item name="enabled" label="状态">
            <Select
              allowClear
              placeholder="全部"
              style={{ width: 140 }}
              options={[
                { label: '启用', value: true },
                { label: '禁用', value: false },
              ]}
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
      </Card>

      <Table<RoleView>
        rowKey={(record) => record.id || record.code || 'system-role-row'}
        loading={loading || detailLoading || optionLoading}
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
      />

      <Modal
        destroyOnHidden
        title={form.getFieldValue('id') ? '编辑角色' : '新增角色'}
        open={modalOpen}
        width={860}
        confirmLoading={saving}
        onCancel={() => {
          setModalOpen(false)
          form.resetFields()
        }}
        onOk={() => void handleSubmit()}
      >
        <Form form={form} layout="vertical" initialValues={toFormValues()}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="角色编码"
            rules={[{ required: true, message: '请输入角色编码' }]}
          >
            <Input placeholder="例如：ADMIN" />
          </Form.Item>
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="例如：系统管理员" />
          </Form.Item>
          <Form.Item name="enabled" label="启用" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="menuIds" label="关联菜单">
            <TreeSelect
              allowClear
              showSearch
              multiple
              treeCheckable
              treeDefaultExpandAll
              filterTreeNode={(input, node) => matchTreeTitle(input, node)}
              treeData={menuTreeData}
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              maxTagCount="responsive"
              placeholder="选择角色可访问的菜单"
            />
          </Form.Item>
          <Form.Item name="permissionIds" label="关联权限点">
            <TreeSelect
              allowClear
              showSearch
              multiple
              treeCheckable
              treeDefaultExpandAll
              filterTreeNode={(input, node) => matchTreeTitle(input, node)}
              treeData={permissionTreeData}
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              maxTagCount="responsive"
              placeholder="选择角色可执行的按钮权限"
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}
