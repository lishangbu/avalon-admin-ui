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
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createRow, deleteRow, listRows, updateRow } from './service'
import type { TypeQuery, TypeRecord, TypeUpsertInput } from './service'

function toOptionalString(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return undefined
  }

  return String(value)
}

type SearchValues = {
  name: string
  code: string
  enabled?: boolean
}

type FormValues = {
  id?: string
  name: string
  code: string
  description: string
  icon: string
  sortingOrder?: number
  enabled: boolean
}

function toSearchQuery(values: SearchValues): TypeQuery {
  const query: TypeQuery = {}

  if (values.name.trim()) {
    query.name = values.name.trim()
  }

  if (values.code.trim()) {
    query.code = values.code.trim()
  }

  if (values.enabled !== undefined) {
    query.enabled = values.enabled
  }

  return query
}

function toFormValues(record?: TypeRecord | null): FormValues {
  return {
    id: toOptionalString(record?.id),
    name: record?.name ?? '',
    code: record?.code ?? '',
    description: record?.description ?? '',
    icon: record?.icon ?? '',
    sortingOrder:
      typeof record?.sortingOrder === 'number' ? record.sortingOrder : 0,
    enabled: record?.enabled !== false,
  }
}

function toPayload(values: FormValues): TypeUpsertInput {
  return {
    id: values.id,
    name: values.name.trim(),
    code: values.code.trim(),
    description: values.description.trim() || null,
    icon: values.icon.trim() || null,
    sortingOrder: values.sortingOrder ?? 0,
    enabled: values.enabled,
  }
}

function renderEnabledTag(value?: boolean | null) {
  return value === false ? (
    <Tag color="red">禁用</Tag>
  ) : (
    <Tag color="green">启用</Tag>
  )
}

export default function DatasetTypePage() {
  const { message } = App.useApp()
  const [searchForm] = Form.useForm<SearchValues>()
  const [form] = Form.useForm<FormValues>()
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<TypeRecord | null>(null)
  const [query, setQuery] = useState<TypeQuery>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const rowsQuery = useQuery({
    queryKey: ['catalog', 'type', 'list', query],
    queryFn: () => listRows(query),
  })

  const loading = rowsQuery.isFetching
  const rows = rowsQuery.data ?? []
  const total = rows.length

  async function loadData(nextQuery: TypeQuery = query) {
    const isSameQuery = JSON.stringify(nextQuery) === JSON.stringify(query)

    if (!isSameQuery) {
      await queryClient.ensureQueryData({
        queryKey: ['catalog', 'type', 'list', nextQuery],
        queryFn: () => listRows(nextQuery),
      })
      setQuery(nextQuery)
      setPage(1)
      return
    }

    await rowsQuery.refetch()
  }

  function openCreate() {
    setEditingRow(null)
    form.resetFields()
    form.setFieldsValue(toFormValues())
    setModalOpen(true)
  }

  function openEdit(record: TypeRecord) {
    setEditingRow(record)
    form.resetFields()
    form.setFieldsValue(toFormValues(record))
    setModalOpen(true)
  }

  async function handleSubmit() {
    const values = await form.validateFields()
    setSaving(true)
    try {
      const payload = toPayload(values)
      if (values.id) {
        await updateRow(payload)
        message.success('属性已更新')
      } else {
        await createRow(payload)
        message.success('属性已创建')
      }
      setModalOpen(false)
      setEditingRow(null)
      form.resetFields()
      await loadData(query)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(record: TypeRecord) {
    const id = toOptionalString(record.id)
    if (!id) {
      return
    }

    await deleteRow(id)
    message.success('属性已删除')
    await loadData(query)
  }

  function handleSearchSubmit(values: SearchValues) {
    void loadData(toSearchQuery(values))
  }

  function handleResetSearch() {
    searchForm.resetFields()
    void loadData({})
  }

  const columns: ColumnsType<TypeRecord> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      fixed: 'left',
      render: (value?: string | null) => value || '-',
    },
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      width: 180,
      render: (value?: string | null) => value || '-',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 260,
      render: (value?: string | null) => value || '-',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 180,
      render: (value?: string | null) => value || '-',
    },
    {
      title: '排序',
      dataIndex: 'sortingOrder',
      key: 'sortingOrder',
      width: 100,
      render: (value?: number | null) => value ?? '-',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (value?: boolean | null) => renderEnabledTag(value),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: TypeRecord) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除当前属性吗？"
            onConfirm={() => void handleDelete(record)}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <PageContainer
      title="属性管理"
      subTitle="对接后端属性定义接口，支持按名称、编码和状态筛选。"
      extra={[
        <Button
          key="create"
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreate}
        >
          新增
        </Button>,
        <Button
          key="reload"
          icon={<ReloadOutlined />}
          loading={loading}
          onClick={() => void loadData(query)}
        >
          刷新
        </Button>,
      ]}
    >
      <Card style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline" onFinish={handleSearchSubmit}>
          <Form.Item name="name" label="名称">
            <Input allowClear placeholder="输入名称" />
          </Form.Item>
          <Form.Item name="code" label="编码">
            <Input allowClear placeholder="输入编码" />
          </Form.Item>
          <Form.Item name="enabled" label="状态">
            <Select
              allowClear
              style={{ width: 140 }}
              options={[
                { label: '启用', value: true },
                { label: '禁用', value: false },
              ]}
              placeholder="全部状态"
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={handleResetSearch}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Table<TypeRecord>
        rowKey={(record, index) =>
          toOptionalString(record.id) ?? record.code ?? `type-${index}`
        }
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: (nextPage, nextPageSize) => {
            setPage(nextPage)
            setPageSize(nextPageSize)
          },
          showTotal: (count) => `共 ${count} 条`,
        }}
        scroll={{ x: 1280 }}
      />

      <Modal
        destroyOnHidden
        title={editingRow ? '编辑属性' : '新增属性'}
        open={modalOpen}
        width="min(96vw, 720px)"
        confirmLoading={saving}
        styles={{
          body: {
            maxHeight: '72vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingTop: 8,
          },
        }}
        onCancel={() => {
          setEditingRow(null)
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
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="名称"
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Input allowClear placeholder="例如：火" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="code"
                label="编码"
                rules={[{ required: true, message: '请输入编码' }]}
              >
                <Input allowClear placeholder="例如：FIRE" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="描述">
                <Input.TextArea
                  allowClear
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  placeholder="输入属性描述"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="icon" label="图标">
                <Input allowClear placeholder="例如：fire" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="sortingOrder" label="排序">
                <InputNumber min={0} precision={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="enabled"
                label="启用状态"
                valuePropName="checked"
              >
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  )
}
