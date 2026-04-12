import { ReloadOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { Button, Table } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useState } from 'react'
import { getPage } from './service'
import type { EvolutionChainRecord } from './service'

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
      render: (value: string | number | null | undefined) =>
        value === '' || value == null ? '-' : value,
    },
    {
      title: '幼年触发道具',
      dataIndex: 'babyTriggerItem',
      key: 'babyTriggerItem',
      width: 220,
      ellipsis: true,
      render: (value: SummaryValue) => renderSummaryCell(value),
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
      title="进化链管理"
      subTitle="对接后端进化链分页接口，当前提供分页查看。"
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
          toOptionalString(record.id) ??
          toOptionalString(record.internalName) ??
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
                    {JSON.stringify(record, null, 2)}
                  </pre>
                ),
              }
            : undefined
        }
      />
    </PageContainer>
  )
}
