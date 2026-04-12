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
import { listRows as listBerryFirmnessRows } from '../berry-firmness/service'
import { listRows as listTypeRows } from '../type/service'
import { createRow, deleteRow, getPage, updateRow } from './service'
import type { BerryRecord, BerryQuery, BerryUpsertInput } from './service'

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
  berryFirmnessId?: string
  naturalGiftTypeId?: string
}

type FormValues = {
  id?: string
  name: string
  internalName: string
  berryFirmnessId?: string
  naturalGiftTypeId?: string
  naturalGiftPower?: number
  growthTime?: number
  maxHarvest?: number
  bulk?: number
  smoothness?: number
  soilDryness?: number
}

function toSearchQuery(values: SearchValues): BerryQuery {
  const query: BerryQuery = {}

  if (values.name.trim()) {
    query.name = values.name.trim()
  }

  if (values.internalName.trim()) {
    query.internalName = values.internalName.trim()
  }

  if (values.berryFirmnessId) {
    query.berryFirmnessId = values.berryFirmnessId
  }

  if (values.naturalGiftTypeId) {
    query.naturalGiftTypeId = values.naturalGiftTypeId
  }

  return query
}

function toNumber(value: unknown) {
  return typeof value === 'number' ? value : undefined
}

function toFormValues(record?: BerryRecord | null): FormValues {
  return {
    id: toOptionalString(record?.id),
    name: typeof record?.name === 'string' ? record.name : '',
    internalName:
      typeof record?.internalName === 'string' ? record.internalName : '',
    berryFirmnessId: pickRelationId(record?.berryFirmness),
    naturalGiftTypeId: pickRelationId(record?.naturalGiftType),
    naturalGiftPower: toNumber(record?.naturalGiftPower),
    growthTime: toNumber(record?.growthTime),
    maxHarvest: toNumber(record?.maxHarvest),
    bulk: toNumber(record?.bulk),
    smoothness: toNumber(record?.smoothness),
    soilDryness: toNumber(record?.soilDryness),
  }
}

function toPayload(values: FormValues): BerryUpsertInput {
  const payload: BerryUpsertInput = {
    name: values.name.trim(),
    internalName: values.internalName.trim(),
    berryFirmnessId: values.berryFirmnessId ?? null,
    naturalGiftTypeId: values.naturalGiftTypeId ?? null,
    naturalGiftPower: values.naturalGiftPower ?? null,
    growthTime: values.growthTime ?? null,
    maxHarvest: values.maxHarvest ?? null,
    bulk: values.bulk ?? null,
    smoothness: values.smoothness ?? null,
    soilDryness: values.soilDryness ?? null,
  }

  if (values.id) {
    payload.id = values.id
  }

  return payload
}

export default function DatasetBerryPage() {
  const { message } = App.useApp()
  const [searchForm] = Form.useForm<SearchValues>()
  const [form] = Form.useForm<FormValues>()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [optionLoading, setOptionLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [rows, setRows] = useState<BerryRecord[]>([])
  const [editingRow, setEditingRow] = useState<BerryRecord | null>(null)
  const [query, setQuery] = useState<BerryQuery>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [berryFirmnessOptions, setBerryFirmnessOptions] = useState<
    SelectOption[]
  >([])
  const [typeOptions, setTypeOptions] = useState<SelectOption[]>([])

  async function loadOptions() {
    setOptionLoading(true)
    try {
      const [firmnessResult, typeResult] = await Promise.all([
        listBerryFirmnessRows(),
        listTypeRows(),
      ])
      setBerryFirmnessOptions(toSelectOptions(firmnessResult.data ?? []))
      setTypeOptions(toSelectOptions(typeResult.data ?? []))
    } finally {
      setOptionLoading(false)
    }
  }

  async function loadData(
    nextPage = page,
    nextPageSize = pageSize,
    nextQuery: BerryQuery = query,
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
        const [firmnessResult, typeResult, pageResult] = await Promise.all([
          listBerryFirmnessRows(),
          listTypeRows(),
          getPage({
            page: 1,
            size: 10,
            sort: 'id,asc',
            query: {},
          }),
        ])
        setBerryFirmnessOptions(toSelectOptions(firmnessResult.data ?? []))
        setTypeOptions(toSelectOptions(typeResult.data ?? []))
        setRows(pageResult.data?.rows ?? [])
        setTotal(pageResult.data?.totalRowCount ?? 0)
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

  function openEdit(record: BerryRecord) {
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
        message.success('树果已更新')
      } else {
        await createRow(payload)
        message.success('树果已创建')
      }
      setModalOpen(false)
      setEditingRow(null)
      form.resetFields()
      await loadData(page, pageSize, query)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(record: BerryRecord) {
    const id = toOptionalString(record.id)
    if (!id) {
      return
    }

    await deleteRow(id)
    message.success('树果已删除')
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

  const columns: ColumnsType<BerryRecord> = [
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
      title: '硬度',
      dataIndex: 'berryFirmness',
      key: 'berryFirmness',
      width: 160,
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
    },
    {
      title: '自然之恩属性',
      dataIndex: 'naturalGiftType',
      key: 'naturalGiftType',
      width: 180,
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
    },
    {
      title: '自然之恩威力',
      dataIndex: 'naturalGiftPower',
      key: 'naturalGiftPower',
      width: 140,
      ellipsis: true,
      render: (value: string | number | null | undefined) =>
        value === '' || value == null ? '-' : value,
    },
    {
      title: '生长时间',
      dataIndex: 'growthTime',
      key: 'growthTime',
      width: 140,
      ellipsis: true,
      render: (value: string | number | null | undefined) =>
        value === '' || value == null ? '-' : value,
    },
    {
      title: '最大结果数',
      dataIndex: 'maxHarvest',
      key: 'maxHarvest',
      width: 140,
      ellipsis: true,
      render: (value: string | number | null | undefined) =>
        value === '' || value == null ? '-' : value,
    },
    {
      title: '大小(mm)',
      dataIndex: 'bulk',
      key: 'bulk',
      width: 120,
      ellipsis: true,
      render: (value: string | number | null | undefined) =>
        value === '' || value == null ? '-' : value,
    },
    {
      title: '光滑度',
      dataIndex: 'smoothness',
      key: 'smoothness',
      width: 120,
      ellipsis: true,
      render: (value: string | number | null | undefined) =>
        value === '' || value == null ? '-' : value,
    },
    {
      title: '土壤干燥速度',
      dataIndex: 'soilDryness',
      key: 'soilDryness',
      width: 160,
      ellipsis: true,
      render: (value: string | number | null | undefined) =>
        value === '' || value == null ? '-' : value,
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: BerryRecord) => (
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
      title="树果管理"
      subTitle="对接后端树果分页接口，支持分页查询、新增、编辑和删除。"
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
          <Form.Item name="berryFirmnessId" label="硬度">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择硬度"
              loading={optionLoading}
              options={berryFirmnessOptions}
            />
          </Form.Item>
          <Form.Item name="naturalGiftTypeId" label="自然之恩属性">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择属性"
              loading={optionLoading}
              options={typeOptions}
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

      <Table<BerryRecord>
        rowKey={(record, index) =>
          toOptionalString(record.id) ??
          toOptionalString(record.internalName) ??
          'berry-' + index
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
        scroll={{ x: 1800 }}
      />

      <Modal
        destroyOnHidden
        title={editingRow ? '编辑树果' : '新增树果'}
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
              <Form.Item
                name="berryFirmnessId"
                label="硬度"
                rules={[{ required: true, message: '请选择硬度' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  placeholder="请选择硬度"
                  loading={optionLoading}
                  options={berryFirmnessOptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="naturalGiftTypeId"
                label="自然之恩属性"
                rules={[{ required: true, message: '请选择自然之恩属性' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  placeholder="请选择属性"
                  loading={optionLoading}
                  options={typeOptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="naturalGiftPower"
                label="自然之恩威力"
                rules={[{ required: true, message: '请输入自然之恩威力' }]}
              >
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入自然之恩威力"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="growthTime"
                label="生长时间(小时)"
                rules={[{ required: true, message: '请输入生长时间' }]}
              >
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入生长时间"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxHarvest"
                label="最大结果数"
                rules={[{ required: true, message: '请输入最大结果数' }]}
              >
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入最大结果数"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bulk"
                label="大小(mm)"
                rules={[{ required: true, message: '请输入大小' }]}
              >
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入大小"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="smoothness"
                label="光滑度"
                rules={[{ required: true, message: '请输入光滑度' }]}
              >
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入光滑度"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="soilDryness"
                label="土壤干燥速度"
                rules={[{ required: true, message: '请输入土壤干燥速度' }]}
              >
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入土壤干燥速度"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  )
}
