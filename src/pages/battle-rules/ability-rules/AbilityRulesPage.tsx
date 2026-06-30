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
  type BattleAbilityRuleListQuery,
  type BattleAbilityRuleRequest,
  type BattleAbilityRuleResponse,
} from '../../../services/battle-rules';
import { toPageRows, toPageTotal } from '../../system/shared/page-utils';
import {
  apiErrorMessage,
  compactRulePayload,
  defaultPageState,
  renderEnabledTag,
  renderOptionLabel,
  renderOptionalText,
  renderPolicyTag,
  requiredRule,
  requiredSelectRule,
  type BattleRuleModalMode,
} from '../shared/battle-rule-page-utils';
import { useBattleRuleOptions } from '../shared/useBattleRuleOptions';

interface AbilityRuleFilters {
  q: string;
  abilityId?: number;
  triggerTiming?: string;
}

const triggerTimingOptions = [
  { label: '伤害前', value: 'BEFORE_DAMAGE' },
  { label: '伤害后', value: 'AFTER_DAMAGE' },
  { label: '接触后', value: 'AFTER_CONTACT' },
  { label: '回合结束', value: 'END_TURN' },
  { label: '入场时', value: 'ON_SWITCH_IN' },
];

export function AbilityRulesPage() {
  const [filters, setFilters] = useState<AbilityRuleFilters>({ q: '' });
  const [page, setPage] = useState(defaultPageState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BattleRuleModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<BattleAbilityRuleResponse | null>(null);
  const [form] = Form.useForm<BattleAbilityRuleRequest>();
  const queryClient = useQueryClient();
  const options = useBattleRuleOptions(['abilities']);

  const query = useMemo<BattleAbilityRuleListQuery>(
    () => ({
      q: filters.q || undefined,
      abilityId: filters.abilityId,
      triggerTiming: filters.triggerTiming,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const abilityRulesQuery = useQuery({
    queryKey: ['battle-rules', 'ability-rules', query],
    queryFn: () => battleRulesServices.abilityRules.list(query),
  });

  const saveMutation = useMutation({
    mutationFn: (values: BattleAbilityRuleRequest) => {
      const payload = compactRulePayload(values);
      if (modalMode === 'create') {
        return battleRulesServices.abilityRules.create(payload);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的特性规则');
      }
      return battleRulesServices.abilityRules.update(editingRecord.id, payload);
    },
    onSuccess: async () => {
      message.success('特性规则已保存');
      closeModal();
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'ability-rules'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '保存特性规则失败')),
  });

  const removeMutation = useMutation({
    mutationFn: (record: BattleAbilityRuleResponse) =>
      battleRulesServices.abilityRules.remove(record.id),
    onSuccess: async () => {
      message.success('特性规则已删除');
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'ability-rules'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '删除特性规则失败')),
  });

  const columns: ColumnsType<BattleAbilityRuleResponse> = [
    {
      title: '特性',
      dataIndex: 'abilityId',
      width: 260,
      fixed: 'left',
      render: (value?: number) => renderOptionLabel(options.abilityOptions, value),
    },
    { title: '触发时机', dataIndex: 'triggerTiming', width: 150, render: renderTriggerTiming },
    { title: '效果策略', dataIndex: 'effectPolicy', width: 220, render: renderPolicyTag },
    { title: '结算顺序', dataIndex: 'triggerOrder', width: 110 },
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
            title="删除特性规则"
            description="确认删除该特性规则？"
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
            特性规则
          </Typography.Title>
          <Typography.Text type="secondary">维护特性在不同触发时机下的引擎效果。</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建规则
        </Button>
      </div>
      <Card size="small">
        <div className="flex flex-wrap items-end gap-3">
          <Form.Item label="关键字" className="!mb-0">
            <Input.Search
              allowClear
              placeholder="策略编码"
              onSearch={(value) => updateFilter({ q: value.trim() })}
            />
          </Form.Item>
          <Form.Item label="特性" className="!mb-0">
            <Select
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              placeholder="全部特性"
              options={options.abilityOptions}
              loading={options.loading}
              style={{ width: 260 }}
              onChange={(abilityId) => updateFilter({ abilityId })}
            />
          </Form.Item>
          <Form.Item label="触发时机" className="!mb-0">
            <Select
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              placeholder="全部时机"
              options={triggerTimingOptions}
              style={{ width: 180 }}
              onChange={(triggerTiming) => updateFilter({ triggerTiming })}
            />
          </Form.Item>
        </div>
      </Card>
      <Card size="small">
        <Table<BattleAbilityRuleResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(abilityRulesQuery.data)}
          loading={abilityRulesQuery.isLoading || abilityRulesQuery.isFetching}
          scroll={{ x: 1280 }}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total: toPageTotal(abilityRulesQuery.data),
            showSizeChanger: true,
            onChange: (current, pageSize) => setPage({ current, pageSize }),
          }}
        />
      </Card>
      <Modal
        open={modalOpen}
        title={modalMode === 'create' ? '新建特性规则' : '编辑特性规则'}
        okText="保存"
        cancelText="取消"
        confirmLoading={saveMutation.isPending}
        destroyOnHidden
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={(values) => saveMutation.mutate(values)}>
          <Form.Item name="abilityId" label="特性" rules={requiredSelectRule}>
            <Select
              showSearch={{ optionFilterProp: 'label' }}
              options={options.abilityOptions}
              loading={options.loading}
            />
          </Form.Item>
          <Form.Item name="triggerTiming" label="触发时机" rules={requiredRule}>
            <Select showSearch={{ optionFilterProp: 'label' }} options={triggerTimingOptions} />
          </Form.Item>
          <Form.Item name="effectPolicy" label="效果策略" rules={requiredRule}>
            <Input placeholder="low-hp-grass-boost" />
          </Form.Item>
          <Form.Item name="triggerOrder" label="结算顺序" rules={requiredRule}>
            <InputNumber min={0} />
          </Form.Item>
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

  function updateFilter(next: Partial<AbilityRuleFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }

  function openCreate() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue({
      triggerTiming: 'BEFORE_DAMAGE',
      triggerOrder: 100,
      enabled: true,
      sortOrder: 10,
    });
    setModalOpen(true);
  }

  function openEdit(record: BattleAbilityRuleResponse) {
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

function renderTriggerTiming(value?: string) {
  return triggerTimingOptions.find((option) => option.value === value)?.label ?? value ?? '-';
}
