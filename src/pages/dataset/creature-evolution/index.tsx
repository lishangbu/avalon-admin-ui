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
import { getPage as getCreatureFormPage } from '../creature-form/service'
import { getPage as getCreatureSpeciesPage } from '../creature-species/service'
import { getPage as getEvolutionChainPage, type EvolutionChainRecord } from '../evolution-chain/service'
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

type BooleanSelectValue = 'true' | 'false'

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

const pageTitle = '进化条件管理'
const pageSubtitle = '对接后端进化条件分页接口，支持分页查询、新增、编辑和删除。'
const modalWidth = 'min(96vw, 1320px)'

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

function toBooleanSelectValue(value: boolean | null | undefined): BooleanSelectValue | undefined {
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

function normalizeNullableText(value: string) {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
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

function toEvolutionChainOptions(rows: EvolutionChainRecord[]) {
  return rows
    .map((row) => {
      const id = stringifyId(row.id)
      if (!id) {
        return null
      }

      const babyTriggerName =
        row.babyTriggerItem?.name?.trim() || row.babyTriggerItem?.internalName?.trim()

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
    id: stringifyId(record?.id),
    branchSortOrder:
      typeof record?.branchSortOrder === 'number' ? record.branchSortOrder : undefined,
    detailSortOrder:
      typeof record?.detailSortOrder === 'number' ? record.detailSortOrder : undefined,
    needsMultiplayer: toBooleanSelectValue(record?.needsMultiplayer),
    needsOverworldRain: toBooleanSelectValue(record?.needsOverworldRain),
    turnUpsideDown: toBooleanSelectValue(record?.turnUpsideDown),
    timeOfDay: typeof record?.timeOfDay === 'string' ? record.timeOfDay : '',
    minAffection: typeof record?.minAffection === 'number' ? record.minAffection : undefined,
    minBeauty: typeof record?.minBeauty === 'number' ? record.minBeauty : undefined,
    minDamageTaken:
      typeof record?.minDamageTaken === 'number' ? record.minDamageTaken : undefined,
    minHappiness:
      typeof record?.minHappiness === 'number' ? record.minHappiness : undefined,
    minLevel: typeof record?.minLevel === 'number' ? record.minLevel : undefined,
    minMoveCount:
      typeof record?.minMoveCount === 'number' ? record.minMoveCount : undefined,
    minSteps: typeof record?.minSteps === 'number' ? record.minSteps : undefined,
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
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [optionLoading, setOptionLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [rows, setRows] = useState<CreatureEvolutionRecord[]>([])
  const [editingRow, setEditingRow] = useState<CreatureEvolutionRecord | null>(null)
  const [query, setQuery] = useState<CreatureEvolutionQuery>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [evolutionChainOptions, setEvolutionChainOptions] = useState<SelectOption[]>([])
  const [creatureSpeciesOptions, setCreatureSpeciesOptions] = useState<SelectOption[]>([])
  const [itemOptions, setItemOptions] = useState<SelectOption[]>([])
  const [moveOptions, setMoveOptions] = useState<SelectOption[]>([])
  const [typeOptions, setTypeOptions] = useState<SelectOption[]>([])
  const [locationOptions, setLocationOptions] = useState<SelectOption[]>([])
  const [regionOptions, setRegionOptions] = useState<SelectOption[]>([])
  const [creatureFormOptions, setCreatureFormOptions] = useState<SelectOption[]>([])
  const [triggerOptions, setTriggerOptions] = useState<SelectOption[]>([])
  const [genderOptions, setGenderOptions] = useState<SelectOption[]>([])

  async function loadOptions() {
    setOptionLoading(true)
    try {
      const [
        evolutionChainResult,
        creatureSpeciesResult,
        itemResult,
        moveResult,
        typeResult,
        locationResult,
        regionResult,
        creatureFormResult,
        triggerResult,
        genderResult,
      ] = await Promise.all([
        getEvolutionChainPage({
          page: 1,
          size: 1000,
          sort: 'id,asc',
          query: {},
        }),
        getCreatureSpeciesPage({
          page: 1,
          size: 2500,
          sort: 'sortingOrder,asc',
          query: {},
        }),
        getItemPage({
          page: 1,
          size: 5000,
          sort: 'id,asc',
          query: {},
        }),
        getMovePage({
          page: 1,
          size: 5000,
          sort: 'id,asc',
          query: {},
        }),
        listTypeRows(),
        listLocationRows(),
        listRegionRows(),
        getCreatureFormPage({
          page: 1,
          size: 3000,
          sort: 'sortingOrder,asc',
          query: {},
        }),
        listEvolutionTriggerRows(),
        listGenderRows(),
      ])

      setEvolutionChainOptions(toEvolutionChainOptions(evolutionChainResult.data?.rows ?? []))
      setCreatureSpeciesOptions(toSelectOptions(creatureSpeciesResult.data?.rows ?? []))
      setItemOptions(toSelectOptions(itemResult.data?.rows ?? []))
      setMoveOptions(toSelectOptions(moveResult.data?.rows ?? []))
      setTypeOptions(toSelectOptions(typeResult.data ?? []))
      setLocationOptions(toSelectOptions(locationResult.data ?? []))
      setRegionOptions(toSelectOptions(regionResult.data ?? []))
      setCreatureFormOptions(toSelectOptions(creatureFormResult.data?.rows ?? []))
      setTriggerOptions(toSelectOptions(triggerResult.data ?? []))
      setGenderOptions(toSelectOptions(genderResult.data ?? []))
    } finally {
      setOptionLoading(false)
    }
  }

  async function loadData(
    nextPage = page,
    nextPageSize = pageSize,
    nextQuery: CreatureEvolutionQuery = query,
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
        const [
          evolutionChainResult,
          creatureSpeciesResult,
          itemResult,
          moveResult,
          typeResult,
          locationResult,
          regionResult,
          creatureFormResult,
          triggerResult,
          genderResult,
          result,
        ] = await Promise.all([
          getEvolutionChainPage({
            page: 1,
            size: 1000,
            sort: 'id,asc',
            query: {},
          }),
          getCreatureSpeciesPage({
            page: 1,
            size: 2500,
            sort: 'sortingOrder,asc',
            query: {},
          }),
          getItemPage({
            page: 1,
            size: 5000,
            sort: 'id,asc',
            query: {},
          }),
          getMovePage({
            page: 1,
            size: 5000,
            sort: 'id,asc',
            query: {},
          }),
          listTypeRows(),
          listLocationRows(),
          listRegionRows(),
          getCreatureFormPage({
            page: 1,
            size: 3000,
            sort: 'sortingOrder,asc',
            query: {},
          }),
          listEvolutionTriggerRows(),
          listGenderRows(),
          getPage({
            page: 1,
            size: 10,
            sort: 'id,asc',
            query: {},
          }),
        ])

        setEvolutionChainOptions(toEvolutionChainOptions(evolutionChainResult.data?.rows ?? []))
        setCreatureSpeciesOptions(toSelectOptions(creatureSpeciesResult.data?.rows ?? []))
        setItemOptions(toSelectOptions(itemResult.data?.rows ?? []))
        setMoveOptions(toSelectOptions(moveResult.data?.rows ?? []))
        setTypeOptions(toSelectOptions(typeResult.data ?? []))
        setLocationOptions(toSelectOptions(locationResult.data ?? []))
        setRegionOptions(toSelectOptions(regionResult.data ?? []))
        setCreatureFormOptions(toSelectOptions(creatureFormResult.data?.rows ?? []))
        setTriggerOptions(toSelectOptions(triggerResult.data ?? []))
        setGenderOptions(toSelectOptions(genderResult.data ?? []))
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
    const id = stringifyId(record.id)
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
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '目标种族',
      dataIndex: 'toCreatureSpecies',
      key: 'toCreatureSpecies',
      width: 180,
      fixed: 'left',
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '进化链',
      dataIndex: 'evolutionChain',
      key: 'evolutionChain',
      width: 150,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '触发方式',
      dataIndex: 'trigger',
      key: 'trigger',
      width: 160,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '最低等级',
      dataIndex: 'minLevel',
      key: 'minLevel',
      width: 110,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '使用道具',
      dataIndex: 'item',
      key: 'item',
      width: 160,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '携带道具',
      dataIndex: 'heldItem',
      key: 'heldItem',
      width: 160,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '地点',
      dataIndex: 'location',
      key: 'location',
      width: 160,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '时间段',
      dataIndex: 'timeOfDay',
      key: 'timeOfDay',
      width: 120,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '需要多人联机',
      dataIndex: 'needsMultiplayer',
      key: 'needsMultiplayer',
      width: 130,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: CreatureEvolutionRecord) => (
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
        rowKey={(record, index) => stringifyId(record.id) ?? `creature-evolution-${index}`}
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
                <InputNumber style={{ width: '100%' }} placeholder="请输入分支顺序" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="detailSortOrder" label="条件顺序">
                <InputNumber style={{ width: '100%' }} placeholder="请输入条件顺序" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minLevel" label="最低等级">
                <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="请输入最低等级" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minHappiness" label="最低亲密度">
                <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="请输入最低亲密度" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minAffection" label="最低亲密互动值">
                <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="请输入最低亲密互动值" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minBeauty" label="最低美丽值">
                <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="请输入最低美丽值" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minDamageTaken" label="最低承伤值">
                <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="请输入最低承伤值" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minMoveCount" label="最低招式使用次数">
                <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="请输入最低招式使用次数" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minSteps" label="最低步数">
                <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="请输入最低步数" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="relativePhysicalStats" label="物攻物防关系">
                <InputNumber min={-1} max={1} step={1} style={{ width: '100%' }} placeholder="请输入 -1 / 0 / 1" />
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
                <Select allowClear placeholder="请选择是否需要多人联机" options={booleanOptions} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="needsOverworldRain" label="需要大地图下雨">
                <Select allowClear placeholder="请选择是否需要大地图下雨" options={booleanOptions} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="turnUpsideDown" label="设备倒置">
                <Select allowClear placeholder="请选择是否需要设备倒置" options={booleanOptions} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  )
}
