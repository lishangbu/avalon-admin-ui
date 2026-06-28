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
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import {
  battleRulesServices,
  type BattleRuleFixtureListQuery,
  type BattleRuleFixtureRequest,
  type BattleRuleFixtureResponse,
} from '../../../services/battle-rules';
import { toPageRows, toPageTotal } from '../../system/shared/page-utils';
import {
  apiErrorMessage,
  compactRulePayload,
  defaultPageState,
  renderEnabledTag,
  renderOptionalText,
  requiredRule,
  type BattleRuleModalMode,
} from '../shared/battle-rule-page-utils';

interface FixtureFilters {
  q: string;
  category?: string;
  enabled?: boolean;
}

const categoryOptions = [
  { label: '回合流程', value: 'TURN' },
  { label: '状态规则', value: 'STATUS' },
  { label: '伤害公式', value: 'DAMAGE' },
  { label: '场地效果', value: 'FIELD' },
];

const fixtureTypeOptions = [
  { label: '公式对照', value: 'FORMULA' },
  { label: '状态机对照', value: 'STATE_MACHINE' },
  { label: '运行时对照', value: 'RUNTIME' },
];

const enabledFilterOptions = [
  { label: '启用', value: true },
  { label: '停用', value: false },
];

export function FixturesPage() {
  const [filters, setFilters] = useState<FixtureFilters>({ q: '' });
  const [page, setPage] = useState(defaultPageState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BattleRuleModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<BattleRuleFixtureResponse | null>(null);
  const [form] = Form.useForm<BattleRuleFixtureRequest>();
  const queryClient = useQueryClient();

  const query = useMemo<BattleRuleFixtureListQuery>(
    () => ({
      q: filters.q || undefined,
      category: filters.category,
      enabled: filters.enabled,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const fixturesQuery = useQuery({
    queryKey: ['battle-rules', 'fixtures', query],
    queryFn: () => battleRulesServices.fixtures.list(query),
  });

  const saveMutation = useMutation({
    mutationFn: (values: BattleRuleFixtureRequest) => {
      const payload = compactRulePayload(values);
      if (modalMode === 'create') {
        return battleRulesServices.fixtures.create(payload);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的 Fixture');
      }
      return battleRulesServices.fixtures.update(editingRecord.id, payload);
    },
    onSuccess: async () => {
      message.success('Fixture 已保存');
      closeModal();
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'fixtures'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '保存 Fixture 失败')),
  });

  const removeMutation = useMutation({
    mutationFn: (record: BattleRuleFixtureResponse) =>
      battleRulesServices.fixtures.remove(record.id),
    onSuccess: async () => {
      message.success('Fixture 已删除');
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'fixtures'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '删除 Fixture 失败')),
  });

  const columns: ColumnsType<BattleRuleFixtureResponse> = [
    { title: '编码', dataIndex: 'code', width: 280, fixed: 'left' },
    { title: '名称', dataIndex: 'name', width: 220 },
    { title: '分类', dataIndex: 'category', width: 120, render: renderCategory },
    { title: '类型', dataIndex: 'fixtureType', width: 130, render: renderFixtureType },
    { title: '赛制', dataIndex: 'formatCode', width: 150, render: renderOptionalText },
    { title: '启用', dataIndex: 'enabled', width: 90, render: renderEnabledTag },
    { title: '排序', dataIndex: 'sortOrder', width: 90 },
    {
      title: '场景说明',
      dataIndex: 'description',
      width: 260,
      ellipsis: true,
      render: renderOptionalText,
    },
    { title: '输入摘要', dataIndex: 'inputSummary', width: 320, ellipsis: true },
    { title: '期望摘要', dataIndex: 'expectedSummary', width: 360, ellipsis: true },
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
            title="删除 Fixture"
            description={`确认删除 ${record.name}？`}
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
            对照 Fixture
          </Typography.Title>
          <Typography.Text type="secondary">维护战斗规则公开对照场景和期望摘要。</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建 Fixture
        </Button>
      </div>

      <Card size="small">
        <div className="flex flex-wrap items-end gap-3">
          <Form.Item label="关键字" className="!mb-0">
            <Input.Search
              allowClear
              placeholder="编码或名称"
              style={{ width: 280 }}
              onSearch={(value) => updateFilter({ q: value.trim() })}
            />
          </Form.Item>
          <Form.Item label="分类" className="!mb-0">
            <Select
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              placeholder="全部分类"
              options={categoryOptions}
              style={{ width: 180 }}
              onChange={(category) => updateFilter({ category })}
            />
          </Form.Item>
          <Form.Item label="状态" className="!mb-0">
            <Select
              allowClear
              placeholder="全部状态"
              options={enabledFilterOptions}
              style={{ width: 150 }}
              onChange={(enabled) => updateFilter({ enabled })}
            />
          </Form.Item>
        </div>
      </Card>

      <Card size="small">
        <Table<BattleRuleFixtureResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(fixturesQuery.data)}
          loading={fixturesQuery.isLoading || fixturesQuery.isFetching}
          scroll={{ x: 2180 }}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total: toPageTotal(fixturesQuery.data),
            showSizeChanger: true,
            onChange: (current, pageSize) => setPage({ current, pageSize }),
          }}
        />
      </Card>

      <Modal
        open={modalOpen}
        title={modalMode === 'create' ? '新建 Fixture' : '编辑 Fixture'}
        okText="保存"
        cancelText="取消"
        confirmLoading={saveMutation.isPending}
        destroyOnHidden
        width={720}
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={(values) => saveMutation.mutate(values)}>
          <Form.Item name="code" label="编码" rules={requiredRule}>
            <Input placeholder="burn-halves-physical-attacking-stat-before-damage" />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={requiredRule}>
            <Input placeholder="灼伤物理攻击减半" />
          </Form.Item>
          <div className="grid gap-3 md:grid-cols-2">
            <Form.Item name="category" label="分类" rules={requiredRule}>
              <Select showSearch={{ optionFilterProp: 'label' }} options={categoryOptions} />
            </Form.Item>
            <Form.Item name="fixtureType" label="Fixture 类型" rules={requiredRule}>
              <Select showSearch={{ optionFilterProp: 'label' }} options={fixtureTypeOptions} />
            </Form.Item>
          </div>
          <Form.Item name="formatCode" label="赛制编码">
            <Input placeholder="standard-single" />
          </Form.Item>
          <Form.Item name="description" label="场景说明">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="inputSummary" label="输入摘要" rules={requiredRule}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="expectedSummary" label="期望摘要" rules={requiredRule}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Space size="large">
            <Form.Item name="enabled" label="启用" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="sortOrder" label="排序" rules={requiredRule}>
              <InputNumber min={0} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );

  function updateFilter(next: Partial<FixtureFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }

  function openCreate() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue({
      category: 'TURN',
      fixtureType: 'STATE_MACHINE',
      enabled: true,
      sortOrder: 10,
    });
    setModalOpen(true);
  }

  function openEdit(record: BattleRuleFixtureResponse) {
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

function renderCategory(value?: string) {
  const label = categoryOptions.find((option) => option.value === value)?.label ?? value;
  return label ? <Tag color="blue">{label}</Tag> : '-';
}

function renderFixtureType(value?: string) {
  const label = fixtureTypeOptions.find((option) => option.value === value)?.label ?? value;
  return label ? <Tag color="geekblue">{label}</Tag> : '-';
}
