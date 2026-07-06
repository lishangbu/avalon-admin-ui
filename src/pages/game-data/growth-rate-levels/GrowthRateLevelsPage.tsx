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
import {
  getGameDataReferenceService,
  type GameDataListQuery,
  type GameDataRecord,
} from '../../../services/game-data/shared';
import { EntityDrawer } from '../../../shared/components/EntityDrawer';
import { message } from '../../../shared/feedback/message';
import { GameDataFilterItem, fieldRules, renderFormControl } from '../GameDataCrudFieldControls';
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
} from '../GameDataCrudFormatters';
import type {
  GameDataFieldFilters,
  GameDataFilters,
  GameDataFormValues,
  GameDataModalMode,
  GameDataPageTableProps,
} from '../GameDataCrudTypes';
import {
  createInitialValues,
  hasActiveFieldFilters,
  isEmptyFilterValue,
  normalizeFieldFilters,
  toFormValues,
  toRecordFields,
} from '../GameDataRecordTransforms';
import { useReferenceLookupState } from '../GameDataReferenceLookup';
import { growthRateLevelsGameDataService } from '../../../services/game-data/growth-rate-levels';
import type { GameDataResourceConfig } from '../game-data-resources';

export const growthRateLevelsResource: GameDataResourceConfig = {
  key: 'growth-rate-levels',
  path: '/game-data/growth-rate-levels',
  title: '成长等级经验',
  description: '维护成长等级经验。',
  searchPlaceholder: '关键字',
  fields: [
    {
      name: 'growth_rate_id',
      label: '成长速率',
      type: 'long',
      required: true,
      width: 120,
      reference: {
        resource: 'growth-rates',
      },
      filter: true,
    },
    {
      name: 'level',
      label: '等级',
      type: 'int',
      required: true,
      width: 120,
    },
    {
      name: 'experience',
      label: '经验',
      type: 'int',
      required: true,
      width: 120,
    },
  ],
};

export function GrowthRateLevelsPage() {
  /**
   * 当前资料页面直接维护查询、筛选、编辑和删除状态。
   *
   * 这里不再经过 旧的通用页面 hook 这种能驱动所有资料页的大入口，避免某张资料表需要特殊流程时被共享 hook 卡住。
   * 字段控件、引用文本和记录转换仍复用底层函数，因为这些是跨页面一致性规则，不是页面编排逻辑。
   */
  const referenceServiceResolver = getGameDataReferenceService;
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
    queryKey: ['game-data', growthRateLevelsResource.key, query],
    queryFn: () => growthRateLevelsGameDataService.list(query),
  });
  const referenceLookup = useReferenceLookupState(
    growthRateLevelsResource,
    recordsQuery.data?.rows ?? [],
    referenceServiceResolver,
  );

  const saveMutation = useMutation({
    mutationFn: (values: GameDataFormValues) => {
      const fields = toRecordFields(growthRateLevelsResource, values);
      if (modalMode === 'create') {
        return growthRateLevelsGameDataService.create(fields);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的资料');
      }
      return growthRateLevelsGameDataService.update(editingRecord.id, fields);
    },
    onSuccess: async () => {
      message.success('资料已保存');
      closeModal();
      await invalidateRecords();
    },
    onError: showMutationError,
  });

  const deleteMutation = useMutation({
    mutationFn: (record: GameDataRecord) => growthRateLevelsGameDataService.remove(record.id),
    onSuccess: async () => {
      message.success('资料已删除');
      await invalidateRecords();
    },
    onError: showMutationError,
  });

  function invalidateRecords() {
    return queryClient.invalidateQueries({ queryKey: ['game-data', growthRateLevelsResource.key] });
  }

  function openCreateModal() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue(createInitialValues(growthRateLevelsResource));
    setModalOpen(true);
  }

  function openEditModal(record: GameDataRecord) {
    setModalMode('edit');
    setEditingRecord(record);
    form.setFieldsValue(toFormValues(growthRateLevelsResource, record));
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  }

  function updateKeyword(value: string) {
    setKeyword(value);
    if (!value) {
      setPage((prev) => ({ ...prev, current: 1 }));
      setFilters({ q: '' });
    }
  }

  function searchKeyword(value: string) {
    setPage((prev) => ({ ...prev, current: 1 }));
    setFilters({ q: value.trim() });
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <Typography.Title level={3} className="!mb-1">
            {growthRateLevelsResource.title}
          </Typography.Title>
          <Typography.Text type="secondary">{growthRateLevelsResource.description}</Typography.Text>
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
              placeholder={searchPlaceholder(growthRateLevelsResource.searchPlaceholder)}
              onChange={(event) => updateKeyword(event.target.value)}
              onSearch={(value) => searchKeyword(value)}
            />
          </Form.Item>
          {growthRateLevelsResource.fields
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

      <GrowthRateLevelsRecordTable
        rows={recordsQuery.data?.rows ?? []}
        totalRowCount={Number(recordsQuery.data?.totalRowCount ?? 0)}
        page={page}
        loading={recordsQuery.isLoading || recordsQuery.isFetching}
        error={recordsQuery.isError ? recordsQuery.error : null}
        referenceLookup={referenceLookup}
        onPageChange={(current, pageSize) => setPage({ current, pageSize })}
        onDetail={setDetailRecord}
        onEdit={openEditModal}
        onDelete={(record) => deleteMutation.mutate(record)}
      />

      <EntityDrawer
        open={Boolean(detailRecord)}
        title={`${growthRateLevelsResource.title}详情`}
        onClose={() => setDetailRecord(null)}
        items={detailItems(growthRateLevelsResource, detailRecord, referenceLookup)}
      />

      <Modal
        open={modalOpen}
        title={
          modalMode === 'create'
            ? `新建${growthRateLevelsResource.title}`
            : `编辑${growthRateLevelsResource.title}`
        }
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
          {growthRateLevelsResource.fields.map((field) => (
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
    </div>
  );
}

/**
 * 当前资料页面自己的表格实现。
 *
 * 表格列、操作列和横向滚动宽度都绑定在当前页面的资源配置上，不再经过一个共享的资料表格组件分发。
 * 这样某个资料页面后续需要独立列顺序、额外按钮、只读操作或特殊分页行为时，可以只修改本页，不会影响其它资料维护页。
 * 字段渲染、引用文本和错误文案仍复用底层格式化函数，保证“引用 ID 展示为中文文本”等跨页面规则继续保持一致。
 */
function GrowthRateLevelsRecordTable({
  rows,
  totalRowCount,
  page,
  loading,
  error,
  referenceLookup,
  onPageChange,
  onDetail,
  onEdit,
  onDelete,
}: GameDataPageTableProps) {
  const columns: ColumnsType<GameDataRecord> = [
    ...growthRateLevelsResource.fields.map((field, index) => ({
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
      render: (_: unknown, record: GameDataRecord) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => onDetail(record)}>
            详情
          </Button>
          <Button type="link" size="small" onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="删除资料"
            description={`确认删除${formatRecordTitle(growthRateLevelsResource, record, referenceLookup)}？`}
            okText="确认"
            cancelText="取消"
            onConfirm={() => onDelete(record)}
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
    <Card size="small">
      {error ? (
        <Alert
          className="!mb-3"
          type="error"
          showIcon
          title="资料加载失败"
          description={queryErrorMessage(error)}
        />
      ) : null}
      <Table<GameDataRecord>
        rowKey="id"
        columns={columns}
        dataSource={rows}
        loading={loading}
        scroll={{ x: tableScrollWidth(growthRateLevelsResource) }}
        pagination={{
          current: page.current,
          pageSize: page.pageSize,
          total: totalRowCount,
          showSizeChanger: true,
          onChange: onPageChange,
        }}
      />
    </Card>
  );
}
