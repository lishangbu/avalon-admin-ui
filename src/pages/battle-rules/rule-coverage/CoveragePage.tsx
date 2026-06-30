import { ReloadOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Card,
  Flex,
  Progress,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  battleRulesServices,
  type BattleRuleCoverageCheckResponse,
  type BattleRuleCoverageFixtureResponse,
  type BattleRuleCoverageItemResponse,
  type BattleRuleCoverageMatrixRowResponse,
} from '../../../services/battle-rules';
import { apiErrorMessage, renderOptionalText } from '../shared/battle-rule-page-utils';

const statusLabels: Record<string, { label: string; color: string }> = {
  IMPLEMENTED: { label: '已实现', color: 'green' },
  PARTIAL: { label: '部分接入', color: 'gold' },
  PLANNED: { label: '计划中', color: 'default' },
};

const checkStatusLabels: Record<string, { label: string; color: string }> = {
  PASSED: { label: '通过', color: 'green' },
  FAILED: { label: '失败', color: 'red' },
};

const runStatusLabels: Record<string, { label: string; color: string }> = {
  PASSED: { label: '最近通过', color: 'green' },
  FAILED: { label: '最近失败', color: 'red' },
  RUNNING: { label: '运行中', color: 'blue' },
  SKIPPED: { label: '已跳过', color: 'default' },
};

const matrixColumns: ColumnsType<BattleRuleCoverageMatrixRowResponse> = [
  { title: '分类', dataIndex: 'category', width: 150 },
  { title: '规则点', dataIndex: 'totalCount', width: 90, align: 'right' },
  { title: '已实现', dataIndex: 'implementedCount', width: 90, align: 'right' },
  { title: '部分接入', dataIndex: 'partialCount', width: 100, align: 'right' },
  { title: '计划中', dataIndex: 'plannedCount', width: 90, align: 'right' },
  { title: 'fixture', dataIndex: 'fixtureCount', width: 100, align: 'right' },
  { title: '来源', dataIndex: 'referenceCount', width: 90, align: 'right' },
  {
    title: '覆盖率',
    dataIndex: 'implementationPercent',
    width: 180,
    render: (percent: number) => <Progress percent={percent} size="small" />,
  },
];

const checkColumns: ColumnsType<BattleRuleCoverageCheckResponse> = [
  {
    title: '检查项',
    dataIndex: 'name',
    width: 190,
    render: (_, record) => (
      <Flex vertical gap={0}>
        <Typography.Text strong>{record.name}</Typography.Text>
        <Typography.Text type="secondary" className="text-xs">
          {record.code}
        </Typography.Text>
      </Flex>
    ),
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 90,
    render: renderCheckStatus,
  },
  { title: '结果', dataIndex: 'message' },
];

const columns: ColumnsType<BattleRuleCoverageItemResponse> = [
  { title: '分类', dataIndex: 'category', width: 110 },
  {
    title: '规则点',
    dataIndex: 'name',
    width: 220,
    render: (_, record) => (
      <Flex vertical gap={0}>
        <Typography.Text strong>{record.name}</Typography.Text>
        <Typography.Text type="secondary" className="text-xs">
          {record.code}
        </Typography.Text>
      </Flex>
    ),
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 110,
    render: renderCoverageStatus,
  },
  {
    title: '对照 fixture',
    dataIndex: 'fixtures',
    width: 320,
    render: (fixtures: BattleRuleCoverageFixtureResponse[]) =>
      fixtures.length > 0 ? (
        <Space size={[0, 6]} wrap>
          {fixtures.map((fixture) => (
            <Tag
              key={fixture.code}
              color={coverageFixtureColor(fixture)}
              href={`/battle-rules/fixtures?q=${encodeURIComponent(fixture.code)}`}
            >
              {fixture.code}
            </Tag>
          ))}
        </Space>
      ) : (
        '-'
      ),
  },
  {
    title: '参考来源',
    dataIndex: 'referenceUrls',
    width: 190,
    render: (urls: string[]) =>
      urls.length > 0 ? (
        <Space size={[0, 6]} wrap>
          {urls.map((url, index) => (
            <Typography.Link key={url} href={url} target="_blank" rel="noreferrer">
              来源 {index + 1}
            </Typography.Link>
          ))}
        </Space>
      ) : (
        '-'
      ),
  },
  { title: '说明', dataIndex: 'note', render: renderOptionalText },
];

export function CoveragePage() {
  const coverageQuery = useQuery({
    queryKey: ['battle-rules', 'coverage'],
    queryFn: () => battleRulesServices.coverage.get(),
  });
  const summary = coverageQuery.data?.summary;
  const targetSummary = coverageQuery.data?.targetSummary;
  const fixtureSummary = coverageQuery.data?.fixtureSummary;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <Typography.Title level={3} className="!mb-1">
            规则覆盖
          </Typography.Title>
          <Typography.Text type="secondary">现代战斗规则实现与公开对照状态。</Typography.Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          loading={coverageQuery.isFetching}
          onClick={() => coverageQuery.refetch()}
        >
          刷新
        </Button>
      </div>

      {coverageQuery.isError ? (
        <Alert
          type="error"
          showIcon
          title={apiErrorMessage(coverageQuery.error, '读取规则覆盖报告失败')}
        />
      ) : null}

      <div className="grid gap-3 md:grid-cols-4">
        <Card size="small">
          <Statistic
            title="最终规则"
            value={targetSummary?.targetRuleCount ?? 0}
            loading={coverageQuery.isLoading}
          />
        </Card>
        <Card size="small">
          <Statistic
            title="最终已覆盖"
            value={targetSummary?.coveredRuleCount ?? 0}
            loading={coverageQuery.isLoading}
          />
        </Card>
        <Card size="small">
          <Statistic
            title="最终剩余"
            value={targetSummary?.remainingRuleCount ?? 0}
            loading={coverageQuery.isLoading}
          />
        </Card>
        <Card size="small">
          <Statistic
            title="最终覆盖率"
            value={targetSummary?.implementationPercent ?? 0}
            suffix="%"
            loading={coverageQuery.isLoading}
          />
        </Card>
      </div>

      <Card size="small">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <Typography.Text strong>最终覆盖率</Typography.Text>
          <div className="w-full md:max-w-md">
            <Progress
              percent={targetSummary?.implementationPercent ?? 0}
              status="active"
              size="small"
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-5">
        <Card size="small">
          <Statistic
            title="报表规则点"
            value={summary?.totalCount ?? 0}
            loading={coverageQuery.isLoading}
          />
        </Card>
        <Card size="small">
          <Statistic
            title="报表已实现"
            value={summary?.implementedCount ?? 0}
            loading={coverageQuery.isLoading}
          />
        </Card>
        <Card size="small">
          <Statistic
            title="报表部分接入"
            value={summary?.partialCount ?? 0}
            loading={coverageQuery.isLoading}
          />
        </Card>
        <Card size="small">
          <Statistic
            title="报表计划中"
            value={summary?.plannedCount ?? 0}
            loading={coverageQuery.isLoading}
          />
        </Card>
        <Card size="small">
          <Statistic
            title="公开 fixture"
            value={summary?.fixtureCount ?? 0}
            loading={coverageQuery.isLoading}
          />
        </Card>
      </div>

      <Card size="small">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <Typography.Text strong>报表覆盖率</Typography.Text>
          <div className="w-full md:max-w-md">
            <Progress percent={summary?.implementationPercent ?? 0} status="active" size="small" />
          </div>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-6">
        <Card size="small">
          <Statistic
            title="运行态"
            value={fixtureSummary?.runtimeAvailable ? '已接入' : '未接入'}
            loading={coverageQuery.isLoading}
          />
        </Card>
        <Card size="small">
          <Statistic
            title="已登记 fixture"
            value={fixtureSummary?.matchedFixtureCount ?? 0}
            loading={coverageQuery.isLoading}
          />
        </Card>
        <Card size="small">
          <Statistic
            title="缺失 fixture"
            value={fixtureSummary?.missingFixtureCount ?? 0}
            loading={coverageQuery.isLoading}
          />
        </Card>
        <Card size="small">
          <Statistic
            title="最近通过"
            value={fixtureSummary?.latestPassedCount ?? 0}
            loading={coverageQuery.isLoading}
          />
        </Card>
        <Card size="small">
          <Statistic
            title="最近失败"
            value={fixtureSummary?.latestFailedCount ?? 0}
            loading={coverageQuery.isLoading}
          />
        </Card>
        <Card size="small">
          <Statistic
            title="没有运行"
            value={fixtureSummary?.withoutRunCount ?? 0}
            loading={coverageQuery.isLoading}
          />
        </Card>
      </div>

      <Card size="small" title="完整性校验">
        <Table<BattleRuleCoverageCheckResponse>
          rowKey="code"
          columns={checkColumns}
          dataSource={coverageQuery.data?.checks ?? []}
          loading={coverageQuery.isLoading || coverageQuery.isFetching}
          pagination={false}
          size="small"
        />
      </Card>

      <Card size="small" title="规则覆盖矩阵">
        <Table<BattleRuleCoverageMatrixRowResponse>
          rowKey="category"
          columns={matrixColumns}
          dataSource={coverageQuery.data?.matrix ?? []}
          loading={coverageQuery.isLoading || coverageQuery.isFetching}
          pagination={false}
          scroll={{ x: 900 }}
          size="small"
        />
      </Card>

      <Card size="small">
        <Table<BattleRuleCoverageItemResponse>
          rowKey="code"
          columns={columns}
          dataSource={coverageQuery.data?.items ?? []}
          loading={coverageQuery.isLoading || coverageQuery.isFetching}
          pagination={false}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
}

function renderCoverageStatus(status?: string) {
  const config = status ? statusLabels[status] : undefined;
  return <Tag color={config?.color ?? 'default'}>{config?.label ?? status ?? '-'}</Tag>;
}

function renderCheckStatus(status?: string) {
  const config = status ? checkStatusLabels[status] : undefined;
  return <Tag color={config?.color ?? 'default'}>{config?.label ?? status ?? '-'}</Tag>;
}

function coverageFixtureColor(fixture: BattleRuleCoverageFixtureResponse) {
  if (fixture.missing) {
    return 'red';
  }
  const status = fixture.latestRunStatus;
  if (!status) {
    return fixture.fixtureId ? 'gold' : 'blue';
  }
  return runStatusLabels[status]?.color ?? 'default';
}
