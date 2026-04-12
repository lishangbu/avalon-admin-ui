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
} from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { listRows as listItemAttributeRows } from '../item-attribute/service'
import { listRows as listItemFlingEffectRows } from '../item-fling-effect/service'
import {
  createRow,
  deleteRow,
  getPage,
  updateRow,
  type ItemQuery,
  type ItemRecord,
  type ItemUpsertInput,
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

function pickRelationIds(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => pickRelationId(item))
    .filter((item): item is string => Boolean(item))
}

type SearchValues = {
  name: string
  internalName: string
  itemFlingEffectId?: string
}

type FormValues = {
  id?: string
  name: string
  internalName: string
  cost?: number
  flingPower?: number
  itemFlingEffectId?: string
  itemAttributeIds?: string[]
  shortEffect: string
  effect: string
  text: string
}

function toSearchQuery(values: SearchValues): ItemQuery {
  const query: ItemQuery = {}

  if (values.name.trim()) {
    query.name = values.name.trim()
  }

  if (values.internalName.trim()) {
    query.internalName = values.internalName.trim()
  }

  if (values.itemFlingEffectId) {
    query.itemFlingEffectId = values.itemFlingEffectId
  }

  return query
}

function toFormValues(record?: ItemRecord | null): FormValues {
  return {
    id: toOptionalString(record?.id),
    name: typeof record?.name === 'string' ? record.name : '',
    internalName:
      typeof record?.internalName === 'string' ? record.internalName : '',
    cost: typeof record?.cost === 'number' ? record.cost : undefined,
    flingPower:
      typeof record?.flingPower === 'number' ? record.flingPower : undefined,
    itemFlingEffectId: pickRelationId(record?.itemFlingEffect),
    itemAttributeIds: pickRelationIds(record?.itemAttributes),
    shortEffect:
      typeof record?.shortEffect === 'string' ? record.shortEffect : '',
    effect: typeof record?.effect === 'string' ? record.effect : '',
    text: typeof record?.text === 'string' ? record.text : '',
  }
}

function toPayload(values: FormValues): ItemUpsertInput {
  return {
    id: values.id,
    name: values.name.trim(),
    internalName: values.internalName.trim(),
    cost: values.cost ?? null,
    flingPower: values.flingPower ?? null,
    itemFlingEffectId: values.itemFlingEffectId ?? null,
    itemAttributeIds: values.itemAttributeIds ?? [],
    shortEffect: values.shortEffect.trim(),
    effect: values.effect.trim(),
    text: values.text.trim(),
  }
}

export default function DatasetItemPage() {
  const { message } = App.useApp()
  const [searchForm] = Form.useForm<SearchValues>()
  const [form] = Form.useForm<FormValues>()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [optionLoading, setOptionLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [rows, setRows] = useState<ItemRecord[]>([])
  const [editingRow, setEditingRow] = useState<ItemRecord | null>(null)
  const [query, setQuery] = useState<ItemQuery>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [itemFlingEffectOptions, setItemFlingEffectOptions] = useState<
    SelectOption[]
  >([])
  const [itemAttributeOptions, setItemAttributeOptions] = useState<
    SelectOption[]
  >([])

  async function loadOptions() {
    setOptionLoading(true)
    try {
      const [itemFlingEffectResult, itemAttributeResult] = await Promise.all([
        listItemFlingEffectRows(),
        listItemAttributeRows(),
      ])
      setItemFlingEffectOptions(
        toSelectOptions(itemFlingEffectResult.data ?? []),
      )
      setItemAttributeOptions(toSelectOptions(itemAttributeResult.data ?? []))
    } finally {
      setOptionLoading(false)
    }
  }

  async function loadData(
    nextPage = page,
    nextPageSize = pageSize,
    nextQuery: ItemQuery = query,
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
        const [itemFlingEffectResult, itemAttributeResult, result] =
          await Promise.all([
            listItemFlingEffectRows(),
            listItemAttributeRows(),
            getPage({
              page: 1,
              size: 10,
              sort: 'id,asc',
              query: {},
            }),
          ])
        setItemFlingEffectOptions(
          toSelectOptions(itemFlingEffectResult.data ?? []),
        )
        setItemAttributeOptions(toSelectOptions(itemAttributeResult.data ?? []))
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

  function openEdit(record: ItemRecord) {
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
        message.success('道具已更新')
      } else {
        await createRow(payload)
        message.success('道具已创建')
      }
      setModalOpen(false)
      setEditingRow(null)
      form.resetFields()
      await loadData(page, pageSize, query)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(record: ItemRecord) {
    const id = toOptionalString(record.id)
    if (!id) {
      return
    }

    await deleteRow(id)
    message.success('道具已删除')
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

  const columns: ColumnsType<ItemRecord> = [
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
      title: '价格',
      dataIndex: 'cost',
      key: 'cost',
      width: 120,
      ellipsis: true,
      render: (value: string | number | null | undefined) =>
        value === '' || value == null ? '-' : value,
    },
    {
      title: '投掷威力',
      dataIndex: 'flingPower',
      key: 'flingPower',
      width: 180,
      ellipsis: true,
      render: (value: string | number | null | undefined) =>
        value === '' || value == null ? '-' : value,
    },
    {
      title: '投掷效果',
      dataIndex: 'itemFlingEffect',
      key: 'itemFlingEffect',
      width: 180,
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
    },
    {
      title: '道具属性',
      dataIndex: 'itemAttributes',
      key: 'itemAttributes',
      width: 240,
      ellipsis: true,
      render: (value: readonly SummaryValue[] | null | undefined) => {
        if (!value?.length) {
          return '-'
        }

        const labels = value
          .map((item) => getSummaryLabel(item))
          .filter((item): item is string => Boolean(item))

        return labels.length > 0 ? labels.join(', ') : '-'
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: ItemRecord) => (
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
      title="道具管理"
      subTitle="对接后端道具分页接口，支持分页查询、新增、编辑和删除。"
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
            void Promise.all([loadOptions(), loadData(page, pageSize, query)])
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
          <Form.Item name="itemFlingEffectId" label="投掷效果">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择投掷效果"
              options={itemFlingEffectOptions}
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

      <Table<ItemRecord>
        rowKey={(record, index) =>
          toOptionalString(record.id) ??
          toOptionalString(record.internalName) ??
          'item-' + index
        }
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
        scroll={{ x: 1400 }}
      />

      <Modal
        destroyOnHidden
        title={editingRow ? '编辑道具' : '新增道具'}
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
            <Col span={12}>
              <Form.Item
                name="name"
                label="名称"
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Input allowClear placeholder="请输入名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="internalName"
                label="内部名称"
                rules={[{ required: true, message: '请输入内部名称' }]}
              >
                <Input allowClear placeholder="请输入内部名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="cost" label="价格">
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入价格"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="flingPower" label="投掷威力">
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入投掷威力"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="itemFlingEffectId" label="投掷效果">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择投掷效果"
                  options={itemFlingEffectOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="itemAttributeIds" label="道具属性">
                <Select
                  mode="multiple"
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择道具属性"
                  options={itemAttributeOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="shortEffect" label="简称效果">
                <Input.TextArea
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  placeholder="请输入简称效果"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="effect" label="效果说明">
                <Input.TextArea
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  placeholder="请输入效果说明"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="text" label="额外文本">
                <Input.TextArea
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  placeholder="请输入额外文本"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  )
}
