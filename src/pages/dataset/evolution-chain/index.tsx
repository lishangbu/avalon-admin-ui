import { ReloadOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { Button, Table, Tag } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useState } from 'react'
import { getPage } from './service'
import type { EvolutionChainRecord } from './service'

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

const pageTitle = '进化链管理'
const pageSubtitle = '对接后端进化链分页接口，当前提供分页查看。'

export default function DatasetEvolutionChainPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const pageQuery = useQuery({
    queryKey: ['dataset', 'evolution-chain', 'page', page, pageSize],
    queryFn: () =>
      getPage({
        page,
        size: pageSize,
        sort: 'id,asc',
        query: {},
      }),
    placeholderData: keepPreviousData,
  })
  const loading = pageQuery.isFetching
  const rows = pageQuery.data?.data?.rows ?? []
  const total = pageQuery.data?.data?.totalRowCount ?? 0

  async function loadData(nextPage = page, nextPageSize = pageSize) {
    const isSameQuery = nextPage === page && nextPageSize === pageSize

    if (!isSameQuery) {
      await queryClient.ensureQueryData({
        queryKey: [
          'dataset',
          'evolution-chain',
          'page',
          nextPage,
          nextPageSize,
        ],
        queryFn: () =>
          getPage({
            page: nextPage,
            size: nextPageSize,
            sort: 'id,asc',
            query: {},
          }),
      })
      setPage(nextPage)
      setPageSize(nextPageSize)
      return
    }

    await pageQuery.refetch()
  }

  function handleTableChange(pagination: TablePaginationConfig) {
    void loadData(pagination.current ?? 1, pagination.pageSize ?? 10)
  }

  const columns: ColumnsType<EvolutionChainRecord> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
    {
      title: '幼年触发道具',
      dataIndex: 'babyTriggerItem',
      key: 'babyTriggerItem',
      width: 220,
      ellipsis: true,
      render: (value: unknown) => renderDatasetValue(value),
    },
  ]

  const canExpandRows = rows.some((row) =>
    Object.values(row).some(
      (value) =>
        Array.isArray(value) || (typeof value === 'object' && value !== null),
    ),
  )

  return (
    <PageContainer
      title={pageTitle}
      subTitle={pageSubtitle}
      extra={[
        <Button
          key="reload"
          icon={<ReloadOutlined />}
          loading={loading}
          onClick={() => void loadData(page, pageSize)}
        >
          刷新
        </Button>,
      ]}
    >
      <Table<EvolutionChainRecord>
        rowKey={(record, index) =>
          stringifyId(record.id) ??
          stringifyId(record.internalName) ??
          'evolution-chain-' + index
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
