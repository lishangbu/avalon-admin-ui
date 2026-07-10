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
  type BattleSkillFieldEffectListQuery,
  type BattleSkillFieldEffectRequest,
  type BattleSkillFieldEffectResponse,
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

interface SkillFieldEffectFilters {
  skillRuleId?: string;
  fieldRuleId?: string;
}

const targetSideOptions = [
  { value: 'USER_SIDE', label: '使用者一侧' },
  { value: 'TARGET_SIDE', label: '目标一侧' },
];

const effectTimingOptions = [{ value: 'AFTER_HIT', label: '命中后' }];

export function SkillFieldEffectsPage() {
  const [filters, setFilters] = useState<SkillFieldEffectFilters>({});
  const [page, setPage] = useState(defaultPageState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BattleRuleModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<BattleSkillFieldEffectResponse | null>(null);
  const [form] = Form.useForm<BattleSkillFieldEffectRequest>();
  const queryClient = useQueryClient();
  const options = useBattleRuleOptions(['skillRules', 'fieldRules', 'weatherRules']);

  const query = useMemo<BattleSkillFieldEffectListQuery>(
    () => ({
      skillRuleId: filters.skillRuleId,
      fieldRuleId: filters.fieldRuleId,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const effectsQuery = useQuery({
    queryKey: ['battle-rules', 'skill-field-effects', query],
    queryFn: () => battleRulesServices.skillFieldEffects.list(query),
  });

  const saveMutation = useMutation({
    mutationFn: (values: BattleSkillFieldEffectRequest) => {
      if (modalMode === 'create') {
        return battleRulesServices.skillFieldEffects.create(normalizeFormValues(values));
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的技能场上效果');
      }
      return battleRulesServices.skillFieldEffects.update(
        editingRecord.id,
        normalizeFormValues(values),
      );
    },
    onSuccess: async () => {
      message.success('技能场上效果已保存');
      closeModal();
      await queryClient.invalidateQueries({
        queryKey: ['battle-rules', 'skill-field-effects'],
      });
    },
    onError: (error) => message.error(apiErrorMessage(error, '保存技能场上效果失败')),
  });

  const removeMutation = useMutation({
    mutationFn: (record: BattleSkillFieldEffectResponse) =>
      battleRulesServices.skillFieldEffects.remove(record.id),
    onSuccess: async () => {
      message.success('技能场上效果已删除');
      await queryClient.invalidateQueries({
        queryKey: ['battle-rules', 'skill-field-effects'],
      });
    },
    onError: (error) => message.error(apiErrorMessage(error, '删除技能场上效果失败')),
  });

  const columns: ColumnsType<BattleSkillFieldEffectResponse> = [
    {
      title: '技能规则',
      dataIndex: 'skillRuleId',
      width: 320,
      fixed: 'left',
      render: (value?: number) => renderOptionLabel(options.skillRuleOptions, value),
    },
    {
      title: '场上效果',
      dataIndex: 'fieldRuleId',
      width: 220,
      render: (value?: number) => renderOptionLabel(options.sideFieldRuleOptions, value),
    },
    {
      title: '作用侧',
      dataIndex: 'targetSide',
      width: 130,
      render: renderTargetSide,
    },
    {
      title: '结算时机',
      dataIndex: 'effectTiming',
      width: 120,
      render: renderEffectTiming,
    },
    {
      title: '天气前置',
      dataIndex: 'requiredWeatherRuleId',
      width: 180,
      render: (value?: number | null) =>
        value ? renderOptionLabel(options.weatherRuleOptions, value) : '-',
    },
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
            title="删除技能场上效果"
            description="确认删除该技能场上效果？"
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
            技能场上效果
          </Typography.Title>
          <Typography.Text type="secondary">维护技能命中后建立的一侧场上效果。</Typography.Text>
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
              style={{ width: 320 }}
              value={filters.skillRuleId}
              onChange={(skillRuleId) => updateFilter({ skillRuleId })}
            />
          </Form.Item>
          <Form.Item label="场上效果" className="!mb-0">
            <Select
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              placeholder="全部场上效果"
              options={options.sideFieldRuleOptions}
              loading={options.loading}
              style={{ width: 240 }}
              value={filters.fieldRuleId}
              onChange={(fieldRuleId) => updateFilter({ fieldRuleId })}
            />
          </Form.Item>
        </div>
      </Card>
      <Card size="small">
        <Table<BattleSkillFieldEffectResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(effectsQuery.data)}
          loading={effectsQuery.isLoading || effectsQuery.isFetching}
          scroll={{ x: 1400 }}
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
        title={modalMode === 'create' ? '新建技能场上效果' : '编辑技能场上效果'}
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
          <Form.Item name="fieldRuleId" label="场上效果" rules={requiredSelectRule}>
            <Select
              showSearch={{ optionFilterProp: 'label' }}
              options={options.sideFieldRuleOptions}
              loading={options.loading}
            />
          </Form.Item>
          <Form.Item name="targetSide" label="作用侧" rules={requiredSelectRule}>
            <Select options={targetSideOptions} />
          </Form.Item>
          <Form.Item name="effectTiming" label="结算时机" rules={requiredSelectRule}>
            <Select options={effectTimingOptions} />
          </Form.Item>
          <Form.Item name="requiredWeatherRuleId" label="天气前置">
            <Select
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              options={options.weatherRuleOptions}
              loading={options.loading}
            />
          </Form.Item>
          <Space size="large">
            <Form.Item name="chancePercent" label="触发概率 (%)" rules={requiredRule}>
              <InputNumber min={1} max={100} />
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

  function updateFilter(next: Partial<SkillFieldEffectFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }

  function openCreate() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue({
      targetSide: 'USER_SIDE',
      effectTiming: 'AFTER_HIT',
      chancePercent: 100,
      enabled: true,
      sortOrder: 10,
    });
    setModalOpen(true);
  }

  function openEdit(record: BattleSkillFieldEffectResponse) {
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

function normalizeFormValues(values: BattleSkillFieldEffectRequest): BattleSkillFieldEffectRequest {
  return {
    ...values,
    requiredWeatherRuleId: values.requiredWeatherRuleId ?? undefined,
  };
}

function renderTargetSide(value?: string) {
  return targetSideOptions.find((option) => option.value === value)?.label ?? value ?? '-';
}

function renderEffectTiming(value?: string) {
  return effectTimingOptions.find((option) => option.value === value)?.label ?? value ?? '-';
}

function renderChance(value?: number) {
  return value === undefined ? '-' : `${value}%`;
}
