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
import { listRows as listCreatureRows } from '../creature/service'
import {
  createRow,
  deleteRow,
  getPage,
  updateRow,
  type CreatureFormQuery,
  type CreatureFormRecord,
  type CreatureFormUpsertInput,
} from './service'

type SelectOption = {
  label: string
  value: string
}

type BooleanSelectValue = 'true' | 'false'

type SearchValues = {
  name: string
  internalName: string
  formName: string
  creatureId?: string
}

type FormValues = {
  id?: string
  name: string
  internalName: string
  creatureId?: string
  formName: string
  formOrder?: number
  sortingOrder?: number
  defaultForm?: BooleanSelectValue
  battleOnly?: BooleanSelectValue
  mega?: BooleanSelectValue
  frontDefault: string
  frontFemale: string
  frontShiny: string
  frontShinyFemale: string
  backDefault: string
  backFemale: string
  backShiny: string
  backShinyFemale: string
}

const pageTitle = '精灵形态管理'
const pageSubtitle =
  '对接后端精灵形态分页接口，支持分页查询、新增、编辑和删除。'
const modalWidth = 'min(96vw, 1100px)'

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

function toSearchQuery(values: SearchValues): CreatureFormQuery {
  const query: CreatureFormQuery = {}

  if (values.name.trim()) {
    query.name = values.name.trim()
  }

  if (values.internalName.trim()) {
    query.internalName = values.internalName.trim()
  }

  if (values.formName.trim()) {
    query.formName = values.formName.trim()
  }

  if (values.creatureId) {
    query.creatureId = values.creatureId
  }

  return query
}

function toFormValues(record?: CreatureFormRecord | null): FormValues {
  return {
    id: stringifyId(record?.id),
    name: typeof record?.name === 'string' ? record.name : '',
    internalName:
      typeof record?.internalName === 'string' ? record.internalName : '',
    creatureId: pickRelationId(record?.creature),
    formName: typeof record?.formName === 'string' ? record.formName : '',
    formOrder:
      typeof record?.formOrder === 'number' ? record.formOrder : undefined,
    sortingOrder:
      typeof record?.sortingOrder === 'number'
        ? record.sortingOrder
        : undefined,
    defaultForm: toBooleanSelectValue(record?.defaultForm),
    battleOnly: toBooleanSelectValue(record?.battleOnly),
    mega: toBooleanSelectValue(record?.mega),
    frontDefault:
      typeof record?.frontDefault === 'string' ? record.frontDefault : '',
    frontFemale:
      typeof record?.frontFemale === 'string' ? record.frontFemale : '',
    frontShiny: typeof record?.frontShiny === 'string' ? record.frontShiny : '',
    frontShinyFemale:
      typeof record?.frontShinyFemale === 'string'
        ? record.frontShinyFemale
        : '',
    backDefault:
      typeof record?.backDefault === 'string' ? record.backDefault : '',
    backFemale: typeof record?.backFemale === 'string' ? record.backFemale : '',
    backShiny: typeof record?.backShiny === 'string' ? record.backShiny : '',
    backShinyFemale:
      typeof record?.backShinyFemale === 'string' ? record.backShinyFemale : '',
  }
}

function toPayload(values: FormValues): CreatureFormUpsertInput {
  return {
    id: values.id,
    name: values.name.trim(),
    internalName: values.internalName.trim(),
    creatureId: values.creatureId ?? null,
    formName: normalizeNullableText(values.formName),
    formOrder: values.formOrder ?? null,
    sortingOrder: values.sortingOrder ?? null,
    defaultForm: fromBooleanSelectValue(values.defaultForm),
    battleOnly: fromBooleanSelectValue(values.battleOnly),
    mega: fromBooleanSelectValue(values.mega),
    frontDefault: normalizeNullableText(values.frontDefault),
    frontFemale: normalizeNullableText(values.frontFemale),
    frontShiny: normalizeNullableText(values.frontShiny),
    frontShinyFemale: normalizeNullableText(values.frontShinyFemale),
    backDefault: normalizeNullableText(values.backDefault),
    backFemale: normalizeNullableText(values.backFemale),
    backShiny: normalizeNullableText(values.backShiny),
    backShinyFemale: normalizeNullableText(values.backShinyFemale),
  }
}

export default function DatasetCreatureFormPage() {
  const { message } = App.useApp()
  const [searchForm] = Form.useForm<SearchValues>()
  const [form] = Form.useForm<FormValues>()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [optionLoading, setOptionLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [rows, setRows] = useState<CreatureFormRecord[]>([])
  const [editingRow, setEditingRow] = useState<CreatureFormRecord | null>(null)
  const [query, setQuery] = useState<CreatureFormQuery>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [creatureOptions, setCreatureOptions] = useState<SelectOption[]>([])

  async function loadOptions() {
    setOptionLoading(true)
    try {
      const result = await listCreatureRows()
      setCreatureOptions(toSelectOptions(result.data ?? []))
    } finally {
      setOptionLoading(false)
    }
  }

  async function loadData(
    nextPage = page,
    nextPageSize = pageSize,
    nextQuery: CreatureFormQuery = query,
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
        const [creatureResult, result] = await Promise.all([
          listCreatureRows(),
          getPage({
            page: 1,
            size: 10,
            sort: 'sortingOrder,asc',
            query: {},
          }),
        ])

        setCreatureOptions(toSelectOptions(creatureResult.data ?? []))
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

  function openEdit(record: CreatureFormRecord) {
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
        message.success('精灵形态已更新')
      } else {
        await createRow(payload)
        message.success('精灵形态已创建')
      }
      setModalOpen(false)
      setEditingRow(null)
      form.resetFields()
      await loadData(page, pageSize, query)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(record: CreatureFormRecord) {
    const id = stringifyId(record.id)
    if (!id) {
      return
    }

    await deleteRow(id)
    message.success('精灵形态已删除')
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

  const columns: ColumnsType<CreatureFormRecord> = [
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
      title: '形态名称',
      dataIndex: 'formName',
      key: 'formName',
      width: 160,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '所属精灵',
      dataIndex: 'creature',
      key: 'creature',
      width: 180,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '形态顺序',
      dataIndex: 'formOrder',
      key: 'formOrder',
      width: 120,
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
      title: '默认形态',
      dataIndex: 'defaultForm',
      key: 'defaultForm',
      width: 110,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '战斗限定',
      dataIndex: 'battleOnly',
      key: 'battleOnly',
      width: 110,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: 'Mega',
      dataIndex: 'mega',
      key: 'mega',
      width: 100,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: CreatureFormRecord) => (
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
          <Form.Item name="formName" label="形态名称">
            <Input allowClear placeholder="请输入形态名称" />
          </Form.Item>
          <Form.Item name="creatureId" label="所属精灵">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择所属精灵"
              options={creatureOptions}
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

      <Table<CreatureFormRecord>
        rowKey={(record, index) =>
          stringifyId(record.id) ??
          stringifyId(record.internalName) ??
          `creature-form-${index}`
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
        scroll={{ x: 1500 }}
      />

      <Modal
        destroyOnHidden
        title={editingRow ? '编辑精灵形态' : '新增精灵形态'}
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
              <Form.Item
                name="creatureId"
                label="所属精灵"
                rules={[{ required: true, message: '请选择所属精灵' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  placeholder="请选择所属精灵"
                  options={creatureOptions}
                  loading={optionLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="formName" label="形态名称">
                <Input allowClear placeholder="请输入形态名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="formOrder" label="形态顺序">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入形态顺序"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sortingOrder" label="排序顺序">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入排序顺序"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="defaultForm" label="默认形态">
                <Select
                  allowClear
                  placeholder="请选择是否为默认形态"
                  options={booleanOptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="battleOnly" label="战斗限定">
                <Select
                  allowClear
                  placeholder="请选择是否为战斗限定"
                  options={booleanOptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="mega" label="Mega">
                <Select
                  allowClear
                  placeholder="请选择是否为 Mega 形态"
                  options={booleanOptions}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="frontDefault" label="正面默认图片">
                <Input allowClear placeholder="请输入图片 URL" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="frontFemale" label="正面雌性图片">
                <Input allowClear placeholder="请输入图片 URL" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="frontShiny" label="正面闪光图片">
                <Input allowClear placeholder="请输入图片 URL" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="frontShinyFemale" label="正面闪光雌性图片">
                <Input allowClear placeholder="请输入图片 URL" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="backDefault" label="背面默认图片">
                <Input allowClear placeholder="请输入图片 URL" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="backFemale" label="背面雌性图片">
                <Input allowClear placeholder="请输入图片 URL" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="backShiny" label="背面闪光图片">
                <Input allowClear placeholder="请输入图片 URL" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="backShinyFemale" label="背面闪光雌性图片">
                <Input allowClear placeholder="请输入图片 URL" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  )
}
