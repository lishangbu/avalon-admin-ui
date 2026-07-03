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
  type BattleFormatClauseBindingListQuery,
  type BattleFormatClauseBindingRequest,
  type BattleFormatClauseBindingResponse,
} from '../../../services/battle-rules';
import { toPageRows, toPageTotal } from '../../system/shared/page-utils';
import {
  apiErrorMessage,
  defaultPageState,
  renderBooleanTag,
  renderOptionLabel,
  requiredRule,
  requiredSelectRule,
  type BattleRuleModalMode,
} from '../shared/battle-rule-page-utils';
import { useBattleRuleOptions } from '../shared/useBattleRuleOptions';
import { message } from '../../../shared/feedback/message';

interface FormatClauseBindingFilters {
  formatId?: number;
  clauseId?: number;
}

export function FormatClauseBindingsPage() {
  const [filters, setFilters] = useState<FormatClauseBindingFilters>({});
  const [page, setPage] = useState(defaultPageState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BattleRuleModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<BattleFormatClauseBindingResponse | null>(
    null,
  );
  const [form] = Form.useForm<BattleFormatClauseBindingRequest>();
  const queryClient = useQueryClient();
  const options = useBattleRuleOptions(['formats', 'clauses']);

  const query = useMemo<BattleFormatClauseBindingListQuery>(
    () => ({
      formatId: filters.formatId,
      clauseId: filters.clauseId,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const bindingsQuery = useQuery({
    queryKey: ['battle-rules', 'format-clause-bindings', query],
    queryFn: () => battleRulesServices.formatClauseBindings.list(query),
  });

  const saveMutation = useMutation({
    mutationFn: (values: BattleFormatClauseBindingRequest) => {
      if (modalMode === 'create') {
        return battleRulesServices.formatClauseBindings.create(values);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的赛制条款绑定');
      }
      return battleRulesServices.formatClauseBindings.update(editingRecord.id, values);
    },
    onSuccess: async () => {
      message.success('赛制条款绑定已保存');
      closeModal();
      await queryClient.invalidateQueries({
        queryKey: ['battle-rules', 'format-clause-bindings'],
      });
    },
    onError: (error) => message.error(apiErrorMessage(error, '保存赛制条款绑定失败')),
  });

  const removeMutation = useMutation({
    mutationFn: (record: BattleFormatClauseBindingResponse) =>
      battleRulesServices.formatClauseBindings.remove(record.id),
    onSuccess: async () => {
      message.success('赛制条款绑定已删除');
      await queryClient.invalidateQueries({
        queryKey: ['battle-rules', 'format-clause-bindings'],
      });
    },
    onError: (error) => message.error(apiErrorMessage(error, '删除赛制条款绑定失败')),
  });

  const columns: ColumnsType<BattleFormatClauseBindingResponse> = [
    {
      title: '战斗赛制',
      dataIndex: 'formatId',
      width: 220,
      fixed: 'left',
      render: (value?: number) => renderOptionLabel(options.formatOptions, value),
    },
    {
      title: '赛制条款',
      dataIndex: 'clauseId',
      width: 220,
      render: (value?: number) => renderOptionLabel(options.clauseOptions, value),
    },
    { title: '强制条款', dataIndex: 'required', width: 120, render: renderBooleanTag },
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
            title="删除赛制条款绑定"
            description="确认删除该赛制条款绑定？"
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
            赛制条款绑定
          </Typography.Title>
          <Typography.Text type="secondary">维护每个赛制启用的条款集合。</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建绑定
        </Button>
      </div>
      <Card size="small">
        <div className="flex flex-wrap items-end gap-3">
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
          <Form.Item label="赛制条款" className="!mb-0">
            <Select
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              placeholder="全部条款"
              options={options.clauseOptions}
              loading={options.loading}
              style={{ width: 260 }}
              value={filters.clauseId}
              onChange={(clauseId) => updateFilter({ clauseId })}
            />
          </Form.Item>
        </div>
      </Card>
      <Card size="small">
        <Table<BattleFormatClauseBindingResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(bindingsQuery.data)}
          loading={bindingsQuery.isLoading || bindingsQuery.isFetching}
          scroll={{ x: 880 }}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total: toPageTotal(bindingsQuery.data),
            showSizeChanger: true,
            onChange: (current, pageSize) => setPage({ current, pageSize }),
          }}
        />
      </Card>
      <Modal
        open={modalOpen}
        title={modalMode === 'create' ? '新建赛制条款绑定' : '编辑赛制条款绑定'}
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
          <Form.Item name="clauseId" label="赛制条款" rules={requiredSelectRule}>
            <Select
              showSearch={{ optionFilterProp: 'label' }}
              options={options.clauseOptions}
              loading={options.loading}
            />
          </Form.Item>
          <Space size="large">
            <Form.Item name="required" label="强制条款" valuePropName="checked">
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

  function updateFilter(next: Partial<FormatClauseBindingFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }

  function openCreate() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue({ required: true, sortOrder: 10 });
    setModalOpen(true);
  }

  function openEdit(record: BattleFormatClauseBindingResponse) {
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
