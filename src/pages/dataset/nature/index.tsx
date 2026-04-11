import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { App, Button, Card, Col, Form, Input, Modal, Popconfirm, Row, Select, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { listRows as listBerryFlavorRows } from '../berry-flavor/service'
import { listRows as listStatRows } from '../stat/service'
import {
  createRow,
  deleteRow,
  listRows,
  updateRow,
  type NatureQuery,
  type NatureRecord,
  type NatureUpsertInput,
} from './service'

type SelectOption = {
  label: string
  value: string
}

type SearchValues = {
  name: string
  internalName: string
  increasedStatId?: string
  decreasedStatId?: string
  likesBerryFlavorId?: string
  hatesBerryFlavorId?: string
}

type FormValues = SearchValues & {
  id?: string
}

const pageTitle = '性格管理'
const pageSubtitle = '对接后端性格接口，支持列表查询、新增、编辑和删除。'
const modalWidth = 'min(96vw, 720px)'

function stringifyId(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return undefined
  }

  return String(value)
}

function formatComplexValue(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function getObjectSummary(value: Record<string, unknown>) {
  if (typeof value.name === 'string' && value.name.trim()) {
    return value.name
  }
  if (typeof value.internalName === 'string' && value.internalName.trim()) {
    return value.internalName
  }
  if (value.id !== null && value.id !== undefined) {
    return `#${value.id}`
  }
  return formatComplexValue(value)
}

function renderDatasetValue(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  if (typeof value === 'boolean') {
    return value ? <Tag color="green">是</Tag> : <Tag>否</Tag>
  }

  if (typeof value === 'number' || typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '-'
    }

    return value
      .map((item) =>
        typeof item === 'object' && item !== null
          ? getObjectSummary(item as Record<string, unknown>)
          : String(item),
      )
      .join(', ')
  }

  if (typeof value === 'object') {
    return getObjectSummary(value as Record<string, unknown>)
  }

  return String(value)
}

function toSelectOptions<T extends { id?: unknown; name?: string | null; internalName?: string | null }>(
  rows: T[],
) {
  return rows
    .map((row) => ({
      label:
        (typeof row.name === 'string' && row.name.trim()) ||
        (typeof row.internalName === 'string' && row.internalName.trim()) ||
        `#${row.id}`,
      value: stringifyId(row.id) ?? '',
    }))
    .filter((item) => item.value)
}

function pickRelationId(value: unknown) {
  if (!value || typeof value !== 'object') {
    return undefined
  }

  return stringifyId((value as Record<string, unknown>).id)
}

function toSearchQuery(values: SearchValues): NatureQuery {
  const query: NatureQuery = {}

  if (values.name.trim()) {
    query.name = values.name.trim()
  }

  if (values.internalName.trim()) {
    query.internalName = values.internalName.trim()
  }

  if (values.increasedStatId) {
    query.increasedStatId = values.increasedStatId
  }

  if (values.decreasedStatId) {
    query.decreasedStatId = values.decreasedStatId
  }

  if (values.likesBerryFlavorId) {
    query.likesBerryFlavorId = values.likesBerryFlavorId
  }

  if (values.hatesBerryFlavorId) {
    query.hatesBerryFlavorId = values.hatesBerryFlavorId
  }

  return query
}

function toFormValues(record?: NatureRecord | null): FormValues {
  return {
    id: stringifyId(record?.id),
    name: typeof record?.name === 'string' ? record.name : '',
    internalName: typeof record?.internalName === 'string' ? record.internalName : '',
    increasedStatId: pickRelationId(record?.increasedStat),
    decreasedStatId: pickRelationId(record?.decreasedStat),
    likesBerryFlavorId: pickRelationId(record?.likesBerryFlavor),
    hatesBerryFlavorId: pickRelationId(record?.hatesBerryFlavor),
  }
}

function toPayload(values: FormValues): NatureUpsertInput {
  return {
    id: values.id,
    name: values.name.trim(),
    internalName: values.internalName.trim(),
    increasedStatId: values.increasedStatId ?? null,
    decreasedStatId: values.decreasedStatId ?? null,
    likesBerryFlavorId: values.likesBerryFlavorId ?? null,
    hatesBerryFlavorId: values.hatesBerryFlavorId ?? null,
  }
}

export default function DatasetNaturePage() {
  const { message } = App.useApp()
  const [searchForm] = Form.useForm<SearchValues>()
  const [form] = Form.useForm<FormValues>()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [optionLoading, setOptionLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [rows, setRows] = useState<NatureRecord[]>([])
  const [editingRow, setEditingRow] = useState<NatureRecord | null>(null)
  const [query, setQuery] = useState<NatureQuery>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [statOptions, setStatOptions] = useState<SelectOption[]>([])
  const [berryFlavorOptions, setBerryFlavorOptions] = useState<SelectOption[]>([])

  const total = rows.length

  async function loadOptions() {
    setOptionLoading(true)
    try {
      const [statResult, berryFlavorResult] = await Promise.all([
        listStatRows(),
        listBerryFlavorRows(),
      ])
      setStatOptions(toSelectOptions(statResult.data ?? []))
      setBerryFlavorOptions(toSelectOptions(berryFlavorResult.data ?? []))
    } finally {
      setOptionLoading(false)
    }
  }

  async function loadData(nextQuery: NatureQuery = query) {
    setLoading(true)
    try {
      const result = await listRows(nextQuery)
      setRows(result.data ?? [])
      setQuery(nextQuery)
      setPage(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function bootstrap() {
      setOptionLoading(true)
      setLoading(true)
      try {
        const [statResult, berryFlavorResult, result] = await Promise.all([
          listStatRows(),
          listBerryFlavorRows(),
          listRows({}),
        ])
        setStatOptions(toSelectOptions(statResult.data ?? []))
        setBerryFlavorOptions(toSelectOptions(berryFlavorResult.data ?? []))
        setRows(result.data ?? [])
        setQuery({})
        setPage(1)
        setPageSize(10)
      } finally {
        setOptionLoading(false)
        setLoading(false)
      }
    }

    void bootstrap()
  }, [])

  function openCreate() {
    setEditingRow(null)
    form.resetFields()
    form.setFieldsValue(toFormValues())
    setModalOpen(true)
  }

  function openEdit(record: NatureRecord) {
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
        message.success('性格已更新')
      } else {
        await createRow(payload)
        message.success('性格已创建')
      }
      setModalOpen(false)
      setEditingRow(null)
      form.resetFields()
      await loadData(query)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(record: NatureRecord) {
    const id = stringifyId(record.id)
    if (!id) {
      return
    }

    await deleteRow(id)
    message.success('性格已删除')
    await loadData(query)
  }

  function handleSearchSubmit(values: SearchValues) {
    void loadData(toSearchQuery(values))
  }

  function handleResetSearch() {
    searchForm.resetFields()
    void loadData({})
  }

  const columns: ColumnsType<NatureRecord> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      fixed: 'left',
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '内部名称',
      dataIndex: 'internalName',
      key: 'internalName',
      width: 180,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '提升能力',
      dataIndex: 'increasedStat',
      key: 'increasedStat',
      width: 180,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '降低能力',
      dataIndex: 'decreasedStat',
      key: 'decreasedStat',
      width: 180,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '喜欢风味',
      dataIndex: 'likesBerryFlavor',
      key: 'likesBerryFlavor',
      width: 180,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '讨厌风味',
      dataIndex: 'hatesBerryFlavor',
      key: 'hatesBerryFlavor',
      width: 180,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: NatureRecord) => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确认删除当前数据吗？" onConfirm={() => void handleDelete(record)}>
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
      title={pageTitle}
      subTitle={pageSubtitle}
      extra={[
        <Button key="create" type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          {`新增${pageTitle.replace(/管理$/, '')}`}
        </Button>,
        <Button
          key="reload"
          icon={<ReloadOutlined />}
          loading={loading || optionLoading}
          onClick={() => void Promise.all([loadOptions(), loadData(query)])}
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
          <Form.Item name="increasedStatId" label="提升能力">
            <Select allowClear showSearch optionFilterProp="label" placeholder="请选择提升能力" options={statOptions} loading={optionLoading} />
          </Form.Item>
          <Form.Item name="decreasedStatId" label="降低能力">
            <Select allowClear showSearch optionFilterProp="label" placeholder="请选择降低能力" options={statOptions} loading={optionLoading} />
          </Form.Item>
          <Form.Item name="likesBerryFlavorId" label="喜欢风味">
            <Select allowClear showSearch optionFilterProp="label" placeholder="请选择喜欢风味" options={berryFlavorOptions} loading={optionLoading} />
          </Form.Item>
          <Form.Item name="hatesBerryFlavorId" label="讨厌风味">
            <Select allowClear showSearch optionFilterProp="label" placeholder="请选择讨厌风味" options={berryFlavorOptions} loading={optionLoading} />
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

      <Table<NatureRecord>
        rowKey={(record, index) => stringifyId(record.id) ?? stringifyId(record.internalName) ?? 'nature-' + index}
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
        scroll={{ x: 1500 }}
      />

      <Modal
        destroyOnHidden
        title={editingRow ? '编辑性格' : '新增性格'}
        open={modalOpen}
        width={modalWidth}
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
        <Form form={form} layout="vertical" initialValues={toFormValues()} scrollToFirstError>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
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
              <Form.Item name="increasedStatId" label="提升能力" rules={[{ required: true, message: '请选择提升能力' }]}>
                <Select showSearch optionFilterProp="label" placeholder="请选择提升能力" options={statOptions} loading={optionLoading} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="decreasedStatId" label="降低能力" rules={[{ required: true, message: '请选择降低能力' }]}>
                <Select showSearch optionFilterProp="label" placeholder="请选择降低能力" options={statOptions} loading={optionLoading} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="likesBerryFlavorId" label="喜欢风味" rules={[{ required: true, message: '请选择喜欢风味' }]}>
                <Select showSearch optionFilterProp="label" placeholder="请选择喜欢风味" options={berryFlavorOptions} loading={optionLoading} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="hatesBerryFlavorId" label="讨厌风味" rules={[{ required: true, message: '请选择讨厌风味' }]}>
                <Select showSearch optionFilterProp="label" placeholder="请选择讨厌风味" options={berryFlavorOptions} loading={optionLoading} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  )
}
