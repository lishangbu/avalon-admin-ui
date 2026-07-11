import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Alert, Button, Card, Space, Table, Tabs, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  battleSessionService,
  type BattleSessionStatus,
  type BattleSessionSummaryResponse,
} from '../../../services/battle-sessions';
import { BattleSessionStatusTag } from '../detail/BattleSessionLifecyclePanel';

/**
 * 活跃与近期 Battle Session 列表页。
 */
export function BattleSessionsPage() {
  const [activePage, setActivePage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [terminatedPage, setTerminatedPage] = useState(1);
  const activeQuery = useSessionList('ACTIVE', activePage);
  const completedQuery = useSessionList('COMPLETED', completedPage);
  const terminatedQuery = useSessionList('TERMINATED', terminatedPage);
  const loading = activeQuery.isFetching || completedQuery.isFetching || terminatedQuery.isFetching;
  const error = activeQuery.error ?? completedQuery.error ?? terminatedQuery.error;

  function refreshAll() {
    void Promise.all([activeQuery.refetch(), completedQuery.refetch(), terminatedQuery.refetch()]);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <Typography.Title level={3} className="!mb-1">
            战斗会话
          </Typography.Title>
          <Typography.Text type="secondary">
            查看当前节点中的活跃会话和仍在终态缓存中的近期会话。
          </Typography.Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} loading={loading} onClick={refreshAll}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />}>
            <Link to="/battle-sessions/new">创建会话</Link>
          </Button>
        </Space>
      </div>

      {error ? (
        <Alert
          showIcon
          type="error"
          title="战斗会话加载失败"
          description={error instanceof Error ? error.message : '请稍后重试'}
        />
      ) : null}

      <Card size="small" title={<Typography.Title level={4}>活跃会话</Typography.Title>}>
        <SessionTable
          query={activeQuery}
          currentPage={activePage}
          emptyText="暂无活跃会话"
          onPageChange={setActivePage}
        />
      </Card>

      <Card size="small" title={<Typography.Title level={4}>近期会话</Typography.Title>}>
        <Tabs
          items={[
            {
              key: 'completed',
              label: '已完成',
              children: (
                <SessionTable
                  query={completedQuery}
                  currentPage={completedPage}
                  emptyText="暂无缓存期内的已完成会话"
                  onPageChange={setCompletedPage}
                />
              ),
            },
            {
              key: 'terminated',
              label: '已终止',
              children: (
                <SessionTable
                  query={terminatedQuery}
                  currentPage={terminatedPage}
                  emptyText="暂无缓存期内的已终止会话"
                  onPageChange={setTerminatedPage}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}

const sessionColumns: ColumnsType<BattleSessionSummaryResponse> = [
  {
    title: '会话标识',
    dataIndex: 'sessionId',
    width: 290,
    render: (sessionId: string) => <Link to={`/battle-sessions/${sessionId}`}>{sessionId}</Link>,
  },
  { title: '赛制', dataIndex: 'formatCode', width: 150 },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (status: string) => <BattleSessionStatusTag status={status} />,
  },
  { title: 'Revision', dataIndex: 'revision', width: 100 },
  { title: '回合', dataIndex: 'turnNumber', width: 80 },
  {
    title: '结果 / 终止原因',
    width: 220,
    render: (_, record) => renderTerminalSummary(record),
  },
  { title: '更新时间', dataIndex: 'updatedAt', width: 190 },
  { title: '缓存到期', dataIndex: 'expiresAt', width: 190, render: renderOptionalText },
];

function useSessionList(status: BattleSessionStatus, currentPage: number) {
  return useQuery({
    queryKey: ['battle-sessions', 'list', status, currentPage],
    queryFn: () => battleSessionService.list({ status, page: currentPage - 1, size: 20 }),
  });
}

function SessionTable({
  query,
  currentPage,
  emptyText,
  onPageChange,
}: {
  query: ReturnType<typeof useSessionList>;
  currentPage: number;
  emptyText: string;
  onPageChange: (page: number) => void;
}) {
  return (
    <Table<BattleSessionSummaryResponse>
      rowKey="sessionId"
      size="small"
      columns={sessionColumns}
      dataSource={query.data?.rows ?? []}
      loading={query.isLoading}
      locale={{ emptyText }}
      pagination={{
        current: currentPage,
        pageSize: 20,
        total: Number(query.data?.totalRowCount ?? 0),
        showSizeChanger: false,
        onChange: onPageChange,
      }}
      scroll={{ x: 980 }}
    />
  );
}

function renderTerminalSummary(record: BattleSessionSummaryResponse): string {
  if (record.result) {
    const winner = record.result.winningSideId ?? '平局';
    return `${winner} / ${record.result.reason}`;
  }
  return record.terminationReason ?? '-';
}

function renderOptionalText(value?: string | null): string {
  return value || '-';
}
