import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  Form,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import {
  battleRulesServices,
  type BattleSkillStatusEffectListQuery,
  type BattleSkillStatusEffectRequest,
  type BattleSkillStatusEffectResponse,
} from '../../../services/battle-rules';
import { toPageRows, toPageTotal } from '../../system/shared/page-utils';
import {
  apiErrorMessage,
  defaultPageState,
  renderEnabledTag,
  renderOptionLabel,
  requiredRule,
  requiredSelectRule,
  type BattleRuleModalMode,
} from '../shared/battle-rule-page-utils';
import { useBattleRuleOptions } from '../shared/useBattleRuleOptions';
import { message } from '../../../shared/feedback/message';

interface SkillStatusEffectFilters {
  skillRuleId?: number;
  statusRuleId?: number;
}

const targetScopeOptions = [
  { label: '目标', value: 'TARGET' },
  { label: '使用者', value: 'USER' },
  { label: '全部对手', value: 'ALL_OPPONENTS' },
  { label: '全部队友', value: 'ALL_ALLIES' },
  { label: '全场成员', value: 'ALL_PARTICIPANTS' },
];

const effectTimingOptions = [
  { label: '命中后', value: 'AFTER_HIT' },
  { label: '伤害前', value: 'BEFORE_DAMAGE' },
  { label: '伤害后', value: 'AFTER_DAMAGE' },
  { label: '回合结束', value: 'END_TURN' },
];

export function SkillStatusEffectsPage() {
  const [filters, setFilters] = useState<SkillStatusEffectFilters>({});
  const [page, setPage] = useState(defaultPageState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BattleRuleModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<BattleSkillStatusEffectResponse | null>(null);
  const [form] = Form.useForm<BattleSkillStatusEffectRequest>();
  const queryClient = useQueryClient();
  const options = useBattleRuleOptions(['skillRules', 'statusRules']);

  const query = useMemo<BattleSkillStatusEffectListQuery>(
    () => ({
      skillRuleId: filters.skillRuleId,
      statusRuleId: filters.statusRuleId,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const effectsQuery = useQuery({
    queryKey: ['battle-rules', 'skill-status-effects', query],
    queryFn: () => battleRulesServices.skillStatusEffects.list(query),
  });

  const saveMutation = useMutation({
    mutationFn: (values: BattleSkillStatusEffectRequest) => {
      if (modalMode === 'create') {
        return battleRulesServices.skillStatusEffects.create(values);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的技能状态效果');
      }
      return battleRulesServices.skillStatusEffects.update(editingRecord.id, values);
    },
    onSuccess: async () => {
      message.success('技能状态效果已保存');
      closeModal();
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'skill-status-effects'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '保存技能状态效果失败')),
  });

  const removeMutation = useMutation({
    mutationFn: (record: BattleSkillStatusEffectResponse) =>
      battleRulesServices.skillStatusEffects.remove(record.id),
    onSuccess: async () => {
      message.success('技能状态效果已删除');
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'skill-status-effects'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '删除技能状态效果失败')),
  });

  const columns: ColumnsType<BattleSkillStatusEffectResponse> = [
    {
      title: '技能规则',
      dataIndex: 'skillRuleId',
      width: 300,
      fixed: 'left',
      render: (value?: number) => renderOptionLabel(options.skillRuleOptions, value),
    },
    {
      title: '状态规则',
      dataIndex: 'statusRuleId',
      width: 220,
      render: (value?: number) => renderOptionLabel(options.statusRuleOptions, value),
    },
    { title: '目标范围', dataIndex: 'targetScope', width: 130, render: renderTargetScope },
    { title: '结算时机', dataIndex: 'effectTiming', width: 130, render: renderEffectTiming },
    { title: '触发概率', dataIndex: 'chancePercent', width: 110, render: renderChance },
    { title: '启用', dataIndex: 'enabled', width: 90, render: renderEnabledTag },
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
            title="删除技能状态效果"
            description="确认删除该技能状态效果？"
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
            技能状态效果
          </Typography.Title>
          <Typography.Text type="secondary">维护技能命中后可附加的状态效果。</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建效果
        </Button>
      </div>
      <Card size="small">
        <div className="flex flex-wrap items-end gap-3">
          <Form.Item label="技能规则" className="!mb-0">
            <Select
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              placeholder="全部技能规则"
              options={options.skillRuleOptions}
              loading={options.loading}
              style={{ width: 300 }}
              value={filters.skillRuleId}
              onChange={(skillRuleId) => updateFilter({ skillRuleId })}
            />
          </Form.Item>
          <Form.Item label="状态规则" className="!mb-0">
            <Select
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              placeholder="全部状态"
              options={options.statusRuleOptions}
              loading={options.loading}
              style={{ width: 260 }}
              value={filters.statusRuleId}
              onChange={(statusRuleId) => updateFilter({ statusRuleId })}
            />
          </Form.Item>
        </div>
      </Card>
      <Card size="small">
        <Table<BattleSkillStatusEffectResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(effectsQuery.data)}
          loading={effectsQuery.isLoading || effectsQuery.isFetching}
          scroll={{ x: 1320 }}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total: toPageTotal(effectsQuery.data),
            showSizeChanger: true,
            onChange: (current, pageSize) => setPage({ current, pageSize }),
          }}
        />
      </Card>
      <Modal
        forceRender
        open={modalOpen}
        title={modalMode === 'create' ? '新建技能状态效果' : '编辑技能状态效果'}
        okText="保存"
        cancelText="取消"
        confirmLoading={saveMutation.isPending}
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={(values) => saveMutation.mutate(values)}>
          <Form.Item name="skillRuleId" label="技能规则" rules={requiredSelectRule}>
            <Select
              showSearch={{ optionFilterProp: 'label' }}
              options={options.skillRuleOptions}
              loading={options.loading}
            />
          </Form.Item>
          <Form.Item name="statusRuleId" label="状态规则" rules={requiredSelectRule}>
            <Select
              showSearch={{ optionFilterProp: 'label' }}
              options={options.statusRuleOptions}
              loading={options.loading}
            />
          </Form.Item>
          <Form.Item name="targetScope" label="目标范围" rules={requiredRule}>
            <Select showSearch={{ optionFilterProp: 'label' }} options={targetScopeOptions} />
          </Form.Item>
          <Form.Item name="effectTiming" label="结算时机" rules={requiredRule}>
            <Select showSearch={{ optionFilterProp: 'label' }} options={effectTimingOptions} />
          </Form.Item>
          <Form.Item name="chancePercent" label="触发概率" rules={requiredRule}>
            <InputNumber min={0} max={100} suffix="%" />
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

  function updateFilter(next: Partial<SkillStatusEffectFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }

  function openCreate() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue({
      targetScope: 'TARGET',
      effectTiming: 'AFTER_HIT',
      chancePercent: 100,
      enabled: true,
      sortOrder: 10,
    });
    setModalOpen(true);
  }

  function openEdit(record: BattleSkillStatusEffectResponse) {
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

function renderTargetScope(value?: string) {
  return targetScopeOptions.find((option) => option.value === value)?.label ?? value ?? '-';
}

function renderEffectTiming(value?: string) {
  return effectTimingOptions.find((option) => option.value === value)?.label ?? value ?? '-';
}

function renderChance(value?: number) {
  return value === undefined ? '-' : `${value}%`;
}
