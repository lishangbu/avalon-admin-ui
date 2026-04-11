import { ReloadOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { Button, Card, Form, Input, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { listRows } from './service'
import type { StatRecord, StatQuery } from './service'

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

const pageTitle = '能力管理'
const pageSubtitle = '对接后端能力列表接口，当前提供列表查看。'

type SearchValues = {
  name: string
  internalName: string
}

function toSearchQuery(values: SearchValues): StatQuery {
  const query: StatQuery = {}

  if (values.name.trim()) {
    query.name = values.name.trim()
  }

  if (values.internalName.trim()) {
    query.internalName = values.internalName.trim()
  }

  return query
}

export default function DatasetStatPage() {
  const [searchForm] = Form.useForm<SearchValues>()
  const queryClient = useQueryClient()
  const [query, setQuery] = useState<StatQuery>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const rowsQuery = useQuery({
    queryKey: ['dataset', 'stat', 'list', query],
    queryFn: () => listRows(query),
  })

  const loading = rowsQuery.isFetching
  const rows = rowsQuery.data?.data ?? []
  const total = rows.length

  async function loadData(nextQuery: StatQuery = query) {
    const isSameQuery = JSON.stringify(nextQuery) === JSON.stringify(query)

    if (!isSameQuery) {
      await queryClient.ensureQueryData({
        queryKey: ['dataset', 'stat', 'list', nextQuery],
        queryFn: () => listRows(nextQuery),
      })
      setQuery(nextQuery)
      setPage(1)
      return
    }

    await rowsQuery.refetch()
  }

  function handleSearchSubmit(values: SearchValues) {
    void loadData(toSearchQuery(values))
  }

  function handleResetSearch() {
    searchForm.resetFields()
    void loadData({})
  }

  const columns: ColumnsType<StatRecord> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
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
      title: '排序顺序',
      dataIndex: 'sortingOrder',
      key: 'sortingOrder',
      width: 140,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '仅战斗属性',
      dataIndex: 'battleOnly',
      key: 'battleOnly',
      width: 140,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '只读',
      dataIndex: 'readonly',
      key: 'readonly',
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
    }
  ]

  const canExpandRows = rows.some((row) =>
    Object.values(row).some(
      (value) => Array.isArray(value) || (typeof value === 'object' && value !== null),
    ),
  )

  return (
    <PageContainer
      title={pageTitle}
      subTitle={pageSubtitle}
      extra={[
        <Button key="reload" icon={<ReloadOutlined />} loading={loading} onClick={() => void loadData(query)}>
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

      <Table<StatRecord>
        rowKey={(record, index) => stringifyId(record.id) ?? stringifyId(record.internalName) ?? 'stat-' + index}
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
        scroll={{ x: 1200 }}
        expandable={
          canExpandRows
            ? {
                expandedRowRender: (record) => (
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {formatComplexValue(record)}
                  </pre>
                ),
              }
            : undefined
        }
      />
    </PageContainer>
  )
}
