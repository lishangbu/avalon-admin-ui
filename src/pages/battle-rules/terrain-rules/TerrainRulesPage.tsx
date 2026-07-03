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
  type BattleRulePageQuery,
  type BattleTerrainRuleRequest,
  type BattleTerrainRuleResponse,
} from '../../../services/battle-rules';
import { toPageRows, toPageTotal } from '../../system/shared/page-utils';
import { message } from '../../../shared/feedback/message';
import {
  apiErrorMessage,
  compactRulePayload,
  defaultPageState,
  renderEnabledTag,
  renderOptionalText,
  renderPolicyTag,
  requiredRule,
  terrainPolicyOptions,
  type BattleRuleModalMode,
} from '../shared/battle-rule-page-utils';

interface TerrainRuleFilters {
  q: string;
}

export function TerrainRulesPage() {
  const [filters, setFilters] = useState<TerrainRuleFilters>({ q: '' });
  const [page, setPage] = useState(defaultPageState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BattleRuleModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<BattleTerrainRuleResponse | null>(null);
  const [form] = Form.useForm<BattleTerrainRuleRequest>();
  const queryClient = useQueryClient();

  const query = useMemo<BattleRulePageQuery>(
    () => ({ q: filters.q || undefined, page: page.current - 1, size: page.pageSize }),
    [filters, page],
  );

  const terrainQuery = useQuery({
    queryKey: ['battle-rules', 'terrain-rules', query],
    queryFn: () => battleRulesServices.terrainRules.list(query),
  });

  const saveMutation = useMutation({
    mutationFn: (values: BattleTerrainRuleRequest) => {
      const payload = compactRulePayload(values);
      if (modalMode === 'create') {
        return battleRulesServices.terrainRules.create(payload);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的场地规则');
      }
      return battleRulesServices.terrainRules.update(editingRecord.id, payload);
    },
    onSuccess: async () => {
      message.success('场地规则已保存');
      closeModal();
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'terrain-rules'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '保存场地规则失败')),
  });

  const removeMutation = useMutation({
    mutationFn: (record: BattleTerrainRuleResponse) =>
      battleRulesServices.terrainRules.remove(record.id),
    onSuccess: async () => {
      message.success('场地规则已删除');
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'terrain-rules'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '删除场地规则失败')),
  });

  const columns: ColumnsType<BattleTerrainRuleResponse> = [
    { title: '编码', dataIndex: 'code', width: 180, fixed: 'left' },
    { title: '名称', dataIndex: 'name', width: 140 },
    { title: '效果策略', dataIndex: 'effectPolicy', width: 200, render: renderPolicyTag },
    {
      title: '默认回合',
      dataIndex: 'defaultDurationTurns',
      width: 110,
      render: renderOptionalText,
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
            title="删除场地规则"
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
            场地规则
          </Typography.Title>
          <Typography.Text type="secondary">维护电气场地等场地规则及默认持续回合。</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建场地
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
        <Table<BattleTerrainRuleResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(terrainQuery.data)}
          loading={terrainQuery.isLoading || terrainQuery.isFetching}
          scroll={{ x: 1180 }}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total: toPageTotal(terrainQuery.data),
            showSizeChanger: true,
            onChange: (current, pageSize) => setPage({ current, pageSize }),
          }}
        />
      </Card>
      <Modal
        open={modalOpen}
        title={modalMode === 'create' ? '新建场地规则' : '编辑场地规则'}
        okText="保存"
        cancelText="取消"
        confirmLoading={saveMutation.isPending}
        destroyOnHidden
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={(values) => saveMutation.mutate(values)}>
          <Form.Item name="code" label="编码" rules={requiredRule}>
            <Input placeholder="electric-terrain" />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={requiredRule}>
            <Input placeholder="电气场地" />
          </Form.Item>
          <Form.Item name="effectPolicy" label="效果策略" rules={requiredRule}>
            <Select showSearch={{ optionFilterProp: 'label' }} options={terrainPolicyOptions} />
          </Form.Item>
          <Form.Item name="defaultDurationTurns" label="默认持续回合">
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

  function updateFilter(next: Partial<TerrainRuleFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }

  function openCreate() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue({ enabled: true, sortOrder: 10 });
    setModalOpen(true);
  }

  function openEdit(record: BattleTerrainRuleResponse) {
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
