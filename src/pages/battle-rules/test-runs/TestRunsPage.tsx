import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
  battleRulesServices,
  type BattleRuleTestRunListQuery,
  type BattleRuleTestRunRequest,
  type BattleRuleTestRunResponse,
} from '../../../services/battle-rules';
import { toPageRows, toPageTotal } from '../../system/shared/page-utils';
import {
  apiErrorMessage,
  compactRulePayload,
  defaultPageState,
  makeOptions,
  renderOptionLabel,
  renderOptionalText,
  requiredRule,
  requiredSelectRule,
  type BattleRuleModalMode,
} from '../shared/battle-rule-page-utils';

interface TestRunFilters {
  fixtureId?: number;
  runStatus?: string;
}

const optionQuery = { page: 0, size: 2000 };

const runStatusOptions = [
  { label: '通过', value: 'PASSED', color: 'green' },
  { label: '失败', value: 'FAILED', color: 'red' },
  { label: '跳过', value: 'SKIPPED', color: 'default' },
  { label: '运行中', value: 'RUNNING', color: 'processing' },
];

export function TestRunsPage() {
  const [filters, setFilters] = useState<TestRunFilters>({});
  const [page, setPage] = useState(defaultPageState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BattleRuleModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<BattleRuleTestRunResponse | null>(null);
  const [form] = Form.useForm<BattleRuleTestRunRequest>();
  const queryClient = useQueryClient();

  const fixtureOptionsQuery = useQuery({
    queryKey: ['battle-rules', 'fixtures', 'test-run-options'],
    queryFn: () => battleRulesServices.fixtures.list(optionQuery),
    staleTime: 5 * 60 * 1000,
  });
  const fixtureOptions = useMemo(
    () => makeOptions(toPageRows(fixtureOptionsQuery.data)),
    [fixtureOptionsQuery.data],
  );

  const query = useMemo<BattleRuleTestRunListQuery>(
    () => ({
      fixtureId: filters.fixtureId,
      runStatus: filters.runStatus,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const testRunsQuery = useQuery({
    queryKey: ['battle-rules', 'test-runs', query],
    queryFn: () => battleRulesServices.testRuns.list(query),
  });

  const saveMutation = useMutation({
    mutationFn: (values: BattleRuleTestRunRequest) => {
      const payload = compactRulePayload(values);
      if (modalMode === 'create') {
        return battleRulesServices.testRuns.create(payload);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的测试运行结果');
      }
      return battleRulesServices.testRuns.update(editingRecord.id, payload);
    },
    onSuccess: async () => {
      message.success('测试运行结果已保存');
      closeModal();
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'test-runs'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '保存测试运行结果失败')),
  });

  const removeMutation = useMutation({
    mutationFn: (record: BattleRuleTestRunResponse) =>
      battleRulesServices.testRuns.remove(record.id),
    onSuccess: async () => {
      message.success('测试运行结果已删除');
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'test-runs'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '删除测试运行结果失败')),
  });

  const columns: ColumnsType<BattleRuleTestRunResponse> = [
    { title: '运行编码', dataIndex: 'runCode', width: 280, fixed: 'left' },
    {
      title: 'Fixture',
      dataIndex: 'fixtureId',
      width: 320,
      render: (value?: number) => renderOptionLabel(fixtureOptions, value),
    },
    { title: '状态', dataIndex: 'runStatus', width: 100, render: renderRunStatus },
    { title: '执行器', dataIndex: 'executor', width: 120 },
    { title: '命令', dataIndex: 'command', width: 260, ellipsis: true, render: renderOptionalText },
    { title: '提交', dataIndex: 'engineCommit', width: 120, render: renderOptionalText },
    { title: '开始时间', dataIndex: 'startedAt', width: 170, render: renderDateTime },
    { title: '结束时间', dataIndex: 'finishedAt', width: 170, render: renderDateTime },
    { title: '耗时 ms', dataIndex: 'durationMs', width: 100, render: renderOptionalText },
    { title: '断言数', dataIndex: 'assertionCount', width: 90, render: renderOptionalText },
    {
      title: '失败摘要',
      dataIndex: 'failureMessage',
      width: 260,
      ellipsis: true,
      render: renderOptionalText,
    },
    { title: '排序', dataIndex: 'sortOrder', width: 90 },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="删除测试运行结果"
            description={`确认删除 ${record.runCode}？`}
            okText="删除"
            cancelText="取消"
            okType="danger"
            onConfirm={() => removeMutation.mutate(record)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <Typography.Title level={3} className="!mb-1">
            测试运行结果
          </Typography.Title>
          <Typography.Text type="secondary">
            维护公开对照 Fixture 的自动化或人工执行结果。
          </Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建结果
        </Button>
      </div>

      <Card size="small">
        <div className="flex flex-wrap items-end gap-3">
          <Form.Item label="Fixture" className="!mb-0">
            <Select
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              placeholder="全部 Fixture"
              options={fixtureOptions}
              loading={fixtureOptionsQuery.isLoading}
              style={{ width: 360 }}
              onChange={(fixtureId) => updateFilter({ fixtureId })}
            />
          </Form.Item>
          <Form.Item label="状态" className="!mb-0">
            <Select
              allowClear
              placeholder="全部状态"
              options={runStatusOptions}
              style={{ width: 160 }}
              onChange={(runStatus) => updateFilter({ runStatus })}
            />
          </Form.Item>
        </div>
      </Card>

      <Card size="small">
        <Table<BattleRuleTestRunResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(testRunsQuery.data)}
          loading={testRunsQuery.isLoading || testRunsQuery.isFetching}
          scroll={{ x: 2340 }}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total: toPageTotal(testRunsQuery.data),
            showSizeChanger: true,
            onChange: (current, pageSize) => setPage({ current, pageSize }),
          }}
        />
      </Card>

      <Modal
        open={modalOpen}
        title={modalMode === 'create' ? '新建测试运行结果' : '编辑测试运行结果'}
        okText="保存"
        cancelText="取消"
        confirmLoading={saveMutation.isPending}
        destroyOnHidden
        width={720}
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={(values) => saveMutation.mutate(values)}>
          <Form.Item name="runCode" label="运行编码" rules={requiredRule}>
            <Input placeholder="local-fixture-run-20260628" />
          </Form.Item>
          <Form.Item name="fixtureId" label="Fixture" rules={requiredSelectRule}>
            <Select
              showSearch={{ optionFilterProp: 'label' }}
              options={fixtureOptions}
              loading={fixtureOptionsQuery.isLoading}
            />
          </Form.Item>
          <div className="grid gap-3 md:grid-cols-2">
            <Form.Item name="runStatus" label="状态" rules={requiredRule}>
              <Select showSearch={{ optionFilterProp: 'label' }} options={runStatusOptions} />
            </Form.Item>
            <Form.Item name="executor" label="执行器" rules={requiredRule}>
              <Input placeholder="gradle" />
            </Form.Item>
          </div>
          <Form.Item name="command" label="执行命令">
            <Input placeholder="./gradlew :battle-engine:test" />
          </Form.Item>
          <Form.Item name="engineCommit" label="后端提交">
            <Input placeholder="a0d501d" />
          </Form.Item>
          <div className="grid gap-3 md:grid-cols-2">
            <Form.Item name="startedAt" label="开始时间">
              <Input placeholder="2026-06-28T21:12:15+08:00" />
            </Form.Item>
            <Form.Item name="finishedAt" label="结束时间">
              <Input placeholder="2026-06-28T21:14:23+08:00" />
            </Form.Item>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Form.Item name="durationMs" label="耗时 ms">
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item name="assertionCount" label="断言数">
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item name="sortOrder" label="排序" rules={requiredRule}>
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </div>
          <Form.Item name="failureMessage" label="失败摘要">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );

  function updateFilter(next: Partial<TestRunFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }

  function openCreate() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue({
      fixtureId: filters.fixtureId,
      runStatus: 'PASSED',
      executor: 'gradle',
      sortOrder: 10,
    });
    setModalOpen(true);
  }

  function openEdit(record: BattleRuleTestRunResponse) {
    setModalMode('edit');
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  }
}

function renderRunStatus(value?: string) {
  const option = runStatusOptions.find((item) => item.value === value);
  return <Tag color={option?.color ?? 'default'}>{option?.label ?? value ?? '-'}</Tag>;
}

function renderDateTime(value?: string | null) {
  if (!value) {
    return '-';
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
}
