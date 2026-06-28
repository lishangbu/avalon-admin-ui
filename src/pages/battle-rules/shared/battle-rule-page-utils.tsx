import { Tag } from 'antd';

export interface BattleRuleOption {
  value: number;
  label: string;
  code?: string;
  name?: string;
}

export type BattleRuleModalMode = 'create' | 'edit';

export const defaultPageState = { current: 1, pageSize: 20 };

export const requiredRule = [{ required: true, message: '请填写该字段' }];

export const requiredSelectRule = [{ required: true, message: '请选择该字段' }];

export function renderOptionalText(value?: string | number | null) {
  if (value === undefined || value === null || value === '') {
    return '-';
  }
  return String(value);
}

export function renderEnabledTag(enabled?: boolean) {
  return <Tag color={enabled ? 'green' : 'default'}>{enabled ? '启用' : '停用'}</Tag>;
}

export function renderBooleanTag(value?: boolean) {
  return <Tag color={value ? 'blue' : 'default'}>{value ? '是' : '否'}</Tag>;
}

export function renderPolicyTag(value?: string) {
  if (!value) {
    return '-';
  }
  return <Tag color="geekblue">{value}</Tag>;
}

export function renderOptionLabel(options: BattleRuleOption[], value?: number | null) {
  if (value === undefined || value === null) {
    return '-';
  }
  return options.find((option) => option.value === value)?.label ?? '未找到引用';
}

export function makeOptionLabel(record: { code?: string; name?: string }) {
  if (record.name && record.code) {
    return `${record.name}（${record.code}）`;
  }
  return record.name ?? record.code ?? '未命名';
}

export function makeOptions(
  rows: Array<{ id: number; code?: string; name?: string }> | undefined,
): BattleRuleOption[] {
  return (rows ?? []).map((row) => ({
    value: row.id,
    label: makeOptionLabel(row),
    code: row.code,
    name: row.name,
  }));
}

export function compactRulePayload<T extends object>(values: T): T {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== '' && value !== null),
  ) as T;
}

export function apiErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
