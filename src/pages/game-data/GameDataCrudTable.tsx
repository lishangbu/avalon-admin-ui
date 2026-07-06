import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { EntityDrawer } from '../../shared/components/EntityDrawer';
import {
  getGameDataReferenceService,
  type GameDataListQuery,
  type GameDataRecord,
  type GameDataResourceService,
} from '../../services/game-data/shared';
import type { GameDataResourceConfig } from './game-data-resources';
import { message } from '../../shared/feedback/message';
import { GameDataFilterItem, fieldRules, renderFormControl } from './GameDataCrudFieldControls';
import {
  detailItems,
  fieldColumnWidth,
  fieldLabel,
  formatRecordTitle,
  queryErrorMessage,
  renderFieldValue,
  searchPlaceholder,
  showMutationError,
  tableScrollWidth,
} from './GameDataCrudFormatters';
import {
  type GameDataFieldFilters,
  type GameDataFilters,
  type GameDataFormValues,
  type GameDataModalMode,
  type GameDataReferenceServiceResolver,
} from './GameDataCrudTypes';
import {
  createInitialValues,
  hasActiveFieldFilters,
  isEmptyFilterValue,
  normalizeFieldFilters,
  toFormValues,
  toRecordFields,
} from './GameDataRecordTransforms';
import { useReferenceLookupState } from './GameDataReferenceLookup';

interface GameDataCrudTableProps {
  config: GameDataResourceConfig;
  service: GameDataResourceService;
  referenceServiceResolver?: GameDataReferenceServiceResolver;
}

/**
 * 游戏资料 CRUD 表格组件。
 *
 * 页面显式传入自己的 service；组件只复用表格、表单和引用展示交互，不再按资源 key 分发主表 API。
 */
export function GameDataCrudTable({
  config,
  service,
  referenceServiceResolver = getGameDataReferenceService,
}: GameDataCrudTableProps) {
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState<GameDataFilters>({ q: '' });
  const [fieldFilters, setFieldFilters] = useState<GameDataFieldFilters>({});
  const [page, setPage] = useState({ current: 1, pageSize: 20 });
  const [detailRecord, setDetailRecord] = useState<GameDataRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<GameDataModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<GameDataRecord | null>(null);
  const [form] = Form.useForm<GameDataFormValues>();
  const queryClient = useQueryClient();

  const query = useMemo<GameDataListQuery>(
    () => ({
      q: filters.q || undefined,
      ...normalizeFieldFilters(fieldFilters),
      page: page.current - 1,
      size: page.pageSize,
    }),
    [fieldFilters, filters, page],
  );

  const recordsQuery = useQuery({
    queryKey: ['game-data', config.key, query],
    queryFn: () => service.list(query),
  });
  const referenceLookup = useReferenceLookupState(
    config,
    recordsQuery.data?.rows ?? [],
    referenceServiceResolver,
  );

  const invalidateRecords = async () => {
    await queryClient.invalidateQueries({ queryKey: ['game-data', config.key] });
  };

  const saveMutation = useMutation({
    mutationFn: (values: GameDataFormValues) => {
      const fields = toRecordFields(config, values);
      if (modalMode === 'create') {
        return service.create(fields);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的资料');
      }
      return service.update(editingRecord.id, fields);
    },
    onSuccess: async () => {
      message.success('资料已保存');
      closeModal();
      await invalidateRecords();
    },
    onError: showMutationError,
  });

  const deleteMutation = useMutation({
    mutationFn: (record: GameDataRecord) => service.remove(record.id),
    onSuccess: async () => {
      message.success('资料已删除');
      await invalidateRecords();
    },
    onError: showMutationError,
  });

  const columns: ColumnsType<GameDataRecord> = [
    ...config.fields.map((field, index) => ({
      title: fieldLabel(field),
      dataIndex: field.name,
      width: fieldColumnWidth(field),
      fixed: index === 0 ? ('left' as const) : undefined,
      render: (value: unknown) => renderFieldValue(field, value, referenceLookup),
    })),
    {
      title: '操作',
      key: 'actions',
      width: 170,
      fixed: 'right' as const,
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
            description={`确认删除${formatRecordTitle(config, record, referenceLookup)}？`}
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
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <Typography.Title level={3} className="!mb-1">
            {config.title}
          </Typography.Title>
          <Typography.Text type="secondary">{config.description}</Typography.Text>
        </div>
        <Space wrap>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            aria-label="新建资料"
            onClick={openCreateModal}
          >
            新建资料
          </Button>
        </Space>
      </div>
      <Card size="small">
        <div className="flex flex-wrap items-end gap-3">
          <Form.Item label="关键字" className="!mb-0">
            <Input.Search
              allowClear
              value={keyword}
              placeholder={searchPlaceholder(config.searchPlaceholder)}
              onChange={(event) => {
                const value = event.target.value;
                setKeyword(value);
                if (!value) {
                  setPage((prev) => ({ ...prev, current: 1 }));
                  setFilters({ q: '' });
                }
              }}
              onSearch={(value) => {
                setPage((prev) => ({ ...prev, current: 1 }));
                setFilters({ q: value.trim() });
              }}
            />
          </Form.Item>
          {config.fields
            .filter((field) => field.filter)
            .map((field) => (
              <GameDataFilterItem
                key={field.name}
                field={field}
                value={fieldFilters[field.name]}
                referenceServiceResolver={referenceServiceResolver}
                onChange={(value) => updateFieldFilter(field.name, value)}
              />
            ))}
          {hasActiveFieldFilters(fieldFilters) ? (
            <Button onClick={clearFieldFilters}>清空筛选</Button>
          ) : null}
        </div>
      </Card>
      <Card size="small">
        {recordsQuery.isError ? (
          <Alert
            className="!mb-3"
            type="error"
            showIcon
            title="资料加载失败"
            description={queryErrorMessage(recordsQuery.error)}
          />
        ) : null}
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
          items={detailItems(config, detailRecord, referenceLookup)}
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
                label={fieldLabel(field)}
                rules={fieldRules(field)}
              >
                {renderFormControl(field, referenceServiceResolver)}
              </Form.Item>
            ))}
          </Form>
        </Modal>
      </Card>
    </div>
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
    form.setFieldsValue(toFormValues(config, record));
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  }

  function updateFieldFilter(fieldName: string, value: string | number | boolean | undefined) {
    setPage((prev) => ({ ...prev, current: 1 }));
    setFieldFilters((prev) => {
      const next = { ...prev };
      if (isEmptyFilterValue(value)) {
        delete next[fieldName];
      } else {
        next[fieldName] = value;
      }
      return next;
    });
  }

  function clearFieldFilters() {
    setPage((prev) => ({ ...prev, current: 1 }));
    setFieldFilters({});
  }
}
