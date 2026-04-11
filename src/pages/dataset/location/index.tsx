import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { App, Button, Card, Col, Form, Input, Modal, Popconfirm, Row, Select, Space, Table, Tag } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { listRows as listRegionRows } from '../region/service'
import {
  createRow,
  deleteRow,
  getPage,
  updateRow,
  type LocationQuery,
  type LocationRecord,
  type LocationUpsertInput,
} from './service'

type SelectOption = {
  label: string
  value: string
}

type SearchValues = {
  name: string
  internalName: string
  regionId?: string
}

type FormValues = {
  id?: string
  name: string
  internalName: string
  regionId?: string
}

const pageTitle = '地点管理'
const pageSubtitle = '对接后端地点分页接口，支持分页查询、新增、编辑和删除。'
const modalWidth = 'min(92vw, 520px)'

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

function toSearchQuery(values: SearchValues): LocationQuery {
  const query: LocationQuery = {}

  if (values.name.trim()) {
    query.name = values.name.trim()
  }

  if (values.internalName.trim()) {
    query.internalName = values.internalName.trim()
  }

  if (values.regionId) {
    query.regionId = values.regionId
  }

  return query
}

function toFormValues(record?: LocationRecord | null): FormValues {
  return {
    id: stringifyId(record?.id),
    name: typeof record?.name === 'string' ? record.name : '',
    internalName: typeof record?.internalName === 'string' ? record.internalName : '',
    regionId: pickRelationId(record?.region),
  }
}

function toPayload(values: FormValues): LocationUpsertInput {
  return {
    id: values.id,
    name: values.name.trim(),
    internalName: values.internalName.trim(),
    regionId: values.regionId ?? null,
  }
}

export default function DatasetLocationPage() {
  const { message } = App.useApp()
  const [searchForm] = Form.useForm<SearchValues>()
  const [form] = Form.useForm<FormValues>()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [optionLoading, setOptionLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [rows, setRows] = useState<LocationRecord[]>([])
  const [editingRow, setEditingRow] = useState<LocationRecord | null>(null)
  const [query, setQuery] = useState<LocationQuery>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [regionOptions, setRegionOptions] = useState<SelectOption[]>([])

  async function loadOptions() {
    setOptionLoading(true)
    try {
      const result = await listRegionRows()
      setRegionOptions(toSelectOptions(result.data ?? []))
    } finally {
      setOptionLoading(false)
    }
  }

  async function loadData(
    nextPage = page,
    nextPageSize = pageSize,
    nextQuery: LocationQuery = query,
  ) {
    setLoading(true)
    try {
      const result = await getPage({
        page: nextPage,
        size: nextPageSize,
        sort: 'id,asc',
        query: nextQuery,
      })
      setRows(result.data?.rows ?? [])
      setTotal(result.data?.totalRowCount ?? 0)
      setQuery(nextQuery)
      setPage(nextPage)
      setPageSize(nextPageSize)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function bootstrap() {
      setOptionLoading(true)
      setLoading(true)
      try {
        const [regionResult, result] = await Promise.all([
          listRegionRows(),
          getPage({
            page: 1,
            size: 10,
            sort: 'id,asc',
            query: {},
          }),
        ])
        setRegionOptions(toSelectOptions(regionResult.data ?? []))
        setRows(result.data?.rows ?? [])
        setTotal(result.data?.totalRowCount ?? 0)
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

  function openEdit(record: LocationRecord) {
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
        message.success('地点已更新')
      } else {
        await createRow(payload)
        message.success('地点已创建')
      }
      setModalOpen(false)
      setEditingRow(null)
      form.resetFields()
      await loadData(page, pageSize, query)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(record: LocationRecord) {
    const id = stringifyId(record.id)
    if (!id) {
      return
    }

    await deleteRow(id)
    message.success('地点已删除')
    await loadData(page, pageSize, query)
  }

  function handleSearchSubmit(values: SearchValues) {
    void loadData(1, pageSize, toSearchQuery(values))
  }

  function handleResetSearch() {
    searchForm.resetFields()
    void loadData(1, pageSize, {})
  }

  function handleTableChange(pagination: TablePaginationConfig) {
    void loadData(pagination.current ?? 1, pagination.pageSize ?? 10, query)
  }

  const columns: ColumnsType<LocationRecord> = [
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
      title: '地区',
      dataIndex: 'region',
      key: 'region',
      width: 180,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: LocationRecord) => (
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
          onClick={() => void Promise.all([loadOptions(), loadData(page, pageSize, query)])}
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
          <Form.Item name="regionId" label="地区">
            <Select allowClear showSearch optionFilterProp="label" placeholder="请选择地区" options={regionOptions} loading={optionLoading} />
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

      <Table<LocationRecord>
        rowKey={(record, index) => stringifyId(record.id) ?? stringifyId(record.internalName) ?? 'location-' + index}
        loading={loading}
        columns={columns}
        dataSource={rows}
        onChange={handleTableChange}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (count) => '共 ' + count + ' 条',
        }}
        scroll={{ x: 1080 }}
      />

      <Modal
        destroyOnHidden
        title={editingRow ? '编辑地点' : '新增地点'}
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
              <Form.Item name="internalName" label="内部名称" rules={[{ required: true, message: '请输入内部名称' }]}>
                <Input allowClear placeholder="请输入内部名称" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="regionId" label="地区" rules={[{ required: true, message: '请选择地区' }]}>
                <Select showSearch optionFilterProp="label" placeholder="请选择地区" options={regionOptions} loading={optionLoading} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  )
}
