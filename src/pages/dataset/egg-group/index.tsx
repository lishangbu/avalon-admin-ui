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
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createRow, deleteRow, listRows, updateRow } from './service'
import type {
  EggGroupRecord,
  EggGroupQuery,
  EggGroupUpsertInput,
} from './service'

function toOptionalString(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return undefined
  }

  return String(value)
}
type SearchValues = {
  name: string
  internalName: string
  text: string
  characteristics: string
}

type FormValues = {
  id?: string
  name: string
  internalName: string
  text: string
  characteristics: string
}

function toSearchQuery(values: SearchValues): EggGroupQuery {
  const query: EggGroupQuery = {}

  if (values.name.trim()) {
    query.name = values.name.trim()
  }

  if (values.internalName.trim()) {
    query.internalName = values.internalName.trim()
  }

  if (values.text.trim()) {
    query.text = values.text.trim()
  }

  if (values.characteristics.trim()) {
    query.characteristics = values.characteristics.trim()
  }

  return query
}

function toFormValues(record?: EggGroupRecord | null): FormValues {
  return {
    id: toOptionalString(record?.id),
    name: typeof record?.name === 'string' ? record.name : '',
    internalName:
      typeof record?.internalName === 'string' ? record.internalName : '',
    text: typeof record?.text === 'string' ? record.text : '',
    characteristics:
      typeof record?.characteristics === 'string' ? record.characteristics : '',
  }
}

function toPayload(values: FormValues): EggGroupUpsertInput {
  const payload: EggGroupUpsertInput = {}

  if (values.id) {
    payload.id = values.id
  }

  payload.name = values.name.trim()
  payload.internalName = values.internalName.trim()
  payload.text = values.text.trim()
  payload.characteristics = values.characteristics.trim()

  return payload
}

export default function DatasetEggGroupPage() {
  const { message } = App.useApp()
  const [searchForm] = Form.useForm<SearchValues>()
  const [form] = Form.useForm<FormValues>()
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<EggGroupRecord | null>(null)
  const [query, setQuery] = useState<EggGroupQuery>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const rowsQuery = useQuery({
    queryKey: ['dataset', 'egg-group', 'list', query],
    queryFn: () => listRows(query),
  })

  const loading = rowsQuery.isFetching
  const rows = rowsQuery.data?.data ?? []
  const total = rows.length

  async function loadData(nextQuery: EggGroupQuery = query) {
    const isSameQuery = JSON.stringify(nextQuery) === JSON.stringify(query)

    if (!isSameQuery) {
      await queryClient.ensureQueryData({
        queryKey: ['dataset', 'egg-group', 'list', nextQuery],
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

  function openEdit(record: EggGroupRecord) {
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
        message.success('蛋组已更新')
      } else {
        await createRow(payload)
        message.success('蛋组已创建')
      }
      setModalOpen(false)
      setEditingRow(null)
      form.resetFields()
      await loadData(query)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(record: EggGroupRecord) {
    const id = toOptionalString(record.id)
    if (!id) {
      return
    }

    await deleteRow(id)
    message.success('蛋组已删除')
    await loadData(query)
  }

  function handleSearchSubmit(values: SearchValues) {
    void loadData(toSearchQuery(values))
  }

  function handleResetSearch() {
    searchForm.resetFields()
    void loadData({})
  }

  const columns: ColumnsType<EggGroupRecord> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      fixed: 'left',
      ellipsis: true,
      render: (value: string | number | null | undefined) =>
        value === '' || value == null ? '-' : value,
    },
    {
      title: '内部名称',
      dataIndex: 'internalName',
      key: 'internalName',
      width: 180,
      ellipsis: true,
      render: (value: string | number | null | undefined) =>
        value === '' || value == null ? '-' : value,
    },
    {
      title: '简介',
      dataIndex: 'text',
      key: 'text',
      width: 320,
      ellipsis: true,
      render: (value: string | number | null | undefined) =>
        value === '' || value == null ? '-' : value,
    },
    {
      title: '特征',
      dataIndex: 'characteristics',
      key: 'characteristics',
      width: 320,
      ellipsis: true,
      render: (value: string | number | null | undefined) =>
        value === '' || value == null ? '-' : value,
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: EggGroupRecord) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除当前数据吗？"
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
      title="蛋组管理"
      subTitle="对接后端蛋组接口，支持列表查询、新增、编辑和删除。"
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
            <Input allowClear placeholder="请输入名称" />
          </Form.Item>
          <Form.Item name="internalName" label="内部名称">
            <Input allowClear placeholder="请输入内部名称" />
          </Form.Item>
          <Form.Item name="text" label="简介">
            <Input allowClear placeholder="请输入简介" />
          </Form.Item>
          <Form.Item name="characteristics" label="特征">
            <Input allowClear placeholder="请输入特征" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={() => handleResetSearch()}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Table<EggGroupRecord>
        rowKey={(record, index) =>
          toOptionalString(record.id) ??
          toOptionalString(record.internalName) ??
          'egg-group-' + index
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
          showTotal: (count) => '共 ' + count + ' 条',
        }}
        scroll={{ x: 1200 }}
      />

      <Modal
        destroyOnHidden
        title={editingRow ? '编辑蛋组' : '新增蛋组'}
        open={modalOpen}
        width="min(96vw, 920px)"
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
                <Input allowClear placeholder="请输入名称" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="internalName"
                label="内部名称"
                rules={[{ required: true, message: '请输入内部名称' }]}
              >
                <Input allowClear placeholder="请输入内部名称" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="text" label="简介">
                <Input.TextArea
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  placeholder="请输入简介"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="characteristics" label="特征">
                <Input.TextArea
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  placeholder="请输入特征"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  )
}
