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
  type BattleFormatRestrictionListQuery,
  type BattleFormatRestrictionRequest,
  type BattleFormatRestrictionResponse,
} from '../../../services/battle-rules';
import { toPageRows, toPageTotal } from '../../system/shared/page-utils';
import {
  apiErrorMessage,
  compactRulePayload,
  defaultPageState,
  renderEnabledTag,
  renderOptionLabel,
  renderOptionalText,
  requiredRule,
  requiredSelectRule,
  type BattleRuleModalMode,
} from '../shared/battle-rule-page-utils';
import { useBattleRuleOptions } from '../shared/useBattleRuleOptions';

interface FormatRestrictionFilters {
  q: string;
  formatId?: number;
}

const restrictionTypeOptions = [
  { label: '等级', value: 'LEVEL' },
  { label: '队伍', value: 'TEAM' },
  { label: '成员', value: 'PARTICIPANT' },
  { label: '道具', value: 'ITEM' },
  { label: '技能', value: 'SKILL' },
];

const restrictionOperatorOptions = [
  { label: '最大值', value: 'MAX' },
  { label: '最小值', value: 'MIN' },
  { label: '必须包含', value: 'INCLUDE' },
  { label: '禁止包含', value: 'EXCLUDE' },
  { label: '等于', value: 'EQUALS' },
];

export function FormatRestrictionsPage() {
  const [filters, setFilters] = useState<FormatRestrictionFilters>({ q: '' });
  const [page, setPage] = useState(defaultPageState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BattleRuleModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<BattleFormatRestrictionResponse | null>(null);
  const [form] = Form.useForm<BattleFormatRestrictionRequest>();
  const queryClient = useQueryClient();
  const options = useBattleRuleOptions(['formats']);

  const query = useMemo<BattleFormatRestrictionListQuery>(
    () => ({
      q: filters.q || undefined,
      formatId: filters.formatId,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const restrictionsQuery = useQuery({
    queryKey: ['battle-rules', 'format-restrictions', query],
    queryFn: () => battleRulesServices.formatRestrictions.list(query),
  });

  const saveMutation = useMutation({
    mutationFn: (values: BattleFormatRestrictionRequest) => {
      const payload = compactRulePayload(values);
      if (modalMode === 'create') {
        return battleRulesServices.formatRestrictions.create(payload);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的赛制限制');
      }
      return battleRulesServices.formatRestrictions.update(editingRecord.id, payload);
    },
    onSuccess: async () => {
      message.success('赛制限制已保存');
      closeModal();
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'format-restrictions'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '保存赛制限制失败')),
  });

  const removeMutation = useMutation({
    mutationFn: (record: BattleFormatRestrictionResponse) =>
      battleRulesServices.formatRestrictions.remove(record.id),
    onSuccess: async () => {
      message.success('赛制限制已删除');
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'format-restrictions'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '删除赛制限制失败')),
  });

  const columns: ColumnsType<BattleFormatRestrictionResponse> = [
    {
      title: '战斗赛制',
      dataIndex: 'formatId',
      width: 220,
      fixed: 'left',
      render: (value?: number) => renderOptionLabel(options.formatOptions, value),
    },
    { title: '编码', dataIndex: 'code', width: 180 },
    { title: '名称', dataIndex: 'name', width: 160 },
    { title: '限制类型', dataIndex: 'restrictionType', width: 130, render: renderRestrictionType },
    {
      title: '判定方式',
      dataIndex: 'restrictionOperator',
      width: 130,
      render: renderRestrictionOperator,
    },
    { title: '文本操作数', dataIndex: 'operandText', width: 150, render: renderOptionalText },
    { title: '数值操作数', dataIndex: 'operandNumber', width: 120, render: renderOptionalText },
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
            title="删除赛制限制"
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
            赛制限制
          </Typography.Title>
          <Typography.Text type="secondary">维护赛制内的等级、队伍和资源限制。</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建限制
        </Button>
      </div>
      <Card size="small">
        <div className="flex flex-wrap items-end gap-3">
          <Form.Item label="关键字" className="!mb-0">
            <Input.Search
              allowClear
              placeholder="编码或名称"
              onSearch={(value) => updateFilter({ q: value.trim() })}
            />
          </Form.Item>
          <Form.Item label="战斗赛制" className="!mb-0">
            <Select
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              placeholder="全部赛制"
              options={options.formatOptions}
              loading={options.loading}
              style={{ width: 260 }}
              value={filters.formatId}
              onChange={(formatId) => updateFilter({ formatId })}
            />
          </Form.Item>
        </div>
      </Card>
      <Card size="small">
        <Table<BattleFormatRestrictionResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(restrictionsQuery.data)}
          loading={restrictionsQuery.isLoading || restrictionsQuery.isFetching}
          scroll={{ x: 1580 }}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total: toPageTotal(restrictionsQuery.data),
            showSizeChanger: true,
            onChange: (current, pageSize) => setPage({ current, pageSize }),
          }}
        />
      </Card>
      <Modal
        open={modalOpen}
        title={modalMode === 'create' ? '新建赛制限制' : '编辑赛制限制'}
        okText="保存"
        cancelText="取消"
        confirmLoading={saveMutation.isPending}
        destroyOnHidden
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={(values) => saveMutation.mutate(values)}>
          <Form.Item name="formatId" label="战斗赛制" rules={requiredSelectRule}>
            <Select
              showSearch={{ optionFilterProp: 'label' }}
              options={options.formatOptions}
              loading={options.loading}
            />
          </Form.Item>
          <Form.Item name="code" label="编码" rules={requiredRule}>
            <Input placeholder="level-cap-50" />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={requiredRule}>
            <Input placeholder="等级上限" />
          </Form.Item>
          <Form.Item name="restrictionType" label="限制类型" rules={requiredRule}>
            <Select showSearch={{ optionFilterProp: 'label' }} options={restrictionTypeOptions} />
          </Form.Item>
          <Form.Item name="restrictionOperator" label="判定方式" rules={requiredRule}>
            <Select
              showSearch={{ optionFilterProp: 'label' }}
              options={restrictionOperatorOptions}
            />
          </Form.Item>
          <Space size="middle" className="w-full" align="start">
            <Form.Item name="operandText" label="文本操作数">
              <Input placeholder="可选" />
            </Form.Item>
            <Form.Item name="operandNumber" label="数值操作数">
              <InputNumber />
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

  function updateFilter(next: Partial<FormatRestrictionFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }

  function openCreate() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue({
      restrictionType: 'LEVEL',
      restrictionOperator: 'MAX',
      enabled: true,
      sortOrder: 10,
    });
    setModalOpen(true);
  }

  function openEdit(record: BattleFormatRestrictionResponse) {
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

function renderRestrictionType(value?: string) {
  return (
    restrictionTypeOptions.find((option) => option.value === value)?.label ??
    renderOptionalText(value)
  );
}

function renderRestrictionOperator(value?: string) {
  return (
    restrictionOperatorOptions.find((option) => option.value === value)?.label ??
    renderOptionalText(value)
  );
}
