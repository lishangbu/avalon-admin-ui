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
  type BattleSkillRuleListQuery,
  type BattleSkillRuleRequest,
  type BattleSkillRuleResponse,
} from '../../../services/battle-rules';
import { toPageRows, toPageTotal } from '../../system/shared/page-utils';
import {
  apiErrorMessage,
  compactRulePayload,
  defaultPageState,
  renderBooleanTag,
  renderEnabledTag,
  renderOptionLabel,
  renderOptionalText,
  renderPolicyTag,
  requiredRule,
  requiredSelectRule,
  type BattleRuleModalMode,
} from '../shared/battle-rule-page-utils';
import { useBattleRuleOptions } from '../shared/useBattleRuleOptions';

interface SkillRuleFilters {
  q: string;
  skillId?: number;
}

export function SkillRulesPage() {
  const [filters, setFilters] = useState<SkillRuleFilters>({ q: '' });
  const [page, setPage] = useState(defaultPageState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BattleRuleModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<BattleSkillRuleResponse | null>(null);
  const [form] = Form.useForm<BattleSkillRuleRequest>();
  const queryClient = useQueryClient();
  const options = useBattleRuleOptions();

  const query = useMemo<BattleSkillRuleListQuery>(
    () => ({
      q: filters.q || undefined,
      skillId: filters.skillId,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const skillRulesQuery = useQuery({
    queryKey: ['battle-rules', 'skill-rules', query],
    queryFn: () => battleRulesServices.skillRules.list(query),
  });

  const saveMutation = useMutation({
    mutationFn: (values: BattleSkillRuleRequest) => {
      const payload = compactRulePayload(values);
      if (modalMode === 'create') {
        return battleRulesServices.skillRules.create(payload);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的技能规则');
      }
      return battleRulesServices.skillRules.update(editingRecord.id, payload);
    },
    onSuccess: async () => {
      message.success('技能规则已保存');
      closeModal();
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'skill-rules'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '保存技能规则失败')),
  });

  const removeMutation = useMutation({
    mutationFn: (record: BattleSkillRuleResponse) =>
      battleRulesServices.skillRules.remove(record.id),
    onSuccess: async () => {
      message.success('技能规则已删除');
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'skill-rules'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '删除技能规则失败')),
  });

  const columns: ColumnsType<BattleSkillRuleResponse> = [
    {
      title: '技能',
      dataIndex: 'skillId',
      width: 260,
      fixed: 'left',
      render: (value?: number) => renderOptionLabel(options.skillOptions, value),
    },
    { title: '主效果策略', dataIndex: 'effectPolicy', width: 230, render: renderPolicyTag },
    { title: '目标策略', dataIndex: 'targetPolicy', width: 180, render: renderPolicyTag },
    { title: '命中策略', dataIndex: 'hitPolicy', width: 180, render: renderPolicyTag },
    { title: '伤害策略', dataIndex: 'damagePolicy', width: 180, render: renderPolicyTag },
    {
      title: '命中段数',
      key: 'hitRange',
      width: 110,
      render: (_, record) =>
        record.minHits === record.maxHits ? record.minHits : `${record.minHits}-${record.maxHits}`,
    },
    { title: '要害等级', dataIndex: 'criticalHitStage', width: 100 },
    { title: '接触', dataIndex: 'makesContact', width: 90, render: renderBooleanTag },
    { title: '受保护阻挡', dataIndex: 'affectedByProtect', width: 120, render: renderBooleanTag },
    { title: '保护自身', dataIndex: 'protectsUser', width: 100, render: renderBooleanTag },
    { title: '自解冻', dataIndex: 'thawsUserBeforeMove', width: 90, render: renderBooleanTag },
    {
      title: '青草削弱',
      dataIndex: 'weakenedByGrassyTerrain',
      width: 100,
      render: renderBooleanTag,
    },
    { title: '成功后休整', dataIndex: 'rechargesAfterUse', width: 110, render: renderBooleanTag },
    { title: '声音类', dataIndex: 'soundBased', width: 90, render: renderBooleanTag },
    { title: '粉末类', dataIndex: 'powderBased', width: 90, render: renderBooleanTag },
    { title: '拳击类', dataIndex: 'punchBased', width: 90, render: renderBooleanTag },
    { title: '切割类', dataIndex: 'slicingBased', width: 90, render: renderBooleanTag },
    {
      title: '锁招回合',
      key: 'lockMoveRange',
      width: 110,
      render: (_, record) =>
        record.lockMoveTurnsMin === record.lockMoveTurnsMax
          ? record.lockMoveTurnsMin
          : `${record.lockMoveTurnsMin}-${record.lockMoveTurnsMax}`,
    },
    { title: '结束混乱', dataIndex: 'confusesUserAfterLock', width: 100, render: renderBooleanTag },
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
            title="删除技能规则"
            description="确认删除该技能规则？"
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
            技能规则
          </Typography.Title>
          <Typography.Text type="secondary">
            维护技能在战斗引擎中的目标、命中和伤害策略。
          </Typography.Text>
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
          <Form.Item label="技能" className="!mb-0">
            <Select
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              placeholder="全部技能"
              options={options.skillOptions}
              loading={options.loading}
              style={{ width: 280 }}
              onChange={(skillId) => updateFilter({ skillId })}
            />
          </Form.Item>
        </div>
      </Card>
      <Card size="small">
        <Table<BattleSkillRuleResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(skillRulesQuery.data)}
          loading={skillRulesQuery.isLoading || skillRulesQuery.isFetching}
          scroll={{ x: 3030 }}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total: toPageTotal(skillRulesQuery.data),
            showSizeChanger: true,
            onChange: (current, pageSize) => setPage({ current, pageSize }),
          }}
        />
      </Card>
      <Modal
        open={modalOpen}
        title={modalMode === 'create' ? '新建技能规则' : '编辑技能规则'}
        okText="保存"
        cancelText="取消"
        confirmLoading={saveMutation.isPending}
        destroyOnHidden
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={(values) => saveMutation.mutate(values)}>
          <Form.Item name="skillId" label="技能" rules={requiredSelectRule}>
            <Select
              showSearch={{ optionFilterProp: 'label' }}
              options={options.skillOptions}
              loading={options.loading}
            />
          </Form.Item>
          <Form.Item name="effectPolicy" label="主效果策略" rules={requiredRule}>
            <Input placeholder="standard-damage-with-status" />
          </Form.Item>
          <Form.Item name="targetPolicy" label="目标策略" rules={requiredRule}>
            <Input placeholder="selected-target" />
          </Form.Item>
          <Form.Item name="hitPolicy" label="命中策略" rules={requiredRule}>
            <Input placeholder="standard-hit" />
          </Form.Item>
          <Form.Item name="damagePolicy" label="伤害策略" rules={requiredRule}>
            <Input placeholder="standard-damage" />
          </Form.Item>
          <div className="grid gap-3 md:grid-cols-3">
            <Form.Item name="minHits" label="最小命中段数" rules={requiredRule}>
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="maxHits" label="最大命中段数" rules={requiredRule}>
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="criticalHitStage" label="要害等级" rules={requiredRule}>
              <InputNumber min={0} max={4} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Form.Item name="makesContact" label="接触目标" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="affectedByProtect" label="受保护类行动阻挡" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="protectsUser" label="保护自身" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="thawsUserBeforeMove" label="行动前自解冻" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item
              name="weakenedByGrassyTerrain"
              label="受青草场地削弱"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item name="rechargesAfterUse" label="成功后休整" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="soundBased" label="声音类" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="powderBased" label="粉末或孢子类" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="punchBased" label="拳击类" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="slicingBased" label="切割类" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="confusesUserAfterLock" label="锁招结束混乱" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Form.Item name="lockMoveTurnsMin" label="最小锁招回合" rules={requiredRule}>
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="lockMoveTurnsMax" label="最大锁招回合" rules={requiredRule}>
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
          </div>
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

  function updateFilter(next: Partial<SkillRuleFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }

  function openCreate() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue({
      effectPolicy: 'standard-damage',
      targetPolicy: 'selected-target',
      hitPolicy: 'standard-hit',
      damagePolicy: 'standard-damage',
      minHits: 1,
      maxHits: 1,
      criticalHitStage: 0,
      makesContact: false,
      affectedByProtect: true,
      protectsUser: false,
      thawsUserBeforeMove: false,
      weakenedByGrassyTerrain: false,
      rechargesAfterUse: false,
      soundBased: false,
      powderBased: false,
      punchBased: false,
      slicingBased: false,
      lockMoveTurnsMin: 1,
      lockMoveTurnsMax: 1,
      confusesUserAfterLock: false,
      enabled: true,
      sortOrder: 10,
    });
    setModalOpen(true);
  }

  function openEdit(record: BattleSkillRuleResponse) {
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
