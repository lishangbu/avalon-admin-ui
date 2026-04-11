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
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { PermissionGuard } from '@/components/PermissionGuard'
import { SYSTEM_PERMISSION_CODES } from '@/constants/permissions'
import { usePermission } from '@/hooks/usePermission'
import {
  buildMenuTreeSelectData,
  type TreeSelectOption,
} from '@/pages/system/shared/tree-options'
import type { MenuTreeNode, MenuType, MenuView } from '@/types/menu'
import { createMenu, deleteMenu, listMenuTree, updateMenu } from './service'

type MenuFormValues = {
  id?: string
  parentId?: string | null
  type: MenuType
  key: string
  title: string
  icon?: string
  path?: string
  name: string
  component?: string
  redirect?: string
  activeMenu?: string
  sortingOrder: number
  disabled: boolean
  show: boolean
  hidden: boolean
  pinned: boolean
  showTab: boolean
  enableMultiTab: boolean
  hideChildrenInMenu: boolean
  flatMenu: boolean
  external: boolean
  target?: string
  extra?: string
}

const menuTypeOptions = [
  { label: '目录', value: 'directory' },
  { label: '菜单', value: 'menu' },
  { label: '按钮', value: 'button' },
  { label: '外链', value: 'link' },
] satisfies { label: string; value: MenuType }[]

const menuTypeLabelMap: Record<MenuType, string> = {
  directory: '目录',
  menu: '菜单',
  button: '按钮',
  link: '外链',
}

function toFormValues(
  node?: MenuView | null,
  parentId?: string | null,
): MenuFormValues {
  return {
    id: node?.id ? String(node.id) : '',
    parentId: parentId ?? (node?.parentId ? String(node.parentId) : null),
    type: (node?.type as MenuType | undefined) ?? 'menu',
    key: node?.key ?? '',
    title: node?.title ?? '',
    icon: node?.icon ?? '',
    path: node?.path ?? '',
    name: node?.name ?? '',
    component: node?.component ?? '',
    redirect: node?.redirect ?? '',
    activeMenu: node?.activeMenu ?? '',
    sortingOrder: Number(node?.sortingOrder ?? 0),
    disabled: Boolean(node?.disabled),
    show: node?.show !== false,
    hidden: Boolean(node?.hidden),
    pinned: Boolean(node?.pinned),
    showTab: node?.showTab !== false,
    enableMultiTab: node?.enableMultiTab !== false,
    hideChildrenInMenu: Boolean(node?.hideChildrenInMenu),
    flatMenu: Boolean(node?.flatMenu),
    external: Boolean(node?.external),
    target: node?.target ?? '',
    extra: node?.extra ?? '',
  }
}

function normalizePayload(values: MenuFormValues) {
  return {
    ...values,
    id: values.id || undefined,
    parentId: values.parentId || null,
    key: values.key.trim(),
    title: values.title.trim(),
    icon: values.icon?.trim() || null,
    path: values.path?.trim() || null,
    name: values.name.trim(),
    component: values.component?.trim() || null,
    redirect: values.redirect?.trim() || null,
    activeMenu: values.activeMenu?.trim() || null,
    target: values.target || null,
    extra: values.extra?.trim() || null,
  }
}

function matchTreeTitle(input: string, node: { title?: unknown }) {
  return String(node.title ?? '')
    .toLowerCase()
    .includes(input.trim().toLowerCase())
}

export default function MenuManagementPage() {
  const { message } = App.useApp()
  const { has } = usePermission()
  const [form] = Form.useForm<MenuFormValues>()
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const canQuery = has(SYSTEM_PERMISSION_CODES.menu.query)
  const canCreate = has(SYSTEM_PERMISSION_CODES.menu.create)
  const canUpdate = has(SYSTEM_PERMISSION_CODES.menu.update)
  const canDelete = has(SYSTEM_PERMISSION_CODES.menu.delete)
  const treeQuery = useQuery({
    queryKey: ['system', 'menu', 'tree'],
    queryFn: () => listMenuTree(),
    enabled: canQuery,
  })
  const loading = canQuery ? treeQuery.isFetching : false
  const treeData = useMemo<MenuTreeNode[]>(
    () => treeQuery.data?.data ?? [],
    [treeQuery.data?.data],
  )

  async function loadTree() {
    await treeQuery.refetch()
  }

  const parentOptions = useMemo<TreeSelectOption[]>(() => {
    return buildMenuTreeSelectData(treeData, { includeButtons: true })
  }, [treeData])

  const columns = useMemo<ColumnsType<MenuTreeNode>>(
    () => [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        render: (_, record) => record.title || '-',
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: 100,
        render: (value: MenuType | null | undefined) => (
          <Tag>{menuTypeLabelMap[value ?? 'menu']}</Tag>
        ),
      },
      {
        title: '路径',
        dataIndex: 'path',
        key: 'path',
      },
      {
        title: '组件',
        dataIndex: 'component',
        key: 'component',
      },
      {
        title: '排序',
        dataIndex: 'sortingOrder',
        key: 'sortingOrder',
        width: 90,
      },
      {
        title: '状态',
        key: 'status',
        width: 220,
        render: (_, record) => (
          <Space size={4} wrap>
            {record.show !== false && <Tag color="blue">显示</Tag>}
            {record.hidden === true && <Tag>隐藏菜单</Tag>}
            {record.disabled === true && <Tag color="red">禁用</Tag>}
            {record.pinned === true && <Tag color="gold">固定页签</Tag>}
            {record.external === true && <Tag color="purple">外链</Tag>}
          </Space>
        ),
      },
      {
        title: '操作',
        key: 'actions',
        width: 220,
        render: (_, record) => (
          <Space size="small">
            {canCreate ? (
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() => {
                  form.setFieldsValue(toFormValues(null, String(record.id)))
                  setModalOpen(true)
                }}
              >
                新增子项
              </Button>
            ) : null}
            {canUpdate ? (
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  form.setFieldsValue(toFormValues(record))
                  setModalOpen(true)
                }}
              >
                编辑
              </Button>
            ) : null}
            {canDelete ? (
              <Popconfirm
                title="确定删除当前菜单吗？"
                onConfirm={async () => {
                  await deleteMenu(String(record.id))
                  message.success('删除成功')
                  await treeQuery.refetch()
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
    ],
    [canCreate, canDelete, canUpdate, form, message, treeQuery],
  )

  async function handleSubmit() {
    const values = await form.validateFields()
    setSaving(true)
    try {
      const payload = normalizePayload(values)
      if (payload.id) {
        await updateMenu(payload)
        message.success('更新成功')
      } else {
        await createMenu(payload)
        message.success('创建成功')
      }
      setModalOpen(false)
      form.resetFields()
      await queryClient.invalidateQueries({
        queryKey: ['system', 'menu', 'tree'],
      })
      await treeQuery.refetch()
    } finally {
      setSaving(false)
    }
  }

  if (!canQuery) {
    return (
      <PageContainer title="菜单管理">
        <Result
          status="403"
          title="无权查看"
          subTitle="当前账号没有 system:menu:query 权限，无法查看菜单数据。"
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="菜单管理"
      subTitle="维护布局菜单与路由元数据。权限点已经独立建模，后续单独管理。"
      extra={[
        <PermissionGuard
          key="add-root"
          permission={SYSTEM_PERMISSION_CODES.menu.create}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.setFieldsValue(toFormValues())
              setModalOpen(true)
            }}
          >
            新增根菜单
          </Button>
        </PermissionGuard>,
        <Button
          key="reload"
          icon={<ReloadOutlined />}
          onClick={() => void loadTree()}
        >
          刷新
        </Button>,
      ]}
    >
      <Table<MenuTreeNode>
        rowKey={(record) => String(record.id)}
        loading={loading}
        columns={columns}
        dataSource={treeData}
        pagination={false}
      />
      <Modal
        destroyOnHidden
        title={form.getFieldValue('id') ? '编辑菜单' : '新增菜单'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false)
          form.resetFields()
        }}
        onOk={() => void handleSubmit()}
        confirmLoading={saving}
        width={900}
      >
        <Form form={form} layout="vertical" initialValues={toFormValues()}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="parentId" label="父菜单">
            <TreeSelect
              allowClear
              showSearch
              treeDefaultExpandAll
              filterTreeNode={(input, node) => matchTreeTitle(input, node)}
              treeData={parentOptions}
              placeholder="请选择父菜单"
            />
          </Form.Item>
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select options={menuTypeOptions} />
          </Form.Item>
          <Form.Item
            name="key"
            label="键名"
            rules={[{ required: true, message: '请输入键名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="路由名称"
            rules={[{ required: true, message: '请输入路由名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="path" label="路径">
            <Input placeholder="/system/menu" />
          </Form.Item>
          <Form.Item name="component" label="组件标识">
            <Input placeholder="system/menu/index" />
          </Form.Item>
          <Form.Item name="redirect" label="重定向">
            <Input />
          </Form.Item>
          <Form.Item name="activeMenu" label="激活菜单">
            <Input placeholder="/system/menu" />
          </Form.Item>
          <Form.Item name="icon" label="图标">
            <Input />
          </Form.Item>
          <Form.Item name="target" label="外链目标">
            <Select
              allowClear
              options={[
                { label: '_self', value: '_self' },
                { label: '_blank', value: '_blank' },
              ]}
            />
          </Form.Item>
          <Form.Item name="extra" label="扩展信息">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="sortingOrder"
            label="排序"
            rules={[{ required: true, message: '请输入排序值' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Space wrap size="large">
            <Form.Item name="show" label="显示" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="hidden" label="隐藏菜单" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="disabled" label="禁用" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="pinned" label="固定页签" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="showTab" label="显示页签" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item
              name="enableMultiTab"
              label="允许多开"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="hideChildrenInMenu"
              label="隐藏子菜单"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item name="flatMenu" label="平铺菜单" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="external" label="外链" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </PageContainer>
  )
}
