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
  type BattleFormatSpecialMechanicListQuery,
  type BattleFormatSpecialMechanicRequest,
  type BattleFormatSpecialMechanicResponse,
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

interface FormatSpecialMechanicFilters {
  formatId?: number;
  mechanicId?: number;
}

export function FormatSpecialMechanicsPage() {
  const [filters, setFilters] = useState<FormatSpecialMechanicFilters>({});
  const [page, setPage] = useState(defaultPageState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BattleRuleModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<BattleFormatSpecialMechanicResponse | null>(
    null,
  );
  const [form] = Form.useForm<BattleFormatSpecialMechanicRequest>();
  const queryClient = useQueryClient();
  const options = useBattleRuleOptions();

  const query = useMemo<BattleFormatSpecialMechanicListQuery>(
    () => ({
      formatId: filters.formatId,
      mechanicId: filters.mechanicId,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const bindingsQuery = useQuery({
    queryKey: ['battle-rules', 'format-special-mechanics', query],
    queryFn: () => battleRulesServices.formatSpecialMechanics.list(query),
  });

  const saveMutation = useMutation({
    mutationFn: (values: BattleFormatSpecialMechanicRequest) => {
      if (modalMode === 'create') {
        return battleRulesServices.formatSpecialMechanics.create(values);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的赛制特殊机制');
      }
      return battleRulesServices.formatSpecialMechanics.update(editingRecord.id, values);
    },
    onSuccess: async () => {
      message.success('赛制特殊机制已保存');
      closeModal();
      await queryClient.invalidateQueries({
        queryKey: ['battle-rules', 'format-special-mechanics'],
      });
    },
    onError: (error) => message.error(apiErrorMessage(error, '保存赛制特殊机制失败')),
  });

  const removeMutation = useMutation({
    mutationFn: (record: BattleFormatSpecialMechanicResponse) =>
      battleRulesServices.formatSpecialMechanics.remove(record.id),
    onSuccess: async () => {
      message.success('赛制特殊机制已删除');
      await queryClient.invalidateQueries({
        queryKey: ['battle-rules', 'format-special-mechanics'],
      });
    },
    onError: (error) => message.error(apiErrorMessage(error, '删除赛制特殊机制失败')),
  });

  const columns: ColumnsType<BattleFormatSpecialMechanicResponse> = [
    {
      title: '战斗赛制',
      dataIndex: 'formatId',
      width: 240,
      fixed: 'left',
      render: (value?: number) => renderOptionLabel(options.formatOptions, value),
    },
    {
      title: '特殊机制',
      dataIndex: 'mechanicId',
      width: 260,
      render: (value?: number) => renderOptionLabel(options.mechanicOptions, value),
    },
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
            title="删除赛制特殊机制"
            description="确认删除该绑定？"
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
            赛制特殊机制
          </Typography.Title>
          <Typography.Text type="secondary">维护每个赛制是否启用指定特殊机制。</Typography.Text>
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
              onChange={(formatId) => updateFilter({ formatId })}
            />
          </Form.Item>
          <Form.Item label="特殊机制" className="!mb-0">
            <Select
              allowClear
              showSearch={{ optionFilterProp: 'label' }}
              placeholder="全部机制"
              options={options.mechanicOptions}
              loading={options.loading}
              style={{ width: 260 }}
              onChange={(mechanicId) => updateFilter({ mechanicId })}
            />
          </Form.Item>
        </div>
      </Card>
      <Card size="small">
        <Table<BattleFormatSpecialMechanicResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(bindingsQuery.data)}
          loading={bindingsQuery.isLoading || bindingsQuery.isFetching}
          scroll={{ x: 920 }}
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
        title={modalMode === 'create' ? '新建赛制特殊机制' : '编辑赛制特殊机制'}
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
          <Form.Item name="mechanicId" label="特殊机制" rules={requiredSelectRule}>
            <Select
              showSearch={{ optionFilterProp: 'label' }}
              options={options.mechanicOptions}
              loading={options.loading}
            />
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

  function updateFilter(next: Partial<FormatSpecialMechanicFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }

  function openCreate() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue({ enabled: true, sortOrder: 10 });
    setModalOpen(true);
  }

  function openEdit(record: BattleFormatSpecialMechanicResponse) {
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
