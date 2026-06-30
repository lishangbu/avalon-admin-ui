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
  type BattleSkillStatStageOperationListQuery,
  type BattleSkillStatStageOperationRequest,
  type BattleSkillStatStageOperationResponse,
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

interface SkillStatStageOperationFilters {
  skillRuleId?: number;
  statId?: number;
  operationKind?: string;
}

const operationKindOptions = [
  { label: '清除', value: 'CLEAR' },
  { label: '复制', value: 'COPY' },
  { label: '交换', value: 'SWAP' },
  { label: '取反', value: 'INVERT' },
];

const targetScopeOptions = [
  { label: '使用者', value: 'USER' },
  { label: '目标', value: 'TARGET' },
  { label: '全部上场成员', value: 'ALL_ACTIVE' },
];

const sourceScopeOptions = [
  { label: '使用者', value: 'USER' },
  { label: '目标', value: 'TARGET' },
];

const effectTimingOptions = [{ label: '命中后', value: 'AFTER_HIT' }];

export function SkillStatStageOperationsPage() {
  const [filters, setFilters] = useState<SkillStatStageOperationFilters>({});
  const [page, setPage] = useState(defaultPageState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BattleRuleModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<BattleSkillStatStageOperationResponse | null>(
    null,
  );
  const [form] = Form.useForm<BattleSkillStatStageOperationRequest>();
  const queryClient = useQueryClient();
  const options = useBattleRuleOptions(['skillRules', 'stats']);

  const query = useMemo<BattleSkillStatStageOperationListQuery>(
    () => ({
      skillRuleId: filters.skillRuleId,
      statId: filters.statId,
      operationKind: filters.operationKind,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const operationsQuery = useQuery({
    queryKey: ['battle-rules', 'skill-stat-stage-operations', query],
    queryFn: () => battleRulesServices.skillStatStageOperations.list(query),
  });

  const saveMutation = useMutation({
    mutationFn: (values: BattleSkillStatStageOperationRequest) => {
      const normalizedValues = {
        ...values,
        sourceScope: values.sourceScope || undefined,
      };
      if (modalMode === 'create') {
        return battleRulesServices.skillStatStageOperations.create(normalizedValues);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的技能能力阶级操作');
      }
      return battleRulesServices.skillStatStageOperations.update(
        editingRecord.id,
        normalizedValues,
      );
    },
    onSuccess: async () => {
      message.success('技能能力阶级操作已保存');
      closeModal();
      await queryClient.invalidateQueries({
        queryKey: ['battle-rules', 'skill-stat-stage-operations'],
      });
    },
    onError: (error) => message.error(apiErrorMessage(error, '保存技能能力阶级操作失败')),
  });

  const removeMutation = useMutation({
    mutationFn: (record: BattleSkillStatStageOperationResponse) =>
      battleRulesServices.skillStatStageOperations.remove(record.id),
    onSuccess: async () => {
      message.success('技能能力阶级操作已删除');
      await queryClient.invalidateQueries({
        queryKey: ['battle-rules', 'skill-stat-stage-operations'],
      });
    },
    onError: (error) => message.error(apiErrorMessage(error, '删除技能能力阶级操作失败')),
  });

  const columns: ColumnsType<BattleSkillStatStageOperationResponse> = [
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
    { title: '操作类型', dataIndex: 'operationKind', width: 120, render: renderOperationKind },
    { title: '目标范围', dataIndex: 'targetScope', width: 140, render: renderTargetScope },
    { title: '来源范围', dataIndex: 'sourceScope', width: 120, render: renderSourceScope },
    { title: '结算时机', dataIndex: 'effectTiming', width: 120, render: renderEffectTiming },
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
            title="删除技能能力阶级操作"
            description="确认删除该技能能力阶级操作？"
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
            技能能力阶级操作
          </Typography.Title>
          <Typography.Text type="secondary">
            维护技能命中后清除、复制、交换和取反能力阶级的规则。
          </Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建操作
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
              onChange={(statId) => updateFilter({ statId })}
            />
          </Form.Item>
          <Form.Item label="操作类型" className="!mb-0">
            <Select
              allowClear
              placeholder="全部类型"
              options={operationKindOptions}
              style={{ width: 180 }}
              onChange={(operationKind) => updateFilter({ operationKind })}
            />
          </Form.Item>
        </div>
      </Card>
      <Card size="small">
        <Table<BattleSkillStatStageOperationResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(operationsQuery.data)}
          loading={operationsQuery.isLoading || operationsQuery.isFetching}
          scroll={{ x: 1420 }}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total: toPageTotal(operationsQuery.data),
            showSizeChanger: true,
            onChange: (current, pageSize) => setPage({ current, pageSize }),
          }}
        />
      </Card>
      <Modal
        open={modalOpen}
        title={modalMode === 'create' ? '新建技能能力阶级操作' : '编辑技能能力阶级操作'}
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
          <Space size="middle" className="w-full" align="start">
            <Form.Item name="operationKind" label="操作类型" rules={requiredRule}>
              <Select showSearch={{ optionFilterProp: 'label' }} options={operationKindOptions} />
            </Form.Item>
            <Form.Item name="effectTiming" label="结算时机" rules={requiredRule}>
              <Select showSearch={{ optionFilterProp: 'label' }} options={effectTimingOptions} />
            </Form.Item>
          </Space>
          <Space size="middle" className="w-full" align="start">
            <Form.Item name="targetScope" label="目标范围" rules={requiredRule}>
              <Select showSearch={{ optionFilterProp: 'label' }} options={targetScopeOptions} />
            </Form.Item>
            <Form.Item name="sourceScope" label="来源范围">
              <Select
                allowClear
                showSearch={{ optionFilterProp: 'label' }}
                options={sourceScopeOptions}
              />
            </Form.Item>
          </Space>
          <Space size="large">
            <Form.Item name="chancePercent" label="触发概率" rules={requiredRule}>
              <InputNumber min={0} max={100} suffix="%" />
            </Form.Item>
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

  function updateFilter(next: Partial<SkillStatStageOperationFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }

  function openCreate() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue({
      operationKind: 'CLEAR',
      targetScope: 'TARGET',
      sourceScope: undefined,
      effectTiming: 'AFTER_HIT',
      chancePercent: 100,
      enabled: true,
      sortOrder: 10,
    });
    setModalOpen(true);
  }

  function openEdit(record: BattleSkillStatStageOperationResponse) {
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

function renderOperationKind(value?: string) {
  return operationKindOptions.find((option) => option.value === value)?.label ?? value ?? '-';
}

function renderTargetScope(value?: string) {
  return targetScopeOptions.find((option) => option.value === value)?.label ?? value ?? '-';
}

function renderSourceScope(value?: string) {
  return sourceScopeOptions.find((option) => option.value === value)?.label ?? value ?? '-';
}

function renderEffectTiming(value?: string) {
  return effectTimingOptions.find((option) => option.value === value)?.label ?? value ?? '-';
}

function renderChance(value?: number) {
  return value === undefined ? '-' : `${value}%`;
}
