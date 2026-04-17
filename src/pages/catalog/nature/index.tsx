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
  Select,
  Space,
  Table,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
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

type SummaryLike = {
  id?: string | null
  name?: string | null
  internalName?: string | null
}

type SummaryValue = SummaryLike | string | null | undefined

function toOptionalString(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return undefined
  }

  return String(value)
}

function getSummaryLabel(value: SummaryValue) {
  if (!value) {
    return undefined
  }

  if (typeof value === 'string') {
    const normalized = value.trim()
    return normalized || undefined
  }

  const name = value.name?.trim()
  if (name) {
    return name
  }

  const internalName = value.internalName?.trim()
  if (internalName) {
    return internalName
  }

  const id = toOptionalString(value.id)
  return id ? `#${id}` : undefined
}

function renderSummaryCell(value: SummaryValue) {
  return getSummaryLabel(value) ?? '-'
}

function pickRelationId(value: unknown) {
  if (!value || typeof value !== 'object') {
    return undefined
  }

  return toOptionalString((value as { id?: string | null }).id)
}

function toSelectOptions<T extends SummaryLike>(
  rows: readonly T[],
): SelectOption[] {
  return rows
    .map((row) => {
      const value = toOptionalString(row.id)
      if (!value) {
        return undefined
      }

      const label = getSummaryLabel(row) ?? `#${value}`

      return {
        label,
        value,
      }
    })
    .filter((item): item is SelectOption => Boolean(item))
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
    id: toOptionalString(record?.id),
    name: typeof record?.name === 'string' ? record.name : '',
    internalName:
      typeof record?.internalName === 'string' ? record.internalName : '',
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
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<NatureRecord | null>(null)
  const [query, setQuery] = useState<NatureQuery>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const statQuery = useQuery({
    queryKey: ['dataset', 'stat', 'list'],
    queryFn: () => listStatRows(),
  })
  const berryFlavorQuery = useQuery({
    queryKey: ['dataset', 'berry-flavor', 'list'],
    queryFn: () => listBerryFlavorRows(),
  })
  const rowsQuery = useQuery({
    queryKey: ['dataset', 'nature', 'list', query],
    queryFn: () => listRows(query),
  })

  const loading = rowsQuery.isFetching
  const optionLoading = statQuery.isFetching || berryFlavorQuery.isFetching
  const rows = rowsQuery.data ?? []
  const total = rows.length
  const statOptions = toSelectOptions(statQuery.data ?? [])
  const berryFlavorOptions = toSelectOptions(berryFlavorQuery.data ?? [])

  async function loadData(nextQuery: NatureQuery = query) {
    const isSameQuery = JSON.stringify(nextQuery) === JSON.stringify(query)

    if (!isSameQuery) {
      await queryClient.ensureQueryData({
        queryKey: ['dataset', 'nature', 'list', nextQuery],
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
    const id = toOptionalString(record.id)
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
      title: '提升能力',
      dataIndex: 'increasedStat',
      key: 'increasedStat',
      width: 180,
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
    },
    {
      title: '降低能力',
      dataIndex: 'decreasedStat',
      key: 'decreasedStat',
      width: 180,
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
    },
    {
      title: '喜欢风味',
      dataIndex: 'likesBerryFlavor',
      key: 'likesBerryFlavor',
      width: 180,
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
    },
    {
      title: '讨厌风味',
      dataIndex: 'hatesBerryFlavor',
      key: 'hatesBerryFlavor',
      width: 180,
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: NatureRecord) => (
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
      title="性格管理"
      subTitle="对接后端性格接口，支持列表查询、新增、编辑和删除。"
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
          loading={loading || optionLoading}
          onClick={() =>
            void Promise.all([
              statQuery.refetch(),
              berryFlavorQuery.refetch(),
              rowsQuery.refetch(),
            ])
          }
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
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择提升能力"
              options={statOptions}
              loading={optionLoading}
            />
          </Form.Item>
          <Form.Item name="decreasedStatId" label="降低能力">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择降低能力"
              options={statOptions}
              loading={optionLoading}
            />
          </Form.Item>
          <Form.Item name="likesBerryFlavorId" label="喜欢风味">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择喜欢风味"
              options={berryFlavorOptions}
              loading={optionLoading}
            />
          </Form.Item>
          <Form.Item name="hatesBerryFlavorId" label="讨厌风味">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择讨厌风味"
              options={berryFlavorOptions}
              loading={optionLoading}
            />
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
        rowKey={(record, index) =>
          toOptionalString(record.id) ??
          toOptionalString(record.internalName) ??
          'nature-' + index
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
        scroll={{ x: 1500 }}
      />

      <Modal
        destroyOnHidden
        title={editingRow ? '编辑性格' : '新增性格'}
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
              <Form.Item
                name="increasedStatId"
                label="提升能力"
                rules={[{ required: true, message: '请选择提升能力' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  placeholder="请选择提升能力"
                  options={statOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="decreasedStatId"
                label="降低能力"
                rules={[{ required: true, message: '请选择降低能力' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  placeholder="请选择降低能力"
                  options={statOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="likesBerryFlavorId"
                label="喜欢风味"
                rules={[{ required: true, message: '请选择喜欢风味' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  placeholder="请选择喜欢风味"
                  options={berryFlavorOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="hatesBerryFlavorId"
                label="讨厌风味"
                rules={[{ required: true, message: '请选择讨厌风味' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  placeholder="请选择讨厌风味"
                  options={berryFlavorOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  )
}
