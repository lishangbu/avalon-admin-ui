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
  Table,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import {
  battleRulesServices,
  type BattleRuleFixtureSourceListQuery,
  type BattleRuleFixtureSourceRequest,
  type BattleRuleFixtureSourceResponse,
} from '../../../services/battle-rules';
import { toPageRows, toPageTotal } from '../../system/shared/page-utils';
import {
  apiErrorMessage,
  compactRulePayload,
  defaultPageState,
  makeOptions,
  renderOptionLabel,
  renderOptionalText,
  requiredRule,
  requiredSelectRule,
  type BattleRuleModalMode,
} from '../shared/battle-rule-page-utils';

interface FixtureSourceFilters {
  fixtureId?: number;
}

const optionQuery = { page: 0, size: 2000 };

export function FixtureSourcesPage() {
  const [filters, setFilters] = useState<FixtureSourceFilters>({});
  const [page, setPage] = useState(defaultPageState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BattleRuleModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<BattleRuleFixtureSourceResponse | null>(null);
  const [form] = Form.useForm<BattleRuleFixtureSourceRequest>();
  const queryClient = useQueryClient();

  const fixtureOptionsQuery = useQuery({
    queryKey: ['battle-rules', 'fixtures', 'source-options'],
    queryFn: () => battleRulesServices.fixtures.list(optionQuery),
    staleTime: 5 * 60 * 1000,
  });
  const fixtureOptions = useMemo(
    () => makeOptions(toPageRows(fixtureOptionsQuery.data)),
    [fixtureOptionsQuery.data],
  );

  const query = useMemo<BattleRuleFixtureSourceListQuery>(
    () => ({
      fixtureId: filters.fixtureId,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const sourcesQuery = useQuery({
    queryKey: ['battle-rules', 'fixture-sources', query],
    queryFn: () => battleRulesServices.fixtureSources.list(query),
  });

  const saveMutation = useMutation({
    mutationFn: (values: BattleRuleFixtureSourceRequest) => {
      const payload = compactRulePayload(values);
      if (modalMode === 'create') {
        return battleRulesServices.fixtureSources.create(payload);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的 Fixture 来源');
      }
      return battleRulesServices.fixtureSources.update(editingRecord.id, payload);
    },
    onSuccess: async () => {
      message.success('Fixture 来源已保存');
      closeModal();
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'fixture-sources'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '保存 Fixture 来源失败')),
  });

  const removeMutation = useMutation({
    mutationFn: (record: BattleRuleFixtureSourceResponse) =>
      battleRulesServices.fixtureSources.remove(record.id),
    onSuccess: async () => {
      message.success('Fixture 来源已删除');
      await queryClient.invalidateQueries({ queryKey: ['battle-rules', 'fixture-sources'] });
    },
    onError: (error) => message.error(apiErrorMessage(error, '删除 Fixture 来源失败')),
  });

  const columns: ColumnsType<BattleRuleFixtureSourceResponse> = [
    {
      title: 'Fixture',
      dataIndex: 'fixtureId',
      width: 360,
      fixed: 'left',
      render: (value?: number) => renderOptionLabel(fixtureOptions, value),
    },
    { title: '来源名称', dataIndex: 'sourceLabel', width: 180, render: renderOptionalText },
    {
      title: '来源地址',
      dataIndex: 'sourceUrl',
      width: 360,
      ellipsis: true,
      render: (value?: string) =>
        value ? (
          <Typography.Link href={value} target="_blank" rel="noreferrer">
            {value}
          </Typography.Link>
        ) : (
          '-'
        ),
    },
    {
      title: '来源说明',
      dataIndex: 'sourceNote',
      width: 320,
      ellipsis: true,
      render: renderOptionalText,
    },
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
            title="删除 Fixture 来源"
            description="确认删除该公开来源？"
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
            Fixture 来源
          </Typography.Title>
          <Typography.Text type="secondary">
            维护每个对照 Fixture 使用的公开规则来源。
          </Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建来源
        </Button>
      </div>

      <Card size="small">
        <Form.Item label="Fixture" className="!mb-0">
          <Select
            allowClear
            showSearch={{ optionFilterProp: 'label' }}
            placeholder="全部 Fixture"
            options={fixtureOptions}
            loading={fixtureOptionsQuery.isLoading}
            style={{ width: 360 }}
            onChange={(fixtureId) => updateFilter({ fixtureId })}
          />
        </Form.Item>
      </Card>

      <Card size="small">
        <Table<BattleRuleFixtureSourceResponse>
          rowKey="id"
          columns={columns}
          dataSource={toPageRows(sourcesQuery.data)}
          loading={sourcesQuery.isLoading || sourcesQuery.isFetching}
          scroll={{ x: 1460 }}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total: toPageTotal(sourcesQuery.data),
            showSizeChanger: true,
            onChange: (current, pageSize) => setPage({ current, pageSize }),
          }}
        />
      </Card>

      <Modal
        open={modalOpen}
        title={modalMode === 'create' ? '新建 Fixture 来源' : '编辑 Fixture 来源'}
        okText="保存"
        cancelText="取消"
        confirmLoading={saveMutation.isPending}
        destroyOnHidden
        width={680}
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={(values) => saveMutation.mutate(values)}>
          <Form.Item name="fixtureId" label="Fixture" rules={requiredSelectRule}>
            <Select
              showSearch={{ optionFilterProp: 'label' }}
              options={fixtureOptions}
              loading={fixtureOptionsQuery.isLoading}
            />
          </Form.Item>
          <Form.Item name="sourceUrl" label="来源地址" rules={requiredRule}>
            <Input placeholder="https://example.com/rules" />
          </Form.Item>
          <Form.Item name="sourceLabel" label="来源名称">
            <Input />
          </Form.Item>
          <Form.Item name="sourceNote" label="来源说明">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="sortOrder" label="排序" rules={requiredRule}>
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );

  function updateFilter(next: Partial<FixtureSourceFilters>) {
    setPage((previous) => ({ ...previous, current: 1 }));
    setFilters((previous) => ({ ...previous, ...next }));
  }

  function openCreate() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue({
      fixtureId: filters.fixtureId,
      sortOrder: 10,
    });
    setModalOpen(true);
  }

  function openEdit(record: BattleRuleFixtureSourceResponse) {
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
