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
  type BattleRulePageQuery,
  type BattleSpecialMechanicRequest,
  type BattleSpecialMechanicResponse,
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

interface SpecialMechanicFilters {
  q: string;
}

export function SpecialMechanicsPage() {
  const [filters, setFilters] = useState<SpecialMechanicFilters>({ q: '' });
  const [page, setPage] = useState(defaultPageState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BattleRuleModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<BattleSpecialMechanicResponse | null>(null);
  const [form] = Form.useForm<BattleSpecialMechanicRequest>();
  const queryClient = useQueryClient();

  const query = useMemo<BattleRulePageQuery>(
    () => ({ q: filters.q || undefined, page: page.current - 1, size: page.pageSize }),
    [filters, page],
  );

  const mechanicsQuery = useQuery({
    queryKey: ['battle-rules', 'special-mechanics', query],
    queryFn: () => battleRulesServices.specialMechanics.list(query),
  });

  const saveMutation = useMutation({
    mutationFn: (values: BattleSpecialMechanicRequest) => {
      const payload = compactRulePayload(values);
      if (modalMode === 'create') {
        return battleRulesServices.specialMechanics.create(payload);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的特殊机制');
      }
      return battleRulesServices.specialMechanics.update(editingRecord.id, payload);
    },
    onSuccess: async () => {
      message.success('特殊机制已保存');
      closeModal();
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'special-mechanics'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '保存特殊机制失败')),
  });

  const removeMutation = useMutation({
    mutationFn: (record: BattleSpecialMechanicResponse) =>
      battleRulesServices.specialMechanics.remove(record.id),
    onSuccess: async () => {
      message.success('特殊机制已删除');
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'special-mechanics'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '删除特殊机制失败')),
  });

  const columns: ColumnsType<BattleSpecialMechanicResponse> = [
    { title: '编码', dataIndex: 'code', width: 220, fixed: 'left' },
    { title: '名称', dataIndex: 'name', width: 180 },
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
            title="删除特殊机制"
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
            特殊机制
          </Typography.Title>
          <Typography.Text type="secondary">维护可被赛制启用或禁用的特殊战斗机制。</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建机制
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
        <Table<BattleSpecialMechanicResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(mechanicsQuery.data)}
          loading={mechanicsQuery.isLoading || mechanicsQuery.isFetching}
          scroll={{ x: 980 }}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total: toPageTotal(mechanicsQuery.data),
            showSizeChanger: true,
            onChange: (current, pageSize) => setPage({ current, pageSize }),
          }}
        />
      </Card>
      <Modal
        open={modalOpen}
        title={modalMode === 'create' ? '新建特殊机制' : '编辑特殊机制'}
        okText="保存"
        cancelText="取消"
        confirmLoading={saveMutation.isPending}
        destroyOnHidden
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={(values) => saveMutation.mutate(values)}>
          <Form.Item name="code" label="编码" rules={requiredRule}>
            <Input placeholder="temporary-type-boost" />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={requiredRule}>
            <Input placeholder="临时属性强化" />
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

  function updateFilter(next: Partial<SpecialMechanicFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }

  function openCreate() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue({ enabled: true, sortOrder: 10 });
    setModalOpen(true);
  }

  function openEdit(record: BattleSpecialMechanicResponse) {
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
