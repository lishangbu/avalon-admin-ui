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
import { listRows as listCreatureColorRows } from '../creature-color/service'
import { listRows as listCreatureHabitatRows } from '../creature-habitat/service'
import { listRows as listCreatureShapeRows } from '../creature-shape/service'
import {
  getPage as getEvolutionChainPage,
  type EvolutionChainRecord,
} from '../evolution-chain/service'
import { listRows as listGrowthRateRows } from '../growth-rate/service'
import {
  createRow,
  deleteRow,
  getPage,
  updateRow,
  type CreatureSpeciesQuery,
  type CreatureSpeciesRecord,
  type CreatureSpeciesUpsertInput,
} from './service'

type SelectOption = {
  label: string
  value: string
}

type BooleanSelectValue = 'true' | 'false'

type SearchValues = {
  name: string
  internalName: string
  growthRateId?: string
  creatureColorId?: string
  creatureHabitatId?: string
  creatureShapeId?: string
  evolutionChainId?: string
  evolvesFromSpeciesId?: string
}

type FormValues = {
  id?: string
  name: string
  internalName: string
  sortingOrder?: number
  genderRate?: number
  captureRate?: number
  baseHappiness?: number
  baby?: BooleanSelectValue
  legendary?: BooleanSelectValue
  mythical?: BooleanSelectValue
  hatchCounter?: number
  hasGenderDifferences?: BooleanSelectValue
  formsSwitchable?: BooleanSelectValue
  evolvesFromSpeciesId?: string
  evolutionChainId?: string
  growthRateId?: string
  creatureColorId?: string
  creatureHabitatId?: string
  creatureShapeId?: string
}

const pageTitle = '精灵种族管理'
const pageSubtitle =
  '对接后端精灵种族分页接口，支持分页查询、新增、编辑和删除。'
const modalWidth = 'min(96vw, 980px)'

const booleanOptions: { label: string; value: BooleanSelectValue }[] = [
  { label: '是', value: 'true' },
  { label: '否', value: 'false' },
]

function stringifyId(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return undefined
  }

  return String(value)
}

function toBooleanSelectValue(
  value: boolean | null | undefined,
): BooleanSelectValue | undefined {
  if (typeof value !== 'boolean') {
    return undefined
  }

  return value ? 'true' : 'false'
}

function fromBooleanSelectValue(value: BooleanSelectValue | undefined) {
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }
  return null
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

function toSelectOptions<
  T extends {
    id?: unknown
    name?: string | null
    internalName?: string | null
  },
>(rows: T[]) {
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

function toEvolutionChainOptions(rows: EvolutionChainRecord[]) {
  return rows
    .map((row) => {
      const id = stringifyId(row.id)
      if (!id) {
        return null
      }

      const babyTriggerName =
        row.babyTriggerItem?.name?.trim() ||
        row.babyTriggerItem?.internalName?.trim()

      return {
        label: babyTriggerName ? `#${id} (${babyTriggerName})` : `#${id}`,
        value: id,
      }
    })
    .filter((item): item is SelectOption => Boolean(item))
}

function pickRelationId(value: unknown) {
  if (!value || typeof value !== 'object') {
    return undefined
  }

  return stringifyId((value as Record<string, unknown>).id)
}

function toSearchQuery(values: SearchValues): CreatureSpeciesQuery {
  const query: CreatureSpeciesQuery = {}

  if (values.name.trim()) {
    query.name = values.name.trim()
  }

  if (values.internalName.trim()) {
    query.internalName = values.internalName.trim()
  }

  if (values.growthRateId) {
    query.growthRateId = values.growthRateId
  }

  if (values.creatureColorId) {
    query.creatureColorId = values.creatureColorId
  }

  if (values.creatureHabitatId) {
    query.creatureHabitatId = values.creatureHabitatId
  }

  if (values.creatureShapeId) {
    query.creatureShapeId = values.creatureShapeId
  }

  if (values.evolutionChainId) {
    query.evolutionChainId = values.evolutionChainId
  }

  if (values.evolvesFromSpeciesId) {
    query.evolvesFromSpeciesId = values.evolvesFromSpeciesId
  }

  return query
}

function toFormValues(record?: CreatureSpeciesRecord | null): FormValues {
  return {
    id: stringifyId(record?.id),
    name: typeof record?.name === 'string' ? record.name : '',
    internalName:
      typeof record?.internalName === 'string' ? record.internalName : '',
    sortingOrder:
      typeof record?.sortingOrder === 'number'
        ? record.sortingOrder
        : undefined,
    genderRate:
      typeof record?.genderRate === 'number' ? record.genderRate : undefined,
    captureRate:
      typeof record?.captureRate === 'number' ? record.captureRate : undefined,
    baseHappiness:
      typeof record?.baseHappiness === 'number'
        ? record.baseHappiness
        : undefined,
    baby: toBooleanSelectValue(record?.baby),
    legendary: toBooleanSelectValue(record?.legendary),
    mythical: toBooleanSelectValue(record?.mythical),
    hatchCounter:
      typeof record?.hatchCounter === 'number'
        ? record.hatchCounter
        : undefined,
    hasGenderDifferences: toBooleanSelectValue(record?.hasGenderDifferences),
    formsSwitchable: toBooleanSelectValue(record?.formsSwitchable),
    evolvesFromSpeciesId:
      pickRelationId(record?.evolvesFromSpecies) ??
      stringifyId(record?.evolvesFromSpeciesId),
    evolutionChainId:
      pickRelationId(record?.evolutionChain) ??
      stringifyId(record?.evolutionChainId),
    growthRateId: pickRelationId(record?.growthRate),
    creatureColorId: pickRelationId(record?.creatureColor),
    creatureHabitatId: pickRelationId(record?.creatureHabitat),
    creatureShapeId: pickRelationId(record?.creatureShape),
  }
}

function toPayload(values: FormValues): CreatureSpeciesUpsertInput {
  return {
    id: values.id,
    name: values.name.trim(),
    internalName: values.internalName.trim(),
    sortingOrder: values.sortingOrder ?? null,
    genderRate: values.genderRate ?? null,
    captureRate: values.captureRate ?? null,
    baseHappiness: values.baseHappiness ?? null,
    baby: fromBooleanSelectValue(values.baby),
    legendary: fromBooleanSelectValue(values.legendary),
    mythical: fromBooleanSelectValue(values.mythical),
    hatchCounter: values.hatchCounter ?? null,
    hasGenderDifferences: fromBooleanSelectValue(values.hasGenderDifferences),
    formsSwitchable: fromBooleanSelectValue(values.formsSwitchable),
    evolvesFromSpeciesId: values.evolvesFromSpeciesId ?? null,
    evolutionChainId: values.evolutionChainId ?? null,
    growthRateId: values.growthRateId ?? null,
    creatureColorId: values.creatureColorId ?? null,
    creatureHabitatId: values.creatureHabitatId ?? null,
    creatureShapeId: values.creatureShapeId ?? null,
  }
}

export default function DatasetCreatureSpeciesPage() {
  const { message } = App.useApp()
  const [searchForm] = Form.useForm<SearchValues>()
  const [form] = Form.useForm<FormValues>()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [optionLoading, setOptionLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [rows, setRows] = useState<CreatureSpeciesRecord[]>([])
  const [editingRow, setEditingRow] = useState<CreatureSpeciesRecord | null>(
    null,
  )
  const [query, setQuery] = useState<CreatureSpeciesQuery>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [growthRateOptions, setGrowthRateOptions] = useState<SelectOption[]>([])
  const [creatureColorOptions, setCreatureColorOptions] = useState<
    SelectOption[]
  >([])
  const [creatureHabitatOptions, setCreatureHabitatOptions] = useState<
    SelectOption[]
  >([])
  const [creatureShapeOptions, setCreatureShapeOptions] = useState<
    SelectOption[]
  >([])
  const [creatureSpeciesOptions, setCreatureSpeciesOptions] = useState<
    SelectOption[]
  >([])
  const [evolutionChainOptions, setEvolutionChainOptions] = useState<
    SelectOption[]
  >([])

  async function loadOptions() {
    setOptionLoading(true)
    try {
      const [
        growthRateResult,
        creatureColorResult,
        creatureHabitatResult,
        creatureShapeResult,
        creatureSpeciesResult,
        evolutionChainResult,
      ] = await Promise.all([
        listGrowthRateRows(),
        listCreatureColorRows(),
        listCreatureHabitatRows(),
        listCreatureShapeRows(),
        getPage({
          page: 1,
          size: 2000,
          sort: 'sortingOrder,asc',
          query: {},
        }),
        getEvolutionChainPage({
          page: 1,
          size: 1000,
          sort: 'id,asc',
          query: {},
        }),
      ])

      setGrowthRateOptions(toSelectOptions(growthRateResult.data ?? []))
      setCreatureColorOptions(toSelectOptions(creatureColorResult.data ?? []))
      setCreatureHabitatOptions(
        toSelectOptions(creatureHabitatResult.data ?? []),
      )
      setCreatureShapeOptions(toSelectOptions(creatureShapeResult.data ?? []))
      setCreatureSpeciesOptions(
        toSelectOptions(creatureSpeciesResult.data?.rows ?? []),
      )
      setEvolutionChainOptions(
        toEvolutionChainOptions(evolutionChainResult.data?.rows ?? []),
      )
    } finally {
      setOptionLoading(false)
    }
  }

  async function loadData(
    nextPage = page,
    nextPageSize = pageSize,
    nextQuery: CreatureSpeciesQuery = query,
  ) {
    setLoading(true)
    try {
      const result = await getPage({
        page: nextPage,
        size: nextPageSize,
        sort: 'sortingOrder,asc',
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
        const [
          growthRateResult,
          creatureColorResult,
          creatureHabitatResult,
          creatureShapeResult,
          creatureSpeciesResult,
          evolutionChainResult,
          result,
        ] = await Promise.all([
          listGrowthRateRows(),
          listCreatureColorRows(),
          listCreatureHabitatRows(),
          listCreatureShapeRows(),
          getPage({
            page: 1,
            size: 2000,
            sort: 'sortingOrder,asc',
            query: {},
          }),
          getEvolutionChainPage({
            page: 1,
            size: 1000,
            sort: 'id,asc',
            query: {},
          }),
          getPage({
            page: 1,
            size: 10,
            sort: 'sortingOrder,asc',
            query: {},
          }),
        ])

        setGrowthRateOptions(toSelectOptions(growthRateResult.data ?? []))
        setCreatureColorOptions(toSelectOptions(creatureColorResult.data ?? []))
        setCreatureHabitatOptions(
          toSelectOptions(creatureHabitatResult.data ?? []),
        )
        setCreatureShapeOptions(toSelectOptions(creatureShapeResult.data ?? []))
        setCreatureSpeciesOptions(
          toSelectOptions(creatureSpeciesResult.data?.rows ?? []),
        )
        setEvolutionChainOptions(
          toEvolutionChainOptions(evolutionChainResult.data?.rows ?? []),
        )
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

  function openEdit(record: CreatureSpeciesRecord) {
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
        message.success('精灵种族已更新')
      } else {
        await createRow(payload)
        message.success('精灵种族已创建')
      }
      setModalOpen(false)
      setEditingRow(null)
      form.resetFields()
      await loadData(page, pageSize, query)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(record: CreatureSpeciesRecord) {
    const id = stringifyId(record.id)
    if (!id) {
      return
    }

    await deleteRow(id)
    message.success('精灵种族已删除')
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

  const columns: ColumnsType<CreatureSpeciesRecord> = [
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
      title: '成长速度',
      dataIndex: 'growthRate',
      key: 'growthRate',
      width: 160,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '颜色',
      dataIndex: 'creatureColor',
      key: 'creatureColor',
      width: 180,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '栖息地',
      dataIndex: 'creatureHabitat',
      key: 'creatureHabitat',
      width: 160,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '形状',
      dataIndex: 'creatureShape',
      key: 'creatureShape',
      width: 140,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '排序顺序',
      dataIndex: 'sortingOrder',
      key: 'sortingOrder',
      width: 120,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '前置进化种族',
      key: 'evolvesFromSpecies',
      width: 180,
      ellipsis: true,
      render: (_: unknown, record) =>
        renderDatasetValue(
          record.evolvesFromSpecies ?? record.evolvesFromSpeciesId,
        ),
    },
    {
      title: '进化链',
      key: 'evolutionChain',
      width: 140,
      ellipsis: true,
      render: (_: unknown, record) =>
        renderDatasetValue(record.evolutionChain ?? record.evolutionChainId),
    },
    {
      title: '传说',
      dataIndex: 'legendary',
      key: 'legendary',
      width: 100,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '幻兽',
      dataIndex: 'mythical',
      key: 'mythical',
      width: 100,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: CreatureSpeciesRecord) => (
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
      title={pageTitle}
      subTitle={pageSubtitle}
      extra={[
        <Button
          key="create"
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreate}
        >
          {`新增${pageTitle.replace(/管理$/, '')}`}
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
          <Form.Item name="growthRateId" label="成长速度">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择成长速度"
              options={growthRateOptions}
              loading={optionLoading}
            />
          </Form.Item>
          <Form.Item name="creatureColorId" label="颜色">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择颜色"
              options={creatureColorOptions}
              loading={optionLoading}
            />
          </Form.Item>
          <Form.Item name="creatureHabitatId" label="栖息地">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择栖息地"
              options={creatureHabitatOptions}
              loading={optionLoading}
            />
          </Form.Item>
          <Form.Item name="creatureShapeId" label="形状">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择形状"
              options={creatureShapeOptions}
              loading={optionLoading}
            />
          </Form.Item>
          <Form.Item name="evolutionChainId" label="进化链">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择进化链"
              options={evolutionChainOptions}
              loading={optionLoading}
            />
          </Form.Item>
          <Form.Item name="evolvesFromSpeciesId" label="前置进化种族">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择前置进化种族"
              options={creatureSpeciesOptions}
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

      <Table<CreatureSpeciesRecord>
        rowKey={(record, index) =>
          stringifyId(record.id) ??
          stringifyId(record.internalName) ??
          `creature-species-${index}`
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
          showTotal: (count) => `共 ${count} 条`,
        }}
        scroll={{ x: 1900 }}
      />

      <Modal
        destroyOnHidden
        title={editingRow ? '编辑精灵种族' : '新增精灵种族'}
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
              <Form.Item name="growthRateId" label="成长速度">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择成长速度"
                  options={growthRateOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="creatureColorId" label="颜色">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择颜色"
                  options={creatureColorOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="creatureHabitatId" label="栖息地">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择栖息地"
                  options={creatureHabitatOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="creatureShapeId" label="形状">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择形状"
                  options={creatureShapeOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="evolvesFromSpeciesId" label="前置进化种族">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择前置进化种族"
                  options={creatureSpeciesOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="evolutionChainId" label="进化链">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择进化链"
                  options={evolutionChainOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sortingOrder" label="排序顺序">
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入排序顺序"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="genderRate" label="性别比率">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入性别比率"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="captureRate" label="捕获率">
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入捕获率"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="baseHappiness" label="基础亲密度">
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入基础亲密度"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="hatchCounter" label="孵化计数器">
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入孵化计数器"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="baby" label="幼年种">
                <Select
                  allowClear
                  placeholder="请选择是否为幼年种"
                  options={booleanOptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="legendary" label="传说">
                <Select
                  allowClear
                  placeholder="请选择是否为传说"
                  options={booleanOptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="mythical" label="幻兽">
                <Select
                  allowClear
                  placeholder="请选择是否为幻兽"
                  options={booleanOptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="hasGenderDifferences" label="性别差异">
                <Select
                  allowClear
                  placeholder="请选择是否存在性别差异"
                  options={booleanOptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="formsSwitchable" label="形态可切换">
                <Select
                  allowClear
                  placeholder="请选择是否可切换形态"
                  options={booleanOptions}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  )
}
