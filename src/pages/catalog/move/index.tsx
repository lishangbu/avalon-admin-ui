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
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useState } from 'react'
import { listRows as listMoveAilmentRows } from '../move-ailment/service'
import { listRows as listMoveCategoryRows } from '../move-category/service'
import { listRows as listMoveDamageClassRows } from '../move-damage-class/service'
import { listRows as listMoveTargetRows } from '../move-target/service'
import { listRows as listTypeRows } from '../type/service'
import {
  createRow,
  deleteRow,
  getPage,
  updateRow,
  type MoveQuery,
  type MoveRecord,
  type MoveUpsertInput,
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
  typeId?: string
  moveDamageClassId?: string
}

type FormValues = {
  id?: string
  name: string
  internalName: string
  typeId?: string
  accuracy?: number
  effectChance?: number
  pp?: number
  priority?: number
  power?: number
  moveDamageClassId?: string
  moveTargetId?: string
  text: string
  shortEffect: string
  effect: string
  moveCategoryId?: string
  moveAilmentId?: string
  minHits?: number
  maxHits?: number
  minTurns?: number
  maxTurns?: number
  drain?: number
  healing?: number
  critRate?: number
  ailmentChance?: number
  flinchChance?: number
  statChance?: number
}

function toSearchQuery(values: SearchValues): MoveQuery {
  const query: MoveQuery = {}

  if (values.name.trim()) {
    query.name = values.name.trim()
  }

  if (values.internalName.trim()) {
    query.internalName = values.internalName.trim()
  }

  if (values.typeId) {
    query.typeId = values.typeId
  }

  if (values.moveDamageClassId) {
    query.moveDamageClassId = values.moveDamageClassId
  }

  return query
}

function toFormValues(record?: MoveRecord | null): FormValues {
  return {
    id: toOptionalString(record?.id),
    name: typeof record?.name === 'string' ? record.name : '',
    internalName:
      typeof record?.internalName === 'string' ? record.internalName : '',
    typeId: pickRelationId(record?.type),
    accuracy:
      typeof record?.accuracy === 'number' ? record.accuracy : undefined,
    effectChance:
      typeof record?.effectChance === 'number'
        ? record.effectChance
        : undefined,
    pp: typeof record?.pp === 'number' ? record.pp : undefined,
    priority:
      typeof record?.priority === 'number' ? record.priority : undefined,
    power: typeof record?.power === 'number' ? record.power : undefined,
    moveDamageClassId: pickRelationId(record?.moveDamageClass),
    moveTargetId: pickRelationId(record?.moveTarget),
    text: typeof record?.text === 'string' ? record.text : '',
    shortEffect:
      typeof record?.shortEffect === 'string' ? record.shortEffect : '',
    effect: typeof record?.effect === 'string' ? record.effect : '',
    moveCategoryId: pickRelationId(record?.moveCategory),
    moveAilmentId: pickRelationId(record?.moveAilment),
    minHits: typeof record?.minHits === 'number' ? record.minHits : undefined,
    maxHits: typeof record?.maxHits === 'number' ? record.maxHits : undefined,
    minTurns:
      typeof record?.minTurns === 'number' ? record.minTurns : undefined,
    maxTurns:
      typeof record?.maxTurns === 'number' ? record.maxTurns : undefined,
    drain: typeof record?.drain === 'number' ? record.drain : undefined,
    healing: typeof record?.healing === 'number' ? record.healing : undefined,
    critRate:
      typeof record?.critRate === 'number' ? record.critRate : undefined,
    ailmentChance:
      typeof record?.ailmentChance === 'number'
        ? record.ailmentChance
        : undefined,
    flinchChance:
      typeof record?.flinchChance === 'number'
        ? record.flinchChance
        : undefined,
    statChance:
      typeof record?.statChance === 'number' ? record.statChance : undefined,
  }
}

function toPayload(values: FormValues): MoveUpsertInput {
  return {
    id: values.id,
    name: values.name.trim(),
    internalName: values.internalName.trim(),
    typeId: values.typeId ?? null,
    accuracy: values.accuracy ?? null,
    effectChance: values.effectChance ?? null,
    pp: values.pp ?? null,
    priority: values.priority ?? null,
    power: values.power ?? null,
    moveDamageClassId: values.moveDamageClassId ?? null,
    moveTargetId: values.moveTargetId ?? null,
    text: values.text.trim(),
    shortEffect: values.shortEffect.trim(),
    effect: values.effect.trim(),
    moveCategoryId: values.moveCategoryId ?? null,
    moveAilmentId: values.moveAilmentId ?? null,
    minHits: values.minHits ?? null,
    maxHits: values.maxHits ?? null,
    minTurns: values.minTurns ?? null,
    maxTurns: values.maxTurns ?? null,
    drain: values.drain ?? null,
    healing: values.healing ?? null,
    critRate: values.critRate ?? null,
    ailmentChance: values.ailmentChance ?? null,
    flinchChance: values.flinchChance ?? null,
    statChance: values.statChance ?? null,
  }
}

export default function DatasetMovePage() {
  const { message } = App.useApp()
  const [searchForm] = Form.useForm<SearchValues>()
  const [form] = Form.useForm<FormValues>()
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<MoveRecord | null>(null)
  const [query, setQuery] = useState<MoveQuery>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const typeQuery = useQuery({
    queryKey: ['dataset', 'type', 'list'],
    queryFn: () => listTypeRows(),
  })
  const moveDamageClassQuery = useQuery({
    queryKey: ['dataset', 'move-damage-class', 'list'],
    queryFn: () => listMoveDamageClassRows(),
  })
  const moveTargetQuery = useQuery({
    queryKey: ['dataset', 'move-target', 'list'],
    queryFn: () => listMoveTargetRows(),
  })
  const moveCategoryQuery = useQuery({
    queryKey: ['dataset', 'move-category', 'list'],
    queryFn: () => listMoveCategoryRows(),
  })
  const moveAilmentQuery = useQuery({
    queryKey: ['dataset', 'move-ailment', 'list'],
    queryFn: () => listMoveAilmentRows(),
  })
  const rowsQuery = useQuery({
    queryKey: ['dataset', 'move', 'page', page, pageSize, query],
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
    typeQuery,
    moveDamageClassQuery,
    moveTargetQuery,
    moveCategoryQuery,
    moveAilmentQuery,
  ] as const
  const loading = rowsQuery.isFetching
  const optionLoading = optionQueries.some(
    (currentQuery) => currentQuery.isFetching,
  )
  const rows = rowsQuery.data?.items ?? []
  const total = rowsQuery.data?.totalItems ?? 0
  const typeOptions = toSelectOptions(typeQuery.data ?? [])
  const moveDamageClassOptions = toSelectOptions(
    moveDamageClassQuery.data ?? [],
  )
  const moveTargetOptions = toSelectOptions(moveTargetQuery.data ?? [])
  const moveCategoryOptions = toSelectOptions(moveCategoryQuery.data ?? [])
  const moveAilmentOptions = toSelectOptions(moveAilmentQuery.data ?? [])

  async function loadData(
    nextPage = page,
    nextPageSize = pageSize,
    nextQuery: MoveQuery = query,
  ) {
    const isSameQuery =
      nextPage === page &&
      nextPageSize === pageSize &&
      JSON.stringify(nextQuery) === JSON.stringify(query)

    if (!isSameQuery) {
      await queryClient.ensureQueryData({
        queryKey: [
          'dataset',
          'move',
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

  function openEdit(record: MoveRecord) {
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
        message.success('招式已更新')
      } else {
        await createRow(payload)
        message.success('招式已创建')
      }
      setModalOpen(false)
      setEditingRow(null)
      form.resetFields()
      await loadData(page, pageSize, query)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(record: MoveRecord) {
    const id = toOptionalString(record.id)
    if (!id) {
      return
    }

    await deleteRow(id)
    message.success('招式已删除')
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

  const columns: ColumnsType<MoveRecord> = [
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
      title: '属性',
      dataIndex: 'type',
      key: 'type',
      width: 160,
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
    },
    {
      title: '威力',
      dataIndex: 'power',
      key: 'power',
      width: 120,
      ellipsis: true,
      render: (value: string | number | null | undefined) =>
        value === '' || value == null ? '-' : value,
    },
    {
      title: '命中率',
      dataIndex: 'accuracy',
      key: 'accuracy',
      width: 120,
      ellipsis: true,
      render: (value: string | number | null | undefined) =>
        value === '' || value == null ? '-' : value,
    },
    {
      title: 'PP',
      dataIndex: 'pp',
      key: 'pp',
      width: 100,
      ellipsis: true,
      render: (value: string | number | null | undefined) =>
        value === '' || value == null ? '-' : value,
    },
    {
      title: '伤害类别',
      dataIndex: 'moveDamageClass',
      key: 'moveDamageClass',
      width: 180,
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
    },
    {
      title: '目标',
      dataIndex: 'moveTarget',
      key: 'moveTarget',
      width: 180,
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
    },
    {
      title: '分类',
      dataIndex: 'moveCategory',
      key: 'moveCategory',
      width: 180,
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: MoveRecord) => (
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
      title="招式管理"
      subTitle="对接后端招式分页接口，支持分页查询、新增、编辑和删除。"
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
          <Form.Item name="name" label="名称">
            <Input allowClear placeholder="请输入名称" />
          </Form.Item>
          <Form.Item name="internalName" label="内部名称">
            <Input allowClear placeholder="请输入内部名称" />
          </Form.Item>
          <Form.Item name="typeId" label="属性">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择属性"
              options={typeOptions}
              loading={optionLoading}
            />
          </Form.Item>
          <Form.Item name="moveDamageClassId" label="伤害类别">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择伤害类别"
              options={moveDamageClassOptions}
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

      <Table<MoveRecord>
        rowKey={(record, index) =>
          toOptionalString(record.id) ??
          toOptionalString(record.internalName) ??
          'move-' + index
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
        scroll={{ x: 1700 }}
      />

      <Modal
        destroyOnHidden
        title={editingRow ? '编辑招式' : '新增招式'}
        open={modalOpen}
        width="min(96vw, 1080px)"
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
              <Form.Item name="typeId" label="属性">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择属性"
                  options={typeOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="moveDamageClassId" label="伤害类别">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择伤害类别"
                  options={moveDamageClassOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="moveTargetId" label="目标">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择目标"
                  options={moveTargetOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="moveCategoryId" label="分类">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择分类"
                  options={moveCategoryOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="moveAilmentId" label="异常状态">
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择异常状态"
                  options={moveAilmentOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="power" label="威力">
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入威力"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="accuracy" label="命中率">
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入命中率"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="pp" label="PP">
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入 PP"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="优先级">
                <InputNumber
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入优先级"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="effectChance" label="效果触发概率">
                <InputNumber
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入效果触发概率"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minHits" label="最少命中次数">
                <InputNumber
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入最少命中次数"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maxHits" label="最多命中次数">
                <InputNumber
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入最多命中次数"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minTurns" label="最少回合数">
                <InputNumber
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入最少回合数"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maxTurns" label="最多回合数">
                <InputNumber
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入最多回合数"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="drain" label="吸收">
                <InputNumber
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入吸收值"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="healing" label="治疗">
                <InputNumber
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入治疗值"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="critRate" label="暴击速率">
                <InputNumber
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入暴击速率"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ailmentChance" label="异常状态概率">
                <InputNumber
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入异常状态概率"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="flinchChance" label="畏缩概率">
                <InputNumber
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入畏缩概率"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="statChance" label="能力变化概率">
                <InputNumber
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入能力变化概率"
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
              <Form.Item name="effect" label="效果">
                <Input.TextArea
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  placeholder="请输入效果"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="text" label="文本">
                <Input.TextArea
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  placeholder="请输入文本"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  )
}
