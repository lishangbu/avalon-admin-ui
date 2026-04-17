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
  Tag,
  Table,
} from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useState } from 'react'
import { getPage as getCreatureFormPage } from '../creature-form/service'
import { getPage as getCreatureSpeciesPage } from '../creature-species/service'
import {
  getPage as getEvolutionChainPage,
  type EvolutionChainRecord,
} from '../evolution-chain/service'
import { listRows as listEvolutionTriggerRows } from '../evolution-trigger/service'
import { listRows as listGenderRows } from '../gender/service'
import { getPage as getItemPage } from '../item/service'
import { listRows as listLocationRows } from '../location/service'
import { getPage as getMovePage } from '../move/service'
import { listRows as listRegionRows } from '../region/service'
import { listRows as listTypeRows } from '../type/service'
import {
  createRow,
  deleteRow,
  getPage,
  updateRow,
  type CreatureEvolutionQuery,
  type CreatureEvolutionRecord,
  type CreatureEvolutionUpsertInput,
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

type BooleanSelectValue = 'true' | 'false'

function toBooleanSelectValue(value: unknown): BooleanSelectValue | undefined {
  if (value === true) {
    return 'true'
  }

  if (value === false) {
    return 'false'
  }

  return undefined
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

function normalizeNullableText(value: string | null | undefined) {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

type SearchValues = {
  evolutionChainId?: string
  fromCreatureSpeciesId?: string
  toCreatureSpeciesId?: string
  triggerId?: string
  itemId?: string
  locationId?: string
}

type FormValues = {
  id?: string
  branchSortOrder?: number
  detailSortOrder?: number
  needsMultiplayer?: BooleanSelectValue
  needsOverworldRain?: BooleanSelectValue
  turnUpsideDown?: BooleanSelectValue
  timeOfDay: string
  minAffection?: number
  minBeauty?: number
  minDamageTaken?: number
  minHappiness?: number
  minLevel?: number
  minMoveCount?: number
  minSteps?: number
  relativePhysicalStats?: number
  genderId?: string
  baseVariantId?: string
  regionId?: string
  evolutionChainId?: string
  fromCreatureSpeciesId?: string
  toCreatureSpeciesId?: string
  heldItemId?: string
  itemId?: string
  knownMoveId?: string
  knownMoveTypeId?: string
  locationId?: string
  partyCreatureSpeciesId?: string
  partyTypeId?: string
  tradeCreatureSpeciesId?: string
  triggerId?: string
  usedMoveId?: string
}

const booleanOptions: { label: string; value: BooleanSelectValue }[] = [
  { label: '是', value: 'true' },
  { label: '否', value: 'false' },
]

function renderBooleanCell(value: boolean | null | undefined) {
  if (value === null || value === undefined) {
    return '-'
  }

  return value ? <Tag color="green">是</Tag> : <Tag>否</Tag>
}

function toEvolutionChainOptions(rows: EvolutionChainRecord[]) {
  return rows
    .map((row) => {
      const id = toOptionalString(row.id)
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

function toSearchQuery(values: SearchValues): CreatureEvolutionQuery {
  const query: CreatureEvolutionQuery = {}

  if (values.evolutionChainId) {
    query.evolutionChainId = values.evolutionChainId
  }

  if (values.fromCreatureSpeciesId) {
    query.fromCreatureSpeciesId = values.fromCreatureSpeciesId
  }

  if (values.toCreatureSpeciesId) {
    query.toCreatureSpeciesId = values.toCreatureSpeciesId
  }

  if (values.triggerId) {
    query.triggerId = values.triggerId
  }

  if (values.itemId) {
    query.itemId = values.itemId
  }

  if (values.locationId) {
    query.locationId = values.locationId
  }

  return query
}

function toFormValues(record?: CreatureEvolutionRecord | null): FormValues {
  return {
    id: toOptionalString(record?.id),
    branchSortOrder:
      typeof record?.branchSortOrder === 'number'
        ? record.branchSortOrder
        : undefined,
    detailSortOrder:
      typeof record?.detailSortOrder === 'number'
        ? record.detailSortOrder
        : undefined,
    needsMultiplayer: toBooleanSelectValue(record?.needsMultiplayer),
    needsOverworldRain: toBooleanSelectValue(record?.needsOverworldRain),
    turnUpsideDown: toBooleanSelectValue(record?.turnUpsideDown),
    timeOfDay: typeof record?.timeOfDay === 'string' ? record.timeOfDay : '',
    minAffection:
      typeof record?.minAffection === 'number'
        ? record.minAffection
        : undefined,
    minBeauty:
      typeof record?.minBeauty === 'number' ? record.minBeauty : undefined,
    minDamageTaken:
      typeof record?.minDamageTaken === 'number'
        ? record.minDamageTaken
        : undefined,
    minHappiness:
      typeof record?.minHappiness === 'number'
        ? record.minHappiness
        : undefined,
    minLevel:
      typeof record?.minLevel === 'number' ? record.minLevel : undefined,
    minMoveCount:
      typeof record?.minMoveCount === 'number'
        ? record.minMoveCount
        : undefined,
    minSteps:
      typeof record?.minSteps === 'number' ? record.minSteps : undefined,
    relativePhysicalStats:
      typeof record?.relativePhysicalStats === 'number'
        ? record.relativePhysicalStats
        : undefined,
    genderId: pickRelationId(record?.gender),
    baseVariantId: pickRelationId(record?.baseVariant),
    regionId: pickRelationId(record?.region),
    evolutionChainId: pickRelationId(record?.evolutionChain),
    fromCreatureSpeciesId: pickRelationId(record?.fromCreatureSpecies),
    toCreatureSpeciesId: pickRelationId(record?.toCreatureSpecies),
    heldItemId: pickRelationId(record?.heldItem),
    itemId: pickRelationId(record?.item),
    knownMoveId: pickRelationId(record?.knownMove),
    knownMoveTypeId: pickRelationId(record?.knownMoveType),
    locationId: pickRelationId(record?.location),
    partyCreatureSpeciesId: pickRelationId(record?.partyCreatureSpecies),
    partyTypeId: pickRelationId(record?.partyType),
    tradeCreatureSpeciesId: pickRelationId(record?.tradeCreatureSpecies),
    triggerId: pickRelationId(record?.trigger),
    usedMoveId: pickRelationId(record?.usedMove),
  }
}

function toPayload(values: FormValues): CreatureEvolutionUpsertInput {
  return {
    id: values.id,
    branchSortOrder: values.branchSortOrder ?? null,
    detailSortOrder: values.detailSortOrder ?? null,
    needsMultiplayer: fromBooleanSelectValue(values.needsMultiplayer),
    needsOverworldRain: fromBooleanSelectValue(values.needsOverworldRain),
    turnUpsideDown: fromBooleanSelectValue(values.turnUpsideDown),
    timeOfDay: normalizeNullableText(values.timeOfDay),
    minAffection: values.minAffection ?? null,
    minBeauty: values.minBeauty ?? null,
    minDamageTaken: values.minDamageTaken ?? null,
    minHappiness: values.minHappiness ?? null,
    minLevel: values.minLevel ?? null,
    minMoveCount: values.minMoveCount ?? null,
    minSteps: values.minSteps ?? null,
    relativePhysicalStats: values.relativePhysicalStats ?? null,
    genderId: values.genderId ?? null,
    baseVariantId: values.baseVariantId ?? null,
    regionId: values.regionId ?? null,
    evolutionChainId: values.evolutionChainId ?? null,
    fromCreatureSpeciesId: values.fromCreatureSpeciesId ?? null,
    toCreatureSpeciesId: values.toCreatureSpeciesId ?? null,
    heldItemId: values.heldItemId ?? null,
    itemId: values.itemId ?? null,
    knownMoveId: values.knownMoveId ?? null,
    knownMoveTypeId: values.knownMoveTypeId ?? null,
    locationId: values.locationId ?? null,
    partyCreatureSpeciesId: values.partyCreatureSpeciesId ?? null,
    partyTypeId: values.partyTypeId ?? null,
    tradeCreatureSpeciesId: values.tradeCreatureSpeciesId ?? null,
    triggerId: values.triggerId ?? null,
    usedMoveId: values.usedMoveId ?? null,
  }
}

export default function DatasetCreatureEvolutionPage() {
  const { message } = App.useApp()
  const [searchForm] = Form.useForm<SearchValues>()
  const [form] = Form.useForm<FormValues>()
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<CreatureEvolutionRecord | null>(
    null,
  )
  const [query, setQuery] = useState<CreatureEvolutionQuery>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const evolutionChainQuery = useQuery({
    queryKey: ['dataset', 'evolution-chain', 'page', 'options'],
    queryFn: () =>
      getEvolutionChainPage({
        page: 1,
        size: 1000,
        sort: 'id,asc',
        query: {},
      }),
  })
  const creatureSpeciesQuery = useQuery({
    queryKey: ['dataset', 'creature-species', 'page', 'options', 'evolution'],
    queryFn: () =>
      getCreatureSpeciesPage({
        page: 1,
        size: 2500,
        sort: 'sortingOrder,asc',
        query: {},
      }),
  })
  const itemQuery = useQuery({
    queryKey: ['dataset', 'item', 'page', 'options', 'evolution'],
    queryFn: () =>
      getItemPage({
        page: 1,
        size: 5000,
        sort: 'id,asc',
        query: {},
      }),
  })
  const moveQuery = useQuery({
    queryKey: ['dataset', 'move', 'page', 'options', 'evolution'],
    queryFn: () =>
      getMovePage({
        page: 1,
        size: 5000,
        sort: 'id,asc',
        query: {},
      }),
  })
  const typeQuery = useQuery({
    queryKey: ['dataset', 'type', 'list'],
    queryFn: () => listTypeRows(),
  })
  const locationQuery = useQuery({
    queryKey: ['dataset', 'location', 'list'],
    queryFn: () => listLocationRows(),
  })
  const regionQuery = useQuery({
    queryKey: ['dataset', 'region', 'list'],
    queryFn: () => listRegionRows(),
  })
  const creatureFormQuery = useQuery({
    queryKey: ['dataset', 'creature-form', 'page', 'options', 'evolution'],
    queryFn: () =>
      getCreatureFormPage({
        page: 1,
        size: 3000,
        sort: 'sortingOrder,asc',
        query: {},
      }),
  })
  const triggerQuery = useQuery({
    queryKey: ['dataset', 'evolution-trigger', 'list'],
    queryFn: () => listEvolutionTriggerRows(),
  })
  const genderQuery = useQuery({
    queryKey: ['dataset', 'gender', 'list'],
    queryFn: () => listGenderRows(),
  })
  const rowsQuery = useQuery({
    queryKey: ['dataset', 'creature-evolution', 'page', page, pageSize, query],
    queryFn: () =>
      getPage({
        page,
        size: pageSize,
        sort: 'id,asc',
        query,
      }),
    placeholderData: keepPreviousData,
  })

  const optionQueries = [
    evolutionChainQuery,
    creatureSpeciesQuery,
    itemQuery,
    moveQuery,
    typeQuery,
    locationQuery,
    regionQuery,
    creatureFormQuery,
    triggerQuery,
    genderQuery,
  ] as const
  const loading = rowsQuery.isFetching
  const optionLoading = optionQueries.some(
    (currentQuery) => currentQuery.isFetching,
  )
  const rows = rowsQuery.data?.items ?? []
  const total = rowsQuery.data?.totalItems ?? 0
  const evolutionChainOptions = toEvolutionChainOptions(
    evolutionChainQuery.data?.items ?? [],
  )
  const creatureSpeciesOptions = toSelectOptions(
    creatureSpeciesQuery.data?.items ?? [],
  )
  const itemOptions = toSelectOptions(itemQuery.data?.items ?? [])
  const moveOptions = toSelectOptions(moveQuery.data?.items ?? [])
  const typeOptions = toSelectOptions(typeQuery.data ?? [])
  const locationOptions = toSelectOptions(locationQuery.data ?? [])
  const regionOptions = toSelectOptions(regionQuery.data ?? [])
  const creatureFormOptions = toSelectOptions(
    creatureFormQuery.data?.items ?? [],
  )
  const triggerOptions = toSelectOptions(triggerQuery.data ?? [])
  const genderOptions = toSelectOptions(genderQuery.data ?? [])

  async function loadData(
    nextPage = page,
    nextPageSize = pageSize,
    nextQuery: CreatureEvolutionQuery = query,
  ) {
    const isSameQuery =
      nextPage === page &&
      nextPageSize === pageSize &&
      JSON.stringify(nextQuery) === JSON.stringify(query)

    if (!isSameQuery) {
      await queryClient.ensureQueryData({
        queryKey: [
          'dataset',
          'creature-evolution',
          'page',
          nextPage,
          nextPageSize,
          nextQuery,
        ],
        queryFn: () =>
          getPage({
            page: nextPage,
            size: nextPageSize,
            sort: 'id,asc',
            query: nextQuery,
          }),
      })
      setQuery(nextQuery)
      setPage(nextPage)
      setPageSize(nextPageSize)
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

  function openEdit(record: CreatureEvolutionRecord) {
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
        message.success('进化条件已更新')
      } else {
        await createRow(payload)
        message.success('进化条件已创建')
      }
      setModalOpen(false)
      setEditingRow(null)
      form.resetFields()
      await loadData(page, pageSize, query)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(record: CreatureEvolutionRecord) {
    const id = toOptionalString(record.id)
    if (!id) {
      return
    }

    await deleteRow(id)
    message.success('进化条件已删除')
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

  const columns: ColumnsType<CreatureEvolutionRecord> = [
    {
      title: '起始种族',
      dataIndex: 'fromCreatureSpecies',
      key: 'fromCreatureSpecies',
      width: 180,
      fixed: 'left',
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
    },
    {
      title: '目标种族',
      dataIndex: 'toCreatureSpecies',
      key: 'toCreatureSpecies',
      width: 180,
      fixed: 'left',
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
    },
    {
      title: '进化链',
      dataIndex: 'evolutionChain',
      key: 'evolutionChain',
      width: 150,
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
    },
    {
      title: '触发方式',
      dataIndex: 'trigger',
      key: 'trigger',
      width: 160,
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
    },
    {
      title: '最低等级',
      dataIndex: 'minLevel',
      key: 'minLevel',
      width: 110,
      ellipsis: true,
      render: (value: string | number | null | undefined) =>
        value === '' || value == null ? '-' : value,
    },
    {
      title: '使用道具',
      dataIndex: 'item',
      key: 'item',
      width: 160,
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
    },
    {
      title: '携带道具',
      dataIndex: 'heldItem',
      key: 'heldItem',
      width: 160,
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
    },
    {
      title: '地点',
      dataIndex: 'location',
      key: 'location',
      width: 160,
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
    },
    {
      title: '时间段',
      dataIndex: 'timeOfDay',
      key: 'timeOfDay',
      width: 120,
      ellipsis: true,
      render: (value: string | number | null | undefined) =>
        value === '' || value == null ? '-' : value,
    },
    {
      title: '需要多人联机',
      dataIndex: 'needsMultiplayer',
      key: 'needsMultiplayer',
      width: 130,
      ellipsis: true,
      render: (value: boolean | null | undefined) => renderBooleanCell(value),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: CreatureEvolutionRecord) => (
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
      title="进化条件管理"
      subTitle="对接后端进化条件分页接口，支持分页查询、新增、编辑和删除。"
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
              ...optionQueries.map((currentQuery) => currentQuery.refetch()),
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
          <Form.Item name="fromCreatureSpeciesId" label="起始种族">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择起始种族"
              options={creatureSpeciesOptions}
              loading={optionLoading}
            />
          </Form.Item>
          <Form.Item name="toCreatureSpeciesId" label="目标种族">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择目标种族"
              options={creatureSpeciesOptions}
              loading={optionLoading}
            />
          </Form.Item>
          <Form.Item name="triggerId" label="触发方式">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择触发方式"
              options={triggerOptions}
              loading={optionLoading}
            />
          </Form.Item>
          <Form.Item name="itemId" label="使用道具">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择使用道具"
              options={itemOptions}
              loading={optionLoading}
            />
          </Form.Item>
          <Form.Item name="locationId" label="地点">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择地点"
              options={locationOptions}
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

      <Table<CreatureEvolutionRecord>
        rowKey={(record, index) =>
          toOptionalString(record.id) ?? `creature-evolution-${index}`
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
        scroll={{ x: 1850 }}
      />

      <Modal
        destroyOnHidden
        title={editingRow ? '编辑进化条件' : '新增进化条件'}
        open={modalOpen}
        width="min(96vw, 1320px)"
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
                name="evolutionChainId"
                label="进化链"
                rules={[{ required: true, message: '请选择进化链' }]}
              >
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
              <Form.Item
                name="triggerId"
                label="触发方式"
                rules={[{ required: true, message: '请选择触发方式' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择触发方式"
                  options={triggerOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fromCreatureSpeciesId"
                label="起始种族"
                rules={[{ required: true, message: '请选择起始种族' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择起始种族"
                  options={creatureSpeciesOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="toCreatureSpeciesId"
                label="目标种族"
                rules={[{ required: true, message: '请选择目标种族' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择目标种族"
                  options={creatureSpeciesOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="branchSortOrder" label="分支顺序">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入分支顺序"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="detailSortOrder" label="条件顺序">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入条件顺序"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minLevel" label="最低等级">
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入最低等级"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minHappiness" label="最低亲密度">
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入最低亲密度"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minAffection" label="最低亲密互动值">
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入最低亲密互动值"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minBeauty" label="最低美丽值">
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入最低美丽值"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minDamageTaken" label="最低承伤值">
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入最低承伤值"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minMoveCount" label="最低招式使用次数">
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入最低招式使用次数"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minSteps" label="最低步数">
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入最低步数"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="relativePhysicalStats" label="物攻物防关系">
                <InputNumber
                  min={-1}
                  max={1}
                  step={1}
                  style={{ width: '100%' }}
                  placeholder="请输入 -1 / 0 / 1"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="timeOfDay" label="时间段">
                <Input allowClear placeholder="例如：day / night" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="genderId" label="性别">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择性别"
                  options={genderOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="baseVariantId" label="基础形态">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择基础形态"
                  options={creatureFormOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="regionId" label="地区">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择地区"
                  options={regionOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="locationId" label="地点">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择地点"
                  options={locationOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="itemId" label="使用道具">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择使用道具"
                  options={itemOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="heldItemId" label="携带道具">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择携带道具"
                  options={itemOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="knownMoveId" label="已学会招式">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择已学会招式"
                  options={moveOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="usedMoveId" label="使用招式">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择使用招式"
                  options={moveOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="knownMoveTypeId" label="已学会招式属性">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择已学会招式属性"
                  options={typeOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="partyTypeId" label="队伍属性">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择队伍属性"
                  options={typeOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="partyCreatureSpeciesId" label="队伍种族">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择队伍种族"
                  options={creatureSpeciesOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tradeCreatureSpeciesId" label="交换种族">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择交换种族"
                  options={creatureSpeciesOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="needsMultiplayer" label="需要多人联机">
                <Select
                  allowClear
                  placeholder="请选择是否需要多人联机"
                  options={booleanOptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="needsOverworldRain" label="需要大地图下雨">
                <Select
                  allowClear
                  placeholder="请选择是否需要大地图下雨"
                  options={booleanOptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="turnUpsideDown" label="设备倒置">
                <Select
                  allowClear
                  placeholder="请选择是否需要设备倒置"
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
