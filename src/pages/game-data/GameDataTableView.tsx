import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
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
import type { DescriptionsProps } from 'antd';
import type { Rule } from 'antd/es/form';
import { useMemo, useState } from 'react';
import { EntityDrawer } from '../../shared/components/EntityDrawer';
import { BooleanStatusTag } from '../../shared/components/StatusTag';
import { gameDataServices, type GameDataRecord } from '../../services/game-data';
import { GameDataPageShell } from './GameDataPageShell';
import type { GameDataFieldConfig, GameDataResourceConfig } from './game-data-resources';

interface GameDataFilters {
  q: string;
}

type GameDataFormValues = Record<string, unknown>;
type GameDataModalMode = 'create' | 'edit';

const booleanOptions = [
  { label: '是', value: true },
  { label: '否', value: false },
];

/**
 * 游戏资料通用表格视图。
 *
 * 各功能页面独立维护入口，重复的表格 CRUD 行为集中在这个内部视图里。
 */
export function GameDataTableView({ config }: { config: GameDataResourceConfig }) {
  const [filters, setFilters] = useState<GameDataFilters>({ q: '' });
  const [page, setPage] = useState({ current: 1, pageSize: 20 });
  const [detailRecord, setDetailRecord] = useState<GameDataRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<GameDataModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<GameDataRecord | null>(null);
  const [form] = Form.useForm<GameDataFormValues>();
  const queryClient = useQueryClient();

  const query = useMemo(
    () => ({
      q: filters.q || undefined,
      page: page.current - 1,
      size: page.pageSize,
    }),
    [filters, page],
  );

  const recordsQuery = useQuery({
    queryKey: ['game-data', config.key, query],
    queryFn: () => gameDataServices.list(config.key, query),
  });

  const invalidateRecords = async () => {
    await queryClient.invalidateQueries({ queryKey: ['game-data', config.key] });
  };

  const saveMutation = useMutation({
    mutationFn: (values: GameDataFormValues) => {
      const fields = toRecordFields(config, values);
      if (modalMode === 'create') {
        return gameDataServices.create(config.key, fields);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的资料');
      }
      return gameDataServices.update(config.key, editingRecord.id, fields);
    },
    onSuccess: async () => {
      message.success('资料已保存');
      closeModal();
      await invalidateRecords();
    },
    onError: showMutationError,
  });

  const deleteMutation = useMutation({
    mutationFn: (record: GameDataRecord) => gameDataServices.remove(config.key, record.id),
    onSuccess: async () => {
      message.success('资料已删除');
      await invalidateRecords();
    },
    onError: showMutationError,
  });

  const columns: ColumnsType<GameDataRecord> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 90,
      fixed: 'left',
    },
    ...config.fields.map((field) => ({
      title: field.label,
      dataIndex: ['fields', field.name],
      width: field.width ?? 160,
      render: (value: unknown) => renderFieldValue(field, value),
    })),
    {
      title: '操作',
      key: 'actions',
      width: 170,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => setDetailRecord(record)}>
            详情
          </Button>
          <Button type="link" size="small" onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title="删除资料"
            description={`确认删除 ID ${record.id}？`}
            okText="确认"
            cancelText="取消"
            onConfirm={() => deleteMutation.mutate(record)}
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <GameDataPageShell
      title={config.title}
      description={config.description}
      actions={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          aria-label="新建资料"
          onClick={openCreateModal}
        >
          新建资料
        </Button>
      }
      filters={
        <Form.Item label="关键字" className="!mb-0">
          <Input.Search
            allowClear
            placeholder={config.searchPlaceholder}
            onSearch={(value) => {
              setPage((prev) => ({ ...prev, current: 1 }));
              setFilters({ q: value.trim() });
            }}
          />
        </Form.Item>
      }
    >
      <Table<GameDataRecord>
        rowKey="id"
        columns={columns}
        dataSource={recordsQuery.data?.rows ?? []}
        loading={recordsQuery.isLoading || recordsQuery.isFetching}
        scroll={{ x: tableScrollWidth(config) }}
        pagination={{
          current: page.current,
          pageSize: page.pageSize,
          total: Number(recordsQuery.data?.totalRowCount ?? 0),
          showSizeChanger: true,
          onChange: (current, pageSize) => setPage({ current, pageSize }),
        }}
      />
      <EntityDrawer
        open={Boolean(detailRecord)}
        title={`${config.title}详情`}
        onClose={() => setDetailRecord(null)}
        items={detailItems(config, detailRecord)}
      />
      <Modal
        open={modalOpen}
        title={modalMode === 'create' ? `新建${config.title}` : `编辑${config.title}`}
        okText="保存"
        cancelText="取消"
        confirmLoading={saveMutation.isPending}
        destroyOnHidden
        onOk={() => form.submit()}
        onCancel={closeModal}
      >
        <Form<GameDataFormValues>
          form={form}
          layout="vertical"
          onFinish={(values) => saveMutation.mutate(values)}
        >
          {config.fields.map((field) => (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              rules={fieldRules(field)}
            >
              {renderFormControl(field)}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </GameDataPageShell>
  );

  function openCreateModal() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue(createInitialValues(config));
    setModalOpen(true);
  }

  function openEditModal(record: GameDataRecord) {
    setModalMode('edit');
    setEditingRecord(record);
    form.setFieldsValue(record.fields);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  }
}

function renderFieldValue(field: GameDataFieldConfig, value: unknown) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  if (field.type === 'boolean') {
    return <BooleanStatusTag value={Boolean(value)} trueText="是" falseText="否" />;
  }
  if (field.name === 'code') {
    return <Typography.Text code>{String(value)}</Typography.Text>;
  }
  return String(value);
}

function fieldRules(field: GameDataFieldConfig): Rule[] {
  return [
    ...(field.required ? [{ required: true, message: `请输入${field.label}` }] : []),
    ...(field.maxLength
      ? [{ max: field.maxLength, message: `${field.label}不能超过 ${field.maxLength} 个字符` }]
      : []),
  ];
}

function renderFormControl(field: GameDataFieldConfig) {
  if (field.type === 'boolean') {
    return <Select options={booleanOptions} />;
  }
  if (field.type === 'int' || field.type === 'long') {
    return <InputNumber className="!w-full" precision={0} />;
  }
  if (field.name === 'description') {
    return <Input.TextArea rows={3} allowClear maxLength={field.maxLength} />;
  }
  return <Input allowClear maxLength={field.maxLength} />;
}

function createInitialValues(config: GameDataResourceConfig): GameDataFormValues {
  return Object.fromEntries(
    config.fields.map((field) => [
      field.name,
      field.defaultValue ?? (field.type === 'string' ? '' : undefined),
    ]),
  );
}

function toRecordFields(
  config: GameDataResourceConfig,
  values: GameDataFormValues,
): Record<string, unknown> {
  return Object.fromEntries(
    config.fields.flatMap((field) => {
      const value = values[field.name];
      if (value === undefined) {
        return [];
      }
      if (typeof value === 'string') {
        const text = value.trim();
        return [[field.name, text || null]];
      }
      return [[field.name, value]];
    }),
  );
}

function detailItems(
  config: GameDataResourceConfig,
  record: GameDataRecord | null,
): DescriptionsProps['items'] {
  return [
    { key: 'id', label: 'ID', children: record?.id ?? '-' },
    ...config.fields.map((field) => ({
      key: field.name,
      label: field.label,
      children: renderFieldValue(field, record?.fields[field.name]),
    })),
  ];
}

function tableScrollWidth(config: GameDataResourceConfig): number {
  return 260 + config.fields.reduce((sum, field) => sum + (field.width ?? 160), 0);
}

function showMutationError(error: unknown) {
  message.error(error instanceof Error ? error.message : '操作失败');
}
