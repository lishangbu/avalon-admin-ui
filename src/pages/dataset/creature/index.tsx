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
  Table,
  Tag,
} from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { getPage as getCreatureSpeciesPage } from '../creature-species/service'
import {
  createRow,
  deleteRow,
  getPage,
  updateRow,
  type CreatureQuery,
  type CreatureRecord,
  type CreatureUpsertInput,
} from './service'

type SelectOption = {
  label: string
  value: string
}

type SearchValues = {
  name: string
  internalName: string
  creatureSpeciesId?: string
}

type FormValues = {
  id?: string
  name: string
  internalName: string
  height?: number
  weight?: number
  baseExperience?: number
  sortingOrder?: number
  creatureSpeciesId?: string
}

const pageTitle = '精灵管理'
const pageSubtitle = '对接后端精灵分页接口，支持分页查询、新增、编辑和删除。'
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

function toSearchQuery(values: SearchValues): CreatureQuery {
  const query: CreatureQuery = {}

  if (values.name.trim()) {
    query.name = values.name.trim()
  }

  if (values.internalName.trim()) {
    query.internalName = values.internalName.trim()
  }

  if (values.creatureSpeciesId) {
    query.creatureSpeciesId = values.creatureSpeciesId
  }

  return query
}

function toFormValues(record?: CreatureRecord | null): FormValues {
  return {
    id: stringifyId(record?.id),
    name: typeof record?.name === 'string' ? record.name : '',
    internalName: typeof record?.internalName === 'string' ? record.internalName : '',
    height: typeof record?.height === 'number' ? record.height : undefined,
    weight: typeof record?.weight === 'number' ? record.weight : undefined,
    baseExperience: typeof record?.baseExperience === 'number' ? record.baseExperience : undefined,
    sortingOrder: typeof record?.sortingOrder === 'number' ? record.sortingOrder : undefined,
    creatureSpeciesId: pickRelationId(record?.creatureSpecies),
  }
}

function toPayload(values: FormValues): CreatureUpsertInput {
  return {
    id: values.id,
    name: values.name.trim(),
    internalName: values.internalName.trim(),
    height: values.height ?? null,
    weight: values.weight ?? null,
    baseExperience: values.baseExperience ?? null,
    sortingOrder: values.sortingOrder ?? null,
    creatureSpeciesId: values.creatureSpeciesId ?? null,
  }
}

export default function DatasetCreaturePage() {
  const { message } = App.useApp()
  const [searchForm] = Form.useForm<SearchValues>()
  const [form] = Form.useForm<FormValues>()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [optionLoading, setOptionLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [rows, setRows] = useState<CreatureRecord[]>([])
  const [editingRow, setEditingRow] = useState<CreatureRecord | null>(null)
  const [query, setQuery] = useState<CreatureQuery>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [creatureSpeciesOptions, setCreatureSpeciesOptions] = useState<SelectOption[]>([])

  async function loadOptions() {
    setOptionLoading(true)
    try {
      const result = await getCreatureSpeciesPage({
        page: 1,
        size: 1000,
        sort: 'id,asc',
        query: {},
      })
      setCreatureSpeciesOptions(toSelectOptions(result.data?.rows ?? []))
    } finally {
      setOptionLoading(false)
    }
  }

  async function loadData(
    nextPage = page,
    nextPageSize = pageSize,
    nextQuery: CreatureQuery = query,
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
        const [speciesResult, result] = await Promise.all([
          getCreatureSpeciesPage({
            page: 1,
            size: 1000,
            sort: 'id,asc',
            query: {},
          }),
          getPage({
            page: 1,
            size: 10,
            sort: 'id,asc',
            query: {},
          }),
        ])
        setCreatureSpeciesOptions(toSelectOptions(speciesResult.data?.rows ?? []))
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

  function openEdit(record: CreatureRecord) {
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
        message.success('精灵已更新')
      } else {
        await createRow(payload)
        message.success('精灵已创建')
      }
      setModalOpen(false)
      setEditingRow(null)
      form.resetFields()
      await loadData(page, pageSize, query)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(record: CreatureRecord) {
    const id = stringifyId(record.id)
    if (!id) {
      return
    }

    await deleteRow(id)
    message.success('精灵已删除')
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

  const columns: ColumnsType<CreatureRecord> = [
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
      title: '身高',
      dataIndex: 'height',
      key: 'height',
      width: 120,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '体重',
      dataIndex: 'weight',
      key: 'weight',
      width: 120,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '基础经验',
      dataIndex: 'baseExperience',
      key: 'baseExperience',
      width: 180,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '排序顺序',
      dataIndex: 'sortingOrder',
      key: 'sortingOrder',
      width: 140,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '所属种族',
      dataIndex: 'creatureSpecies',
      key: 'creatureSpecies',
      width: 220,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: CreatureRecord) => (
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
          <Form.Item name="creatureSpeciesId" label="所属种族">
            <Select allowClear showSearch optionFilterProp="label" placeholder="请选择所属种族" options={creatureSpeciesOptions} loading={optionLoading} />
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

      <Table<CreatureRecord>
        rowKey={(record, index) => stringifyId(record.id) ?? stringifyId(record.internalName) ?? 'creature-' + index}
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
        scroll={{ x: 1460 }}
      />

      <Modal
        destroyOnHidden
        title={editingRow ? '编辑精灵' : '新增精灵'}
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
              <Form.Item name="height" label="身高">
                <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="请输入身高" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="weight" label="体重">
                <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="请输入体重" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="baseExperience" label="基础经验">
                <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="请输入基础经验" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="sortingOrder" label="排序顺序">
                <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="请输入排序顺序" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="creatureSpeciesId" label="所属种族" rules={[{ required: true, message: '请选择所属种族' }]}>
                <Select showSearch optionFilterProp="label" placeholder="请选择所属种族" options={creatureSpeciesOptions} loading={optionLoading} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  )
}
