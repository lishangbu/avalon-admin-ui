import { Typography } from 'antd';
import type { DescriptionsProps } from 'antd';
import { BooleanStatusTag } from '../../shared/components/StatusTag';
import { message } from '../../shared/feedback/message';
import type { GameDataRecord } from '../../services/game-data/shared';
import { gameDataDisplayFields } from './game-data-display';
import type { GameDataFieldConfig, GameDataResourceConfig } from './game-data-resources';
import type { ReferenceLookupState } from './GameDataPageTypes';
import {
  formatReferenceLabel,
  ReferenceText,
  referenceCacheKey,
  toLabelText,
  toNumberId,
} from './GameDataReferenceLookup';

export function renderFieldValue(
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

export function filterLabel(field: GameDataFieldConfig): string {
  return fieldLabel(field);
}

export function fieldLabel(field: GameDataFieldConfig): string {
  if (!field.reference) {
    return field.label;
  }
  return field.label.replace(/\s*ID$/, '');
}

export function searchPlaceholder(placeholder: string): string {
  return placeholder
    .replace(/\s*ID/g, '')
    .replace(/^\s*或\s*/, '')
    .replace(/\s*或\s*/g, '或')
    .replace(/\s+/g, ' ')
    .trim();
}

export function fieldColumnWidth(field: GameDataFieldConfig): number {
  const width = field.width ?? 160;
  return field.reference ? Math.max(width, 180) : width;
}

export function detailItems(
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

export function tableScrollWidth(config: GameDataResourceConfig): number {
  return 180 + config.fields.reduce((sum, field) => sum + fieldColumnWidth(field), 0);
}

export function formatRecordTitle(
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

export function showMutationError(error: unknown) {
  message.error(error instanceof Error ? error.message : '操作失败');
}

export function queryErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '请检查登录态、权限或后端服务状态后重试。';
}
