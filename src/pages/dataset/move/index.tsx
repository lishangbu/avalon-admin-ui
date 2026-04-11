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

const pageTitle = '招式管理'
const pageSubtitle = '对接后端招式分页接口，支持分页查询、新增、编辑和删除。'
const modalWidth = 'min(96vw, 1080px)'

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

function pickRelationId(value: unknown) {
  if (!value || typeof value !== 'object') {
    return undefined
  }

  return stringifyId((value as Record<string, unknown>).id)
}

function pickStringField(record: MoveRecord | null | undefined, key: string) {
  const value = record ? (record as Record<string, unknown>)[key] : undefined
  return typeof value === 'string' ? value : ''
}

function pickNumberField(record: MoveRecord | null | undefined, key: string) {
  const value = record ? (record as Record<string, unknown>)[key] : undefined
  return typeof value === 'number' ? value : undefined
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
    id: stringifyId(record?.id),
    name: typeof record?.name === 'string' ? record.name : '',
    internalName:
      typeof record?.internalName === 'string' ? record.internalName : '',
    typeId: pickRelationId(record?.type),
    accuracy:
      typeof record?.accuracy === 'number'
        ? record.accuracy
        : pickNumberField(record, 'accuracy'),
    effectChance: pickNumberField(record, 'effectChance'),
    pp:
      typeof record?.pp === 'number'
        ? record.pp
        : pickNumberField(record, 'pp'),
    priority: pickNumberField(record, 'priority'),
    power:
      typeof record?.power === 'number'
        ? record.power
        : pickNumberField(record, 'power'),
    moveDamageClassId: pickRelationId(record?.moveDamageClass),
    moveTargetId: pickRelationId(record?.moveTarget),
    text: pickStringField(record, 'text'),
    shortEffect: pickStringField(record, 'shortEffect'),
    effect: pickStringField(record, 'effect'),
    moveCategoryId: pickRelationId(record?.moveCategory),
    moveAilmentId: pickRelationId(
      (record as Record<string, unknown> | undefined)?.moveAilment,
    ),
    minHits: pickNumberField(record, 'minHits'),
    maxHits: pickNumberField(record, 'maxHits'),
    minTurns: pickNumberField(record, 'minTurns'),
    maxTurns: pickNumberField(record, 'maxTurns'),
    drain: pickNumberField(record, 'drain'),
    healing: pickNumberField(record, 'healing'),
    critRate: pickNumberField(record, 'critRate'),
    ailmentChance: pickNumberField(record, 'ailmentChance'),
    flinchChance: pickNumberField(record, 'flinchChance'),
    statChance: pickNumberField(record, 'statChance'),
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
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [optionLoading, setOptionLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [rows, setRows] = useState<MoveRecord[]>([])
  const [editingRow, setEditingRow] = useState<MoveRecord | null>(null)
  const [query, setQuery] = useState<MoveQuery>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [typeOptions, setTypeOptions] = useState<SelectOption[]>([])
  const [moveDamageClassOptions, setMoveDamageClassOptions] = useState<
    SelectOption[]
  >([])
  const [moveTargetOptions, setMoveTargetOptions] = useState<SelectOption[]>([])
  const [moveCategoryOptions, setMoveCategoryOptions] = useState<
    SelectOption[]
  >([])
  const [moveAilmentOptions, setMoveAilmentOptions] = useState<SelectOption[]>(
    [],
  )

  async function loadOptions() {
    setOptionLoading(true)
    try {
      const [
        typeResult,
        moveDamageClassResult,
        moveTargetResult,
        moveCategoryResult,
        moveAilmentResult,
      ] = await Promise.all([
        listTypeRows(),
        listMoveDamageClassRows(),
        listMoveTargetRows(),
        listMoveCategoryRows(),
        listMoveAilmentRows(),
      ])
      setTypeOptions(toSelectOptions(typeResult.data ?? []))
      setMoveDamageClassOptions(
        toSelectOptions(moveDamageClassResult.data ?? []),
      )
      setMoveTargetOptions(toSelectOptions(moveTargetResult.data ?? []))
      setMoveCategoryOptions(toSelectOptions(moveCategoryResult.data ?? []))
      setMoveAilmentOptions(toSelectOptions(moveAilmentResult.data ?? []))
    } finally {
      setOptionLoading(false)
    }
  }

  async function loadData(
    nextPage = page,
    nextPageSize = pageSize,
    nextQuery: MoveQuery = query,
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
          typeResult,
          moveDamageClassResult,
          moveTargetResult,
          moveCategoryResult,
          moveAilmentResult,
          result,
        ] = await Promise.all([
          listTypeRows(),
          listMoveDamageClassRows(),
          listMoveTargetRows(),
          listMoveCategoryRows(),
          listMoveAilmentRows(),
          getPage({
            page: 1,
            size: 10,
            sort: 'id,asc',
            query: {},
          }),
        ])
        setTypeOptions(toSelectOptions(typeResult.data ?? []))
        setMoveDamageClassOptions(
          toSelectOptions(moveDamageClassResult.data ?? []),
        )
        setMoveTargetOptions(toSelectOptions(moveTargetResult.data ?? []))
        setMoveCategoryOptions(toSelectOptions(moveCategoryResult.data ?? []))
        setMoveAilmentOptions(toSelectOptions(moveAilmentResult.data ?? []))
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
    const id = stringifyId(record.id)
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
      title: '属性',
      dataIndex: 'type',
      key: 'type',
      width: 160,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '威力',
      dataIndex: 'power',
      key: 'power',
      width: 120,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '命中率',
      dataIndex: 'accuracy',
      key: 'accuracy',
      width: 120,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: 'PP',
      dataIndex: 'pp',
      key: 'pp',
      width: 100,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '伤害类别',
      dataIndex: 'moveDamageClass',
      key: 'moveDamageClass',
      width: 180,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '目标',
      dataIndex: 'moveTarget',
      key: 'moveTarget',
      width: 180,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '分类',
      dataIndex: 'moveCategory',
      key: 'moveCategory',
      width: 180,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
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
          stringifyId(record.id) ??
          stringifyId(record.internalName) ??
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
