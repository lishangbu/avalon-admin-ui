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
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import {
  battleRulesServices,
  type BattleFormatRequest,
  type BattleFormatResponse,
  type BattleRulePageQuery,
} from '../../../services/battle-rules';
import { toPageRows, toPageTotal } from '../../system/shared/page-utils';
import { message } from '../../../shared/feedback/message';
import {
  apiErrorMessage,
  compactRulePayload,
  defaultPageState,
  renderBooleanTag,
  renderEnabledTag,
  renderOptionalText,
  requiredRule,
  type BattleRuleModalMode,
} from '../shared/battle-rule-page-utils';

interface BattleFormatFilters {
  q: string;
}

const battleModeOptions = [
  { label: '单打', value: 'SINGLE' },
  { label: '双打', value: 'DOUBLE' },
  { label: '多人', value: 'MULTI' },
];

export function BattleFormatsPage() {
  const [filters, setFilters] = useState<BattleFormatFilters>({ q: '' });
  const [page, setPage] = useState(defaultPageState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BattleRuleModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<BattleFormatResponse | null>(null);
  const [form] = Form.useForm<BattleFormatRequest>();
  const queryClient = useQueryClient();

  const query = useMemo<BattleRulePageQuery>(
    () => ({
      q: filters.q || undefined,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const formatsQuery = useQuery({
    queryKey: ['battle-rules', 'battle-formats', query],
    queryFn: () => battleRulesServices.battleFormats.list(query),
  });

  const saveMutation = useMutation({
    mutationFn: (values: BattleFormatRequest) => {
      const payload = compactRulePayload(values);
      if (modalMode === 'create') {
        return battleRulesServices.battleFormats.create(payload);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的战斗赛制');
      }
      return battleRulesServices.battleFormats.update(editingRecord.id, payload);
    },
    onSuccess: async () => {
      message.success('战斗赛制已保存');
      closeModal();
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'battle-formats'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '保存战斗赛制失败')),
  });

  const removeMutation = useMutation({
    mutationFn: (record: BattleFormatResponse) =>
      battleRulesServices.battleFormats.remove(record.id),
    onSuccess: async () => {
      message.success('战斗赛制已删除');
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'battle-formats'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '删除战斗赛制失败')),
  });

  const columns: ColumnsType<BattleFormatResponse> = [
    { title: '编码', dataIndex: 'code', width: 180, fixed: 'left' },
    { title: '名称', dataIndex: 'name', width: 160 },
    { title: '站位模式', dataIndex: 'battleMode', width: 120, render: renderBattleMode },
    { title: '玩家数', dataIndex: 'playerCount', width: 100 },
    { title: '队伍数量', dataIndex: 'teamSize', width: 110 },
    { title: '同时上场', dataIndex: 'activeParticipantCount', width: 110 },
    { title: '默认等级', dataIndex: 'defaultLevel', width: 110, render: renderOptionalText },
    {
      title: '允许自定义',
      dataIndex: 'allowCustomRules',
      width: 120,
      render: (value?: boolean) => renderBooleanTag(value),
    },
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
            title="删除战斗赛制"
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
            战斗赛制
          </Typography.Title>
          <Typography.Text type="secondary">维护现代规则下可选择的对战赛制。</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建赛制
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
        <Table<BattleFormatResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(formatsQuery.data)}
          loading={formatsQuery.isLoading || formatsQuery.isFetching}
          scroll={{ x: 1380 }}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total: toPageTotal(formatsQuery.data),
            showSizeChanger: true,
            onChange: (current, pageSize) => setPage({ current, pageSize }),
          }}
        />
      </Card>
      <Modal
        open={modalOpen}
        title={modalMode === 'create' ? '新建战斗赛制' : '编辑战斗赛制'}
        okText="保存"
        cancelText="取消"
        confirmLoading={saveMutation.isPending}
        destroyOnHidden
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={(values) => saveMutation.mutate(values)}>
          <Form.Item name="code" label="编码" rules={requiredRule}>
            <Input placeholder="standard-single" />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={requiredRule}>
            <Input placeholder="标准单打" />
          </Form.Item>
          <Form.Item name="description" label="说明">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="battleMode" label="站位模式" rules={requiredRule}>
            <Select showSearch={{ optionFilterProp: 'label' }} options={battleModeOptions} />
          </Form.Item>
          <Space size="middle" className="w-full" align="start">
            <Form.Item name="playerCount" label="玩家数" rules={requiredRule}>
              <InputNumber min={2} max={4} />
            </Form.Item>
            <Form.Item name="teamSize" label="队伍数量" rules={requiredRule}>
              <InputNumber min={1} max={6} />
            </Form.Item>
            <Form.Item name="activeParticipantCount" label="同时上场" rules={requiredRule}>
              <InputNumber min={1} max={2} />
            </Form.Item>
            <Form.Item name="defaultLevel" label="默认等级">
              <InputNumber min={1} max={100} />
            </Form.Item>
          </Space>
          <Space size="large">
            <Form.Item name="allowCustomRules" label="允许自定义" valuePropName="checked">
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

  function updateFilter(next: Partial<BattleFormatFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }

  function openCreate() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue({
      battleMode: 'SINGLE',
      playerCount: 2,
      teamSize: 6,
      activeParticipantCount: 1,
      allowCustomRules: true,
      enabled: true,
      sortOrder: 10,
    });
    setModalOpen(true);
  }

  function openEdit(record: BattleFormatResponse) {
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

function renderBattleMode(value?: string) {
  return (
    battleModeOptions.find((option) => option.value === value)?.label ?? renderOptionalText(value)
  );
}
