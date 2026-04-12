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
import { useEffect, useState } from 'react'
import { listRows as listItemPocketRows } from '../item-pocket/service'
import {
  createRow,
  deleteRow,
  listRows,
  updateRow,
  type ItemCategoryQuery,
  type ItemCategoryRecord,
  type ItemCategoryUpsertInput,
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
  itemPocketId?: string
}

type FormValues = {
  id?: string
  name: string
  internalName: string
  itemPocketId?: string
}

function toSearchQuery(values: SearchValues): ItemCategoryQuery {
  const query: ItemCategoryQuery = {}

  if (values.name.trim()) {
    query.name = values.name.trim()
  }

  if (values.internalName.trim()) {
    query.internalName = values.internalName.trim()
  }

  if (values.itemPocketId) {
    query.itemPocketId = values.itemPocketId
  }

  return query
}

function toFormValues(record?: ItemCategoryRecord | null): FormValues {
  return {
    id: toOptionalString(record?.id),
    name: typeof record?.name === 'string' ? record.name : '',
    internalName:
      typeof record?.internalName === 'string' ? record.internalName : '',
    itemPocketId: pickRelationId(record?.itemPocket),
  }
}

function toPayload(values: FormValues): ItemCategoryUpsertInput {
  return {
    id: values.id,
    name: values.name.trim(),
    internalName: values.internalName.trim(),
    itemPocketId: values.itemPocketId ?? null,
  }
}

export default function DatasetItemCategoryPage() {
  const { message } = App.useApp()
  const [searchForm] = Form.useForm<SearchValues>()
  const [form] = Form.useForm<FormValues>()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [optionLoading, setOptionLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [rows, setRows] = useState<ItemCategoryRecord[]>([])
  const [editingRow, setEditingRow] = useState<ItemCategoryRecord | null>(null)
  const [query, setQuery] = useState<ItemCategoryQuery>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [itemPocketOptions, setItemPocketOptions] = useState<SelectOption[]>([])

  const total = rows.length

  async function loadOptions() {
    setOptionLoading(true)
    try {
      const result = await listItemPocketRows()
      setItemPocketOptions(toSelectOptions(result.data ?? []))
    } finally {
      setOptionLoading(false)
    }
  }

  async function loadData(nextQuery: ItemCategoryQuery = query) {
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
        const [itemPocketResult, result] = await Promise.all([
          listItemPocketRows(),
          listRows({}),
        ])
        setItemPocketOptions(toSelectOptions(itemPocketResult.data ?? []))
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

  function openEdit(record: ItemCategoryRecord) {
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
        message.success('道具类别已更新')
      } else {
        await createRow(payload)
        message.success('道具类别已创建')
      }
      setModalOpen(false)
      setEditingRow(null)
      form.resetFields()
      await loadData(query)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(record: ItemCategoryRecord) {
    const id = toOptionalString(record.id)
    if (!id) {
      return
    }

    await deleteRow(id)
    message.success('道具类别已删除')
    await loadData(query)
  }

  function handleSearchSubmit(values: SearchValues) {
    void loadData(toSearchQuery(values))
  }

  function handleResetSearch() {
    searchForm.resetFields()
    void loadData({})
  }

  const columns: ColumnsType<ItemCategoryRecord> = [
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
      title: '所属口袋',
      dataIndex: 'itemPocket',
      key: 'itemPocket',
      width: 180,
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: ItemCategoryRecord) => (
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
      title="道具类别管理"
      subTitle="对接后端道具类别接口，支持列表查询、新增、编辑和删除。"
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
          <Form.Item name="itemPocketId" label="所属口袋">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择所属口袋"
              options={itemPocketOptions}
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

      <Table<ItemCategoryRecord>
        rowKey={(record, index) =>
          toOptionalString(record.id) ??
          toOptionalString(record.internalName) ??
          'item-category-' + index
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
        scroll={{ x: 1080 }}
      />

      <Modal
        destroyOnHidden
        title={editingRow ? '编辑道具类别' : '新增道具类别'}
        open={modalOpen}
        width="min(92vw, 520px)"
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
                name="itemPocketId"
                label="所属口袋"
                rules={[{ required: true, message: '请选择所属口袋' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  placeholder="请选择所属口袋"
                  options={itemPocketOptions}
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
