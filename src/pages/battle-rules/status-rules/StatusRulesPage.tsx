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
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import {
  battleRulesServices,
  type BattleRulePageQuery,
  type BattleStatusRuleRequest,
  type BattleStatusRuleResponse,
} from '../../../services/battle-rules';
import { toPageRows, toPageTotal } from '../../system/shared/page-utils';
import {
  apiErrorMessage,
  compactRulePayload,
  defaultPageState,
  renderEnabledTag,
  renderOptionalText,
  renderPolicyTag,
  requiredRule,
  statusPolicyOptions,
  type BattleRuleModalMode,
} from '../shared/battle-rule-page-utils';

interface StatusRuleFilters {
  q: string;
}

const statusKindOptions = [
  { label: '主要状态', value: 'MAJOR' },
  { label: '临时状态', value: 'VOLATILE' },
  { label: '场地状态', value: 'FIELD' },
  { label: '一侧状态', value: 'SIDE' },
];

export function StatusRulesPage() {
  const [filters, setFilters] = useState<StatusRuleFilters>({ q: '' });
  const [page, setPage] = useState(defaultPageState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BattleRuleModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<BattleStatusRuleResponse | null>(null);
  const [form] = Form.useForm<BattleStatusRuleRequest>();
  const queryClient = useQueryClient();

  const query = useMemo<BattleRulePageQuery>(
    () => ({ q: filters.q || undefined, page: page.current - 1, size: page.pageSize }),
    [filters, page],
  );

  const statusRulesQuery = useQuery({
    queryKey: ['battle-rules', 'status-rules', query],
    queryFn: () => battleRulesServices.statusRules.list(query),
  });

  const saveMutation = useMutation({
    mutationFn: (values: BattleStatusRuleRequest) => {
      const payload = compactRulePayload(values);
      if (modalMode === 'create') {
        return battleRulesServices.statusRules.create(payload);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的状态规则');
      }
      return battleRulesServices.statusRules.update(editingRecord.id, payload);
    },
    onSuccess: async () => {
      message.success('状态规则已保存');
      closeModal();
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'status-rules'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '保存状态规则失败')),
  });

  const removeMutation = useMutation({
    mutationFn: (record: BattleStatusRuleResponse) =>
      battleRulesServices.statusRules.remove(record.id),
    onSuccess: async () => {
      message.success('状态规则已删除');
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'status-rules'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '删除状态规则失败')),
  });

  const columns: ColumnsType<BattleStatusRuleResponse> = [
    { title: '编码', dataIndex: 'code', width: 180, fixed: 'left' },
    { title: '名称', dataIndex: 'name', width: 140 },
    { title: '状态类型', dataIndex: 'statusKind', width: 120, render: renderStatusKind },
    { title: '效果策略', dataIndex: 'effectPolicy', width: 190, render: renderPolicyTag },
    { title: '最少回合', dataIndex: 'minTurns', width: 100, render: renderOptionalText },
    { title: '最多回合', dataIndex: 'maxTurns', width: 100, render: renderOptionalText },
    { title: '启用', dataIndex: 'enabled', width: 90, render: renderEnabledTag },
    { title: '排序', dataIndex: 'sortOrder', width: 90 },
    { title: '说明', dataIndex: 'description', ellipsis: true, render: renderOptionalText },
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
            title="删除状态规则"
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
            状态规则
          </Typography.Title>
          <Typography.Text type="secondary">维护灼伤、麻痹等状态及其引擎策略。</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建状态
        </Button>
      </div>
      <Card size="small">
        <Form.Item label="关键字" className="!mb-0">
          <Input.Search
            allowClear
            placeholder="编码或名称"
            onSearch={(value) => updateFilter({ q: value.trim() })}
          />
        </Form.Item>
      </Card>
      <Card size="small">
        <Table<BattleStatusRuleResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(statusRulesQuery.data)}
          loading={statusRulesQuery.isLoading || statusRulesQuery.isFetching}
          scroll={{ x: 1320 }}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total: toPageTotal(statusRulesQuery.data),
            showSizeChanger: true,
            onChange: (current, pageSize) => setPage({ current, pageSize }),
          }}
        />
      </Card>
      <Modal
        open={modalOpen}
        title={modalMode === 'create' ? '新建状态规则' : '编辑状态规则'}
        okText="保存"
        cancelText="取消"
        confirmLoading={saveMutation.isPending}
        destroyOnHidden
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={(values) => saveMutation.mutate(values)}>
          <Form.Item name="code" label="编码" rules={requiredRule}>
            <Input placeholder="burn" />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={requiredRule}>
            <Input placeholder="灼伤" />
          </Form.Item>
          <Form.Item name="statusKind" label="状态类型" rules={requiredRule}>
            <Select showSearch={{ optionFilterProp: 'label' }} options={statusKindOptions} />
          </Form.Item>
          <Form.Item name="effectPolicy" label="效果策略" rules={requiredRule}>
            <Select showSearch={{ optionFilterProp: 'label' }} options={statusPolicyOptions} />
          </Form.Item>
          <Space size="middle" className="w-full" align="start">
            <Form.Item name="minTurns" label="最少回合">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="maxTurns" label="最多回合">
              <InputNumber min={0} />
            </Form.Item>
          </Space>
          <Form.Item name="description" label="说明">
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

  function updateFilter(next: Partial<StatusRuleFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }

  function openCreate() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue({ statusKind: 'MAJOR', enabled: true, sortOrder: 10 });
    setModalOpen(true);
  }

  function openEdit(record: BattleStatusRuleResponse) {
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

function renderStatusKind(value?: string) {
  return (
    statusKindOptions.find((option) => option.value === value)?.label ?? renderOptionalText(value)
  );
}
