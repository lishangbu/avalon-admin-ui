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
  type BattleFormatClauseRequest,
  type BattleFormatClauseResponse,
  type BattleRulePageQuery,
} from '../../../services/battle-rules';
import { toPageRows, toPageTotal } from '../../system/shared/page-utils';
import {
  apiErrorMessage,
  compactRulePayload,
  defaultPageState,
  renderEnabledTag,
  renderOptionalText,
  requiredRule,
  type BattleRuleModalMode,
} from '../shared/battle-rule-page-utils';

interface FormatClauseFilters {
  q: string;
}

const clauseTypeOptions = [
  { label: '队伍限制', value: 'TEAM' },
  { label: '选出限制', value: 'SELECTION' },
  { label: '战斗限制', value: 'BATTLE' },
  { label: '道具限制', value: 'ITEM' },
];

export function FormatClausesPage() {
  const [filters, setFilters] = useState<FormatClauseFilters>({ q: '' });
  const [page, setPage] = useState(defaultPageState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BattleRuleModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<BattleFormatClauseResponse | null>(null);
  const [form] = Form.useForm<BattleFormatClauseRequest>();
  const queryClient = useQueryClient();

  const query = useMemo<BattleRulePageQuery>(
    () => ({ q: filters.q || undefined, page: page.current - 1, size: page.pageSize }),
    [filters, page],
  );

  const clausesQuery = useQuery({
    queryKey: ['battle-rules', 'format-clauses', query],
    queryFn: () => battleRulesServices.formatClauses.list(query),
  });

  const saveMutation = useMutation({
    mutationFn: (values: BattleFormatClauseRequest) => {
      const payload = compactRulePayload(values);
      if (modalMode === 'create') {
        return battleRulesServices.formatClauses.create(payload);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的赛制条款');
      }
      return battleRulesServices.formatClauses.update(editingRecord.id, payload);
    },
    onSuccess: async () => {
      message.success('赛制条款已保存');
      closeModal();
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'format-clauses'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '保存赛制条款失败')),
  });

  const removeMutation = useMutation({
    mutationFn: (record: BattleFormatClauseResponse) =>
      battleRulesServices.formatClauses.remove(record.id),
    onSuccess: async () => {
      message.success('赛制条款已删除');
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'format-clauses'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '删除赛制条款失败')),
  });

  const columns: ColumnsType<BattleFormatClauseResponse> = [
    { title: '编码', dataIndex: 'code', width: 180, fixed: 'left' },
    { title: '名称', dataIndex: 'name', width: 160 },
    { title: '条款类型', dataIndex: 'clauseType', width: 130, render: renderClauseType },
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
            title="删除赛制条款"
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
            赛制条款
          </Typography.Title>
          <Typography.Text type="secondary">
            维护可绑定到赛制的队伍、选出和战斗条款。
          </Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建条款
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
        <Table<BattleFormatClauseResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(clausesQuery.data)}
          loading={clausesQuery.isLoading || clausesQuery.isFetching}
          scroll={{ x: 980 }}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total: toPageTotal(clausesQuery.data),
            showSizeChanger: true,
            onChange: (current, pageSize) => setPage({ current, pageSize }),
          }}
        />
      </Card>
      <Modal
        open={modalOpen}
        title={modalMode === 'create' ? '新建赛制条款' : '编辑赛制条款'}
        okText="保存"
        cancelText="取消"
        confirmLoading={saveMutation.isPending}
        destroyOnHidden
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={(values) => saveMutation.mutate(values)}>
          <Form.Item name="code" label="编码" rules={requiredRule}>
            <Input placeholder="species-unique" />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={requiredRule}>
            <Input placeholder="种类唯一" />
          </Form.Item>
          <Form.Item name="clauseType" label="条款类型" rules={requiredRule}>
            <Select showSearch={{ optionFilterProp: 'label' }} options={clauseTypeOptions} />
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

  function updateFilter(next: Partial<FormatClauseFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }

  function openCreate() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue({ clauseType: 'TEAM', enabled: true, sortOrder: 10 });
    setModalOpen(true);
  }

  function openEdit(record: BattleFormatClauseResponse) {
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

function renderClauseType(value?: string) {
  return (
    clauseTypeOptions.find((option) => option.value === value)?.label ?? renderOptionalText(value)
  );
}
