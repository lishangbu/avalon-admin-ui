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
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import {
  battleRulesServices,
  type BattleSkillStatStageEffectListQuery,
  type BattleSkillStatStageEffectRequest,
  type BattleSkillStatStageEffectResponse,
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

interface SkillStatStageEffectFilters {
  skillRuleId?: number;
  statId?: number;
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

export function SkillStatStageEffectsPage() {
  const [filters, setFilters] = useState<SkillStatStageEffectFilters>({});
  const [page, setPage] = useState(defaultPageState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BattleRuleModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<BattleSkillStatStageEffectResponse | null>(
    null,
  );
  const [form] = Form.useForm<BattleSkillStatStageEffectRequest>();
  const queryClient = useQueryClient();
  const options = useBattleRuleOptions(['skillRules', 'stats']);

  const query = useMemo<BattleSkillStatStageEffectListQuery>(
    () => ({
      skillRuleId: filters.skillRuleId,
      statId: filters.statId,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const effectsQuery = useQuery({
    queryKey: ['battle-rules', 'skill-stat-stage-effects', query],
    queryFn: () => battleRulesServices.skillStatStageEffects.list(query),
  });

  const saveMutation = useMutation({
    mutationFn: (values: BattleSkillStatStageEffectRequest) => {
      if (modalMode === 'create') {
        return battleRulesServices.skillStatStageEffects.create(values);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的技能能力阶级效果');
      }
      return battleRulesServices.skillStatStageEffects.update(editingRecord.id, values);
    },
    onSuccess: async () => {
      message.success('技能能力阶级效果已保存');
      closeModal();
      await queryClient.invalidateQueries({
        queryKey: ['battle-rules', 'skill-stat-stage-effects'],
      });
    },
    onError: (error) => message.error(apiErrorMessage(error, '保存技能能力阶级效果失败')),
  });

  const removeMutation = useMutation({
    mutationFn: (record: BattleSkillStatStageEffectResponse) =>
      battleRulesServices.skillStatStageEffects.remove(record.id),
    onSuccess: async () => {
      message.success('技能能力阶级效果已删除');
      await queryClient.invalidateQueries({
        queryKey: ['battle-rules', 'skill-stat-stage-effects'],
      });
    },
    onError: (error) => message.error(apiErrorMessage(error, '删除技能能力阶级效果失败')),
  });

  const columns: ColumnsType<BattleSkillStatStageEffectResponse> = [
    {
      title: '技能规则',
      dataIndex: 'skillRuleId',
      width: 300,
      fixed: 'left',
      render: (value?: number) => renderOptionLabel(options.skillRuleOptions, value),
    },
    {
      title: '能力项',
      dataIndex: 'statId',
      width: 180,
      render: (value?: number) => renderOptionLabel(options.statOptions, value),
    },
    { title: '目标范围', dataIndex: 'targetScope', width: 130, render: renderTargetScope },
    { title: '结算时机', dataIndex: 'effectTiming', width: 130, render: renderEffectTiming },
    { title: '阶级变化', dataIndex: 'stageDelta', width: 110, render: renderStageDelta },
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
            title="删除技能能力阶级效果"
            description="确认删除该技能能力阶级效果？"
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
            技能能力阶级效果
          </Typography.Title>
          <Typography.Text type="secondary">维护技能附带的能力阶级变化效果。</Typography.Text>
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
          <Form.Item label="能力项" className="!mb-0">
            <Select
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              placeholder="全部能力项"
              options={options.statOptions}
              loading={options.loading}
              style={{ width: 220 }}
              value={filters.statId}
              onChange={(statId) => updateFilter({ statId })}
            />
          </Form.Item>
        </div>
      </Card>
      <Card size="small">
        <Table<BattleSkillStatStageEffectResponse>
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
        open={modalOpen}
        title={modalMode === 'create' ? '新建技能能力阶级效果' : '编辑技能能力阶级效果'}
        okText="保存"
        cancelText="取消"
        confirmLoading={saveMutation.isPending}
        destroyOnHidden
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
          <Form.Item name="statId" label="能力项" rules={requiredSelectRule}>
            <Select
              showSearch={{ optionFilterProp: 'label' }}
              options={options.statOptions}
              loading={options.loading}
            />
          </Form.Item>
          <Form.Item name="targetScope" label="目标范围" rules={requiredRule}>
            <Select showSearch={{ optionFilterProp: 'label' }} options={targetScopeOptions} />
          </Form.Item>
          <Form.Item name="effectTiming" label="结算时机" rules={requiredRule}>
            <Select showSearch={{ optionFilterProp: 'label' }} options={effectTimingOptions} />
          </Form.Item>
          <Space size="middle" className="w-full" align="start">
            <Form.Item name="stageDelta" label="阶级变化" rules={requiredRule}>
              <InputNumber min={-6} max={6} />
            </Form.Item>
            <Form.Item name="chancePercent" label="触发概率" rules={requiredRule}>
              <InputNumber min={0} max={100} suffix="%" />
            </Form.Item>
          </Space>
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

  function updateFilter(next: Partial<SkillStatStageEffectFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }

  function openCreate() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue({
      targetScope: 'TARGET',
      effectTiming: 'AFTER_HIT',
      stageDelta: -1,
      chancePercent: 100,
      enabled: true,
      sortOrder: 10,
    });
    setModalOpen(true);
  }

  function openEdit(record: BattleSkillStatStageEffectResponse) {
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

function renderStageDelta(value?: number) {
  if (value === undefined) {
    return '-';
  }
  return value > 0 ? `+${value}` : String(value);
}

function renderChance(value?: number) {
  return value === undefined ? '-' : `${value}%`;
}
