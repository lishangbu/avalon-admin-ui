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
  type BattleItemRuleListQuery,
  type BattleItemRuleRequest,
  type BattleItemRuleResponse,
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

interface ItemRuleFilters {
  q: string;
  itemId?: number;
  triggerTiming?: string;
}

const triggerTimingOptions = [
  { label: '持有物回合结束', value: 'HELD_END_TURN' },
  { label: '伤害前', value: 'BEFORE_DAMAGE' },
  { label: '伤害后', value: 'AFTER_DAMAGE' },
  { label: '接触后', value: 'AFTER_CONTACT' },
  { label: '入场时', value: 'ON_SWITCH_IN' },
];

export function ItemRulesPage() {
  const [filters, setFilters] = useState<ItemRuleFilters>({ q: '' });
  const [page, setPage] = useState(defaultPageState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BattleRuleModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<BattleItemRuleResponse | null>(null);
  const [form] = Form.useForm<BattleItemRuleRequest>();
  const queryClient = useQueryClient();
  const options = useBattleRuleOptions(['items']);

  const query = useMemo<BattleItemRuleListQuery>(
    () => ({
      q: filters.q || undefined,
      itemId: filters.itemId,
      triggerTiming: filters.triggerTiming,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const itemRulesQuery = useQuery({
    queryKey: ['battle-rules', 'item-rules', query],
    queryFn: () => battleRulesServices.itemRules.list(query),
  });

  const saveMutation = useMutation({
    mutationFn: (values: BattleItemRuleRequest) => {
      const payload = compactRulePayload(values);
      if (modalMode === 'create') {
        return battleRulesServices.itemRules.create(payload);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的道具规则');
      }
      return battleRulesServices.itemRules.update(editingRecord.id, payload);
    },
    onSuccess: async () => {
      message.success('道具规则已保存');
      closeModal();
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'item-rules'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '保存道具规则失败')),
  });

  const removeMutation = useMutation({
    mutationFn: (record: BattleItemRuleResponse) => battleRulesServices.itemRules.remove(record.id),
    onSuccess: async () => {
      message.success('道具规则已删除');
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'item-rules'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '删除道具规则失败')),
  });

  const columns: ColumnsType<BattleItemRuleResponse> = [
    {
      title: '道具',
      dataIndex: 'itemId',
      width: 260,
      fixed: 'left',
      render: (value?: number) => renderOptionLabel(options.itemOptions, value),
    },
    { title: '触发时机', dataIndex: 'triggerTiming', width: 170, render: renderTriggerTiming },
    { title: '效果策略', dataIndex: 'effectPolicy', width: 220, render: renderPolicyTag },
    { title: '触发后消耗', dataIndex: 'consumable', width: 120, render: renderBooleanTag },
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
            title="删除道具规则"
            description="确认删除该道具规则？"
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
            道具规则
          </Typography.Title>
          <Typography.Text type="secondary">
            维护持有道具的触发时机、消耗和引擎效果。
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
          <Form.Item label="道具" className="!mb-0">
            <Select
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              placeholder="全部道具"
              options={options.itemOptions}
              loading={options.loading}
              style={{ width: 260 }}
              onChange={(itemId) => updateFilter({ itemId })}
            />
          </Form.Item>
          <Form.Item label="触发时机" className="!mb-0">
            <Select
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              placeholder="全部时机"
              options={triggerTimingOptions}
              style={{ width: 200 }}
              onChange={(triggerTiming) => updateFilter({ triggerTiming })}
            />
          </Form.Item>
        </div>
      </Card>
      <Card size="small">
        <Table<BattleItemRuleResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(itemRulesQuery.data)}
          loading={itemRulesQuery.isLoading || itemRulesQuery.isFetching}
          scroll={{ x: 1380 }}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total: toPageTotal(itemRulesQuery.data),
            showSizeChanger: true,
            onChange: (current, pageSize) => setPage({ current, pageSize }),
          }}
        />
      </Card>
      <Modal
        open={modalOpen}
        title={modalMode === 'create' ? '新建道具规则' : '编辑道具规则'}
        okText="保存"
        cancelText="取消"
        confirmLoading={saveMutation.isPending}
        destroyOnHidden
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={(values) => saveMutation.mutate(values)}>
          <Form.Item name="itemId" label="道具" rules={requiredSelectRule}>
            <Select
              showSearch={{ optionFilterProp: 'label' }}
              options={options.itemOptions}
              loading={options.loading}
            />
          </Form.Item>
          <Form.Item name="triggerTiming" label="触发时机" rules={requiredRule}>
            <Select showSearch={{ optionFilterProp: 'label' }} options={triggerTimingOptions} />
          </Form.Item>
          <Form.Item name="effectPolicy" label="效果策略" rules={requiredRule}>
            <Input placeholder="leftovers-heal" />
          </Form.Item>
          <Form.Item name="triggerOrder" label="结算顺序" rules={requiredRule}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item name="description" label="说明">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Space size="large">
            <Form.Item name="consumable" label="触发后消耗" valuePropName="checked">
              <Switch />
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

  function updateFilter(next: Partial<ItemRuleFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }

  function openCreate() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue({
      triggerTiming: 'HELD_END_TURN',
      triggerOrder: 100,
      consumable: false,
      enabled: true,
      sortOrder: 10,
    });
    setModalOpen(true);
  }

  function openEdit(record: BattleItemRuleResponse) {
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
