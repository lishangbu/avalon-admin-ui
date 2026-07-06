import { useQueries, useQuery } from '@tanstack/react-query';
import { Select, Typography } from 'antd';
import { useMemo, useState } from 'react';
import type { GameDataRecord, GameDataResourceKey } from '../../services/game-data/shared';
import { gameDataDisplayFields } from './game-data-display';
import type { GameDataFieldConfig, GameDataResourceConfig } from './game-data-resources';
import type {
  GameDataReferenceServiceResolver,
  ReferenceLookupState,
  ReferenceTarget,
} from './GameDataCrudTypes';

export function useReferenceLookupState(
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

export function ReferenceSelect({
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
      placeholder={placeholder ?? `请选择${field.label.replace(/\s*ID$/, '')}`}
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

export function ReferenceText({
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

export function referenceCacheKey(resource: GameDataResourceKey, id: number): string {
  return `${resource}:${id}`;
}

export function formatReferenceLabel(
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
  /**
   * 资料表里的 code 主要用于稳定标识和接口传参，很多基础数据会直接沿用英文编码。
   * 管理页面面向人工维护时应优先显示中文名称；只有后端确实没有中文名称时，才退回 code，
   * 避免引用列和下拉选项在“妙蛙种子 (bulbasaur)”这类场景里混入不需要展示的英文文本。
   */
  if (labelText) {
    return labelText;
  }
  const configuredDisplayText = formatDisplayFields(
    record,
    reference?.resource ? gameDataDisplayFields[reference.resource] : undefined,
  );
  return codeText ?? configuredDisplayText ?? '未命名资料';
}

export function formatDisplayFields(
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

export function toLabelText(value: unknown): string | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  return String(value);
}

export function toNumberId(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  const id = Number(value);
  return Number.isFinite(id) ? id : undefined;
}
