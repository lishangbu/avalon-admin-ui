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
  InputNumber,
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
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { PermissionGuard } from '@/components/PermissionGuard'
import { SYSTEM_PERMISSION_CODES } from '@/constants/permissions'
import { usePermission } from '@/hooks/usePermission'
import { listMenuTree } from '@/pages/system/menu/service'
import {
  buildMenuTreeSelectData,
  getMenuDisplayName,
  stringifyId,
  type TreeSelectOption,
} from '@/pages/system/shared/tree-options'
import {
  createPermission,
  deletePermission,
  getPermissionById,
  listPermissions,
  updatePermission,
} from './service'
import type {
  PermissionQuery,
  PermissionView,
  SavePermissionInput,
  UpdatePermissionInput,
} from './types'

type PermissionSearchValues = {
  code?: string
  name?: string
  menuId?: string
  enabled?: boolean
}

type PermissionFormValues = {
  id?: string
  menuId: string
  code: string
  name: string
  enabled: boolean
  sortingOrder: number
}

function toSearchQuery(values: PermissionSearchValues): PermissionQuery {
  return {
    code: values.code?.trim() || undefined,
    name: values.name?.trim() || undefined,
    menuId: values.menuId || undefined,
    enabled: values.enabled,
  }
}

function toFormValues(permission?: PermissionView | null): PermissionFormValues {
  return {
    id: stringifyId(permission?.id),
    menuId: stringifyId(permission?.menu?.id),
    code: permission?.code ?? '',
    name: permission?.name ?? '',
    enabled: permission?.enabled !== false,
    sortingOrder: Number(permission?.sortingOrder ?? 0),
  }
}

function normalizePayload(
  values: PermissionFormValues,
): SavePermissionInput | UpdatePermissionInput {
  return {
    id: values.id || undefined,
    menuId: values.menuId,
    code: values.code.trim(),
    name: values.name.trim(),
    enabled: values.enabled,
    sortingOrder: values.sortingOrder,
  }
}

function matchTreeTitle(input: string, node: { title?: unknown }) {
  return String(node.title ?? '')
    .toLowerCase()
    .includes(input.trim().toLowerCase())
}

export default function PermissionManagementPage() {
  const { message } = App.useApp()
  const { has } = usePermission()
  const [searchForm] = Form.useForm<PermissionSearchValues>()
  const [form] = Form.useForm<PermissionFormValues>()
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [query, setQuery] = useState<PermissionQuery>({})
  const canQuery = has(SYSTEM_PERMISSION_CODES.permission.query)
  const canUpdate = has(SYSTEM_PERMISSION_CODES.permission.update)
  const canDelete = has(SYSTEM_PERMISSION_CODES.permission.delete)
  const menuTreeQuery = useQuery({
    queryKey: ['system', 'menu', 'tree'],
    queryFn: () => listMenuTree(),
    enabled: canQuery,
  })
  const rowsQuery = useQuery({
    queryKey: ['system', 'permission', 'list', query],
    queryFn: () => listPermissions(query),
    enabled: canQuery,
  })
  const loading = canQuery ? rowsQuery.isFetching : false
  const rows = rowsQuery.data?.data ?? []
  const menuTreeData: TreeSelectOption[] = buildMenuTreeSelectData(
    menuTreeQuery.data?.data ?? [],
  )

  async function loadRows(nextQuery: PermissionQuery = query) {
    const isSameQuery = JSON.stringify(nextQuery) === JSON.stringify(query)

    if (!isSameQuery) {
      await queryClient.ensureQueryData({
        queryKey: ['system', 'permission', 'list', nextQuery],
        queryFn: () => listPermissions(nextQuery),
      })
      setQuery(nextQuery)
      return
    }

    await rowsQuery.refetch()
  }

  const columns: ColumnsType<PermissionView> = [
    {
      title: '权限编码',
      dataIndex: 'code',
      key: 'code',
      width: 240,
      render: (value?: string) => <Typography.Text code>{value || '-'}</Typography.Text>,
    },
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (value?: string) => value || '-',
    },
    {
      title: '所属菜单',
      key: 'menu',
      render: (_, record) => (
        <Space size={4} wrap>
          <Tag color="blue">{getMenuDisplayName(record.menu)}</Tag>
          {record.menu?.path ? <Tag>{record.menu.path}</Tag> : null}
        </Space>
      ),
    },
    {
      title: '排序',
      dataIndex: 'sortingOrder',
      key: 'sortingOrder',
      width: 100,
      render: (value?: number | null) => value ?? 0,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (value?: boolean | null) =>
        value === false ? <Tag color="red">禁用</Tag> : <Tag color="green">启用</Tag>,
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
              title="确定删除当前权限点吗？"
              onConfirm={async () => {
                await deletePermission(record.id!)
                message.success('删除成功')
                await loadRows()
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

  async function openEdit(record: PermissionView) {
    setDetailLoading(true)
    try {
      const result = await getPermissionById(record.id!)
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
        await updatePermission(payload as UpdatePermissionInput)
        message.success('权限点更新成功')
      } else {
        await createPermission(payload as SavePermissionInput)
        message.success('权限点创建成功')
      }
      setModalOpen(false)
      form.resetFields()
      await loadRows()
    } finally {
      setSaving(false)
    }
  }

  if (!canQuery) {
    return (
      <PageContainer title="权限管理">
        <Result
          status="403"
          title="无权查看"
          subTitle="当前账号没有 system:permission:query 权限，无法查看权限点数据。"
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="权限管理"
      subTitle="菜单控制页面可见范围，权限点控制页面内具体按钮和操作是否可执行。"
      extra={[
        <PermissionGuard
          key="add"
          permission={SYSTEM_PERMISSION_CODES.permission.create}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.setFieldsValue(toFormValues())
              setModalOpen(true)
            }}
          >
            新增权限点
          </Button>
        </PermissionGuard>,
        <Button key="reload" icon={<ReloadOutlined />} onClick={() => void loadRows()}>
          刷新
        </Button>,
      ]}
    >
      <Card style={{ marginBottom: 16 }}>
        <Form
          form={searchForm}
          layout="inline"
          onFinish={(values) => void loadRows(toSearchQuery(values))}
        >
          <Form.Item name="code" label="权限编码">
            <Input allowClear placeholder="输入权限编码" />
          </Form.Item>
          <Form.Item name="name" label="权限名称">
            <Input allowClear placeholder="输入权限名称" />
          </Form.Item>
          <Form.Item name="menuId" label="所属菜单">
            <TreeSelect
              allowClear
              showSearch
              treeDefaultExpandAll
              filterTreeNode={(input, node) => matchTreeTitle(input, node)}
              treeData={menuTreeData}
              placeholder="选择菜单"
              style={{ width: 280 }}
            />
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
                  void loadRows({})
                }}
              >
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Table<PermissionView>
        rowKey={(record) => stringifyId(record.id)}
        loading={loading || detailLoading}
        columns={columns}
        dataSource={rows}
        pagination={false}
      />

      <Modal
        destroyOnHidden
        title={form.getFieldValue('id') ? '编辑权限点' : '新增权限点'}
        open={modalOpen}
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
            name="menuId"
            label="所属菜单"
            rules={[{ required: true, message: '请选择所属菜单' }]}
          >
            <TreeSelect
              showSearch
              treeDefaultExpandAll
              filterTreeNode={(input, node) => matchTreeTitle(input, node)}
              treeData={menuTreeData}
              placeholder="请选择所属菜单"
            />
          </Form.Item>
          <Form.Item
            name="code"
            label="权限编码"
            rules={[{ required: true, message: '请输入权限编码' }]}
          >
            <Input placeholder="例如：system:user:create" />
          </Form.Item>
          <Form.Item
            name="name"
            label="权限名称"
            rules={[{ required: true, message: '请输入权限名称' }]}
          >
            <Input placeholder="例如：新增用户" />
          </Form.Item>
          <Form.Item
            name="sortingOrder"
            label="排序"
            rules={[{ required: true, message: '请输入排序值' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="enabled" label="启用" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}
