import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
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
import type { DescriptionsProps } from 'antd';
import type { Rule } from 'antd/es/form';
import { useMemo, useState } from 'react';
import { EntityDrawer } from '../../shared/components/EntityDrawer';
import { BooleanStatusTag } from '../../shared/components/StatusTag';
import {
  getGameDataReferenceService,
  type GameDataListQuery,
  type GameDataRecord,
  type GameDataResourceKey,
  type GameDataResourceService,
} from '../../services/game-data/shared';
import { gameDataDisplayFields } from './game-data-display';
import type { GameDataFieldConfig, GameDataResourceConfig } from './game-data-resources';

interface GameDataFilters {
  q: string;
}

type GameDataFormValues = Record<string, unknown>;
type GameDataFieldFilters = Record<string, string | number | boolean | undefined>;
type GameDataModalMode = 'create' | 'edit';
type ReferenceLookupState = {
  records: Map<string, GameDataRecord>;
  loadingKeys: Set<string>;
  errorKeys: Set<string>;
};
type ReferenceTarget = {
  key: string;
  resource: GameDataResourceKey;
  id: number;
};
type GameDataReferenceServiceResolver = (resource: GameDataResourceKey) => GameDataResourceService;

interface GameDataTableViewProps {
  config: GameDataResourceConfig;
  service: GameDataResourceService;
  referenceServiceResolver?: GameDataReferenceServiceResolver;
}

const booleanOptions = [
  { label: '是', value: true },
  { label: '否', value: false },
];

/**
 * 游戏资料 CRUD 表格组件。
 *
 * 页面显式传入自己的 service；组件只复用表格、表单和引用展示交互，不再按资源 key 分发主表 API。
 */
export function GameDataTableView({
  config,
  service,
  referenceServiceResolver = getGameDataReferenceService,
}: GameDataTableViewProps) {
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

function useReferenceLookupState(
  config: GameDataResourceConfig,
  rows: GameDataRecord[],
  referenceServiceResolver: GameDataReferenceServiceResolver,
): ReferenceLookupState {
  const targets = useMemo(() => collectReferenceTargets(config, rows), [config, rows]);
  const queries = useQueries({
    queries: targets.map((target) => ({
      queryKey: referenceQueryKey(target.resource, target.id),
      queryFn: () => referenceServiceResolver(target.resource).get(target.id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  return useMemo(() => {
    const records = new Map<string, GameDataRecord>();
    const loadingKeys = new Set<string>();
    const errorKeys = new Set<string>();
    targets.forEach((target, index) => {
      const query = queries[index];
      if (query?.data) {
        records.set(target.key, query.data);
      }
      if (query?.isLoading || query?.isFetching) {
        loadingKeys.add(target.key);
      }
      if (query?.isError) {
        errorKeys.add(target.key);
      }
    });
    return { records, loadingKeys, errorKeys };
  }, [queries, targets]);
}

function collectReferenceTargets(
  config: GameDataResourceConfig,
  rows: GameDataRecord[],
): ReferenceTarget[] {
  const targets = new Map<string, ReferenceTarget>();
  const referenceFields = config.fields.filter((field) => field.reference);
  rows.forEach((row) => {
    referenceFields.forEach((field) => {
      const resource = field.reference?.resource;
      const id = toNumberId(row[field.name]);
      if (!resource || id === undefined) {
        return;
      }
      const key = referenceCacheKey(resource, id);
      targets.set(key, { key, resource, id });
    });
  });
  return [...targets.values()];
}

function renderFieldValue(
  field: GameDataFieldConfig,
  value: unknown,
  referenceLookup: ReferenceLookupState,
) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  if (field.reference) {
    return <ReferenceText field={field} value={value} referenceLookup={referenceLookup} />;
  }
  if (field.type === 'boolean') {
    return <BooleanStatusTag value={Boolean(value)} trueText="是" falseText="否" />;
  }
  if (field.name === 'code') {
    return <Typography.Text code>{String(value)}</Typography.Text>;
  }
  return String(value);
}

function GameDataFilterItem({
  field,
  value,
  referenceServiceResolver,
  onChange,
}: {
  field: GameDataFieldConfig;
  value: string | number | boolean | undefined;
  referenceServiceResolver: GameDataReferenceServiceResolver;
  onChange: (value: string | number | boolean | undefined) => void;
}) {
  return (
    <Form.Item label={filterLabel(field)} className="!mb-0" style={{ minWidth: 180 }}>
      {renderFilterControl(field, value, referenceServiceResolver, onChange)}
    </Form.Item>
  );
}

function renderFilterControl(
  field: GameDataFieldConfig,
  value: string | number | boolean | undefined,
  referenceServiceResolver: GameDataReferenceServiceResolver,
  onChange: (value: string | number | boolean | undefined) => void,
) {
  if (field.reference) {
    return (
      <ReferenceSelect
        field={field}
        value={value}
        placeholder={`筛选${filterLabel(field)}`}
        referenceServiceResolver={referenceServiceResolver}
        onChange={onChange}
      />
    );
  }
  if (field.type === 'boolean') {
    return (
      <Select
        allowClear
        value={value}
        options={booleanOptions}
        placeholder={`筛选${field.label}`}
        onChange={(nextValue) => onChange(nextValue)}
      />
    );
  }
  if (field.type === 'int' || field.type === 'long') {
    return (
      <InputNumber
        className="!w-full"
        precision={0}
        value={typeof value === 'number' ? value : undefined}
        placeholder={`筛选${field.label}`}
        onChange={(nextValue) => onChange(nextValue ?? undefined)}
      />
    );
  }
  return (
    <Input
      allowClear
      value={typeof value === 'string' ? value : ''}
      placeholder={`筛选${field.label}`}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function fieldRules(field: GameDataFieldConfig): Rule[] {
  const label = fieldLabel(field);
  return [
    ...(field.required ? [{ required: true, message: `请输入${label}` }] : []),
    ...(field.maxLength
      ? [{ max: field.maxLength, message: `${label}不能超过 ${field.maxLength} 个字符` }]
      : []),
  ];
}

function renderFormControl(
  field: GameDataFieldConfig,
  referenceServiceResolver: GameDataReferenceServiceResolver,
) {
  if (field.reference) {
    return <ReferenceSelect field={field} referenceServiceResolver={referenceServiceResolver} />;
  }
  if (field.type === 'boolean') {
    return <Select options={booleanOptions} />;
  }
  if (field.type === 'int' || field.type === 'long') {
    return <InputNumber className="!w-full" precision={0} />;
  }
  if (isLongTextField(field.name)) {
    return <Input.TextArea rows={3} allowClear maxLength={field.maxLength} />;
  }
  return <Input allowClear maxLength={field.maxLength} />;
}

function ReferenceSelect({
  field,
  value,
  placeholder,
  referenceServiceResolver,
  onChange,
}: {
  field: GameDataFieldConfig;
  value?: string | number | boolean | null;
  placeholder?: string;
  referenceServiceResolver: GameDataReferenceServiceResolver;
  onChange?: (value: number | undefined) => void;
}) {
  const [active, setActive] = useState(false);
  const [search, setSearch] = useState('');
  const reference = field.reference;
  const resource = reference?.resource;
  const selectedId = toNumberId(value);
  const optionsQuery = useQuery({
    queryKey: ['game-data-reference-options', resource, search],
    queryFn: () =>
      referenceServiceResolver(resource!).list({
        q: search || undefined,
        page: 0,
        size: 20,
      }),
    enabled: Boolean(resource) && (active || Boolean(search)),
  });
  const selectedQuery = useQuery({
    queryKey: ['game-data-reference-record', resource, selectedId],
    queryFn: () => referenceServiceResolver(resource!).get(selectedId!),
    enabled: Boolean(resource) && selectedId !== undefined,
  });
  const optionRecords = mergeReferenceRecords(optionsQuery.data?.rows ?? [], selectedQuery.data);

  return (
    <Select
      allowClear
      showSearch={{
        filterOption: false,
        optionFilterProp: 'label',
        onSearch: setSearch,
      }}
      value={selectedId}
      placeholder={placeholder ?? `请选择${filterLabel(field)}`}
      loading={optionsQuery.isFetching || selectedQuery.isFetching}
      options={optionRecords.map((record) => ({
        value: record.id,
        label: formatReferenceLabel(record, reference),
      }))}
      notFoundContent={optionsQuery.isFetching ? '加载中' : '无匹配资料'}
      onFocus={() => setActive(true)}
      onChange={(nextValue) => onChange?.(nextValue)}
    />
  );
}

function ReferenceText({
  field,
  value,
  referenceLookup,
}: {
  field: GameDataFieldConfig;
  value: unknown;
  referenceLookup: ReferenceLookupState;
}) {
  const reference = field.reference;
  const resource = reference?.resource;
  const id = toNumberId(value);

  if (!resource || id === undefined) {
    return '-';
  }
  const cacheKey = referenceCacheKey(resource, id);
  const record = referenceLookup.records.get(cacheKey);
  if (record) {
    return <Typography.Text>{formatReferenceLabel(record, reference)}</Typography.Text>;
  }
  if (referenceLookup.loadingKeys.has(cacheKey)) {
    return <Typography.Text type="secondary">加载中</Typography.Text>;
  }
  if (referenceLookup.errorKeys.has(cacheKey)) {
    return <Typography.Text type="secondary">引用资料加载失败</Typography.Text>;
  }
  return <Typography.Text type="secondary">引用资料加载中</Typography.Text>;
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
        return [[field.name, null]];
      }
      if (typeof value === 'string') {
        const text = value.trim();
        return [[field.name, text || null]];
      }
      return [[field.name, value]];
    }),
  );
}

function toFormValues(config: GameDataResourceConfig, record: GameDataRecord): GameDataFormValues {
  return Object.fromEntries(config.fields.map((field) => [field.name, record[field.name]]));
}

function normalizeFieldFilters(filters: GameDataFieldFilters): GameDataFieldFilters {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => !isEmptyFilterValue(value)),
  ) as GameDataFieldFilters;
}

function hasActiveFieldFilters(filters: GameDataFieldFilters): boolean {
  return Object.values(filters).some((value) => !isEmptyFilterValue(value));
}

function isEmptyFilterValue(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}

function filterLabel(field: GameDataFieldConfig): string {
  return fieldLabel(field);
}

function fieldLabel(field: GameDataFieldConfig): string {
  if (!field.reference) {
    return field.label;
  }
  return field.label.replace(/\s*ID$/, '');
}

function searchPlaceholder(placeholder: string): string {
  return placeholder
    .replace(/\s*ID/g, '')
    .replace(/^\s*或\s*/, '')
    .replace(/\s*或\s*/g, '或')
    .replace(/\s+/g, ' ')
    .trim();
}

function fieldColumnWidth(field: GameDataFieldConfig): number {
  const width = field.width ?? 160;
  return field.reference ? Math.max(width, 180) : width;
}

function isLongTextField(fieldName: string): boolean {
  return ['description', 'effect', 'short_effect', 'flavor_text'].includes(fieldName);
}

function toNumberId(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  const id = Number(value);
  return Number.isFinite(id) ? id : undefined;
}

function mergeReferenceRecords(
  records: GameDataRecord[],
  selectedRecord: GameDataRecord | undefined,
): GameDataRecord[] {
  if (!selectedRecord || records.some((record) => record.id === selectedRecord.id)) {
    return records;
  }
  return [selectedRecord, ...records];
}

function referenceQueryKey(resource: GameDataResourceKey, id: number) {
  return ['game-data-reference-record', resource, id] as const;
}

function referenceCacheKey(resource: GameDataResourceKey, id: number): string {
  return `${resource}:${id}`;
}

function formatReferenceLabel(
  record: GameDataRecord,
  reference: GameDataFieldConfig['reference'],
): string {
  const explicitDisplayText = formatDisplayFields(record, reference?.displayFields);
  if (explicitDisplayText) {
    return explicitDisplayText;
  }
  const label = record[reference?.labelField ?? 'name'];
  const code = record[reference?.codeField ?? 'code'];
  const labelText = toLabelText(label);
  const codeText = toLabelText(code);
  if (labelText && codeText) {
    return `${labelText} (${codeText})`;
  }
  const configuredDisplayText = formatDisplayFields(
    record,
    reference?.resource ? gameDataDisplayFields[reference.resource] : undefined,
  );
  return labelText ?? codeText ?? configuredDisplayText ?? '未命名资料';
}

function formatDisplayFields(
  record: GameDataRecord,
  fields: string[] | undefined,
): string | undefined {
  const values = fields
    ?.map((field) => toLabelText(record[field]))
    .filter((value): value is string => Boolean(value));
  if (!values?.length) {
    return undefined;
  }
  return values.join(' / ');
}

function toLabelText(value: unknown): string | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  return String(value);
}

function detailItems(
  config: GameDataResourceConfig,
  record: GameDataRecord | null,
  referenceLookup: ReferenceLookupState,
): DescriptionsProps['items'] {
  return [
    ...config.fields.map((field) => ({
      key: field.name,
      label: fieldLabel(field),
      children: renderFieldValue(field, record?.[field.name], referenceLookup),
    })),
  ];
}

function tableScrollWidth(config: GameDataResourceConfig): number {
  return 180 + config.fields.reduce((sum, field) => sum + fieldColumnWidth(field), 0);
}

function formatRecordTitle(
  config: GameDataResourceConfig,
  record: GameDataRecord,
  referenceLookup: ReferenceLookupState,
): string {
  const title =
    toLabelText(record.name) ??
    toLabelText(record.code) ??
    formatDisplayFieldsForRecordTitle(
      config,
      record,
      config.displayFields ?? gameDataDisplayFields[config.key],
      referenceLookup,
    );
  return title ? `「${title}」` : '这条资料';
}

/**
 * 为删除确认文案格式化没有 name/code 的资料标题。
 *
 * 关系表通常只配置 `creature_id / stat_id / base_value` 这类 displayFields。表格列已经能把引用 ID 渲染成名称；
 * 删除弹窗如果继续直接拼原始字段，就会退回“1 / 2 / 45”这种用户难以确认的文案。这里复用当前页已经加载好的
 * 引用缓存：缓存命中时显示引用文本，缓存还没回来时才保留原始值，保证确认文案不会阻塞删除流程。
 */
function formatDisplayFieldsForRecordTitle(
  config: GameDataResourceConfig,
  record: GameDataRecord,
  fields: string[] | undefined,
  referenceLookup: ReferenceLookupState,
): string | undefined {
  const values = fields
    ?.map((fieldName) => {
      const field = config.fields.find((candidate) => candidate.name === fieldName);
      const value = record[fieldName];
      if (!field?.reference) {
        return toLabelText(value);
      }
      return formatReferenceValueForTitle(field, value, referenceLookup) ?? toLabelText(value);
    })
    .filter((value): value is string => Boolean(value));
  if (!values?.length) {
    return undefined;
  }
  return values.join(' / ');
}

function formatReferenceValueForTitle(
  field: GameDataFieldConfig,
  value: unknown,
  referenceLookup: ReferenceLookupState,
): string | undefined {
  const resource = field.reference?.resource;
  const id = toNumberId(value);
  if (!resource || id === undefined) {
    return undefined;
  }
  const record = referenceLookup.records.get(referenceCacheKey(resource, id));
  return record ? formatReferenceLabel(record, field.reference) : undefined;
}

function showMutationError(error: unknown) {
  message.error(error instanceof Error ? error.message : '操作失败');
}

function queryErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '请检查登录态、权限或后端服务状态后重试。';
}
