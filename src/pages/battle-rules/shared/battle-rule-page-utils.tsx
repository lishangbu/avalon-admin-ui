import { Tag } from 'antd';
import { renderRuleCodeLabel } from './battle-rule-policy-labels';

export {
  abilityPolicyOptions,
  fieldPolicyOptions,
  itemPolicyOptions,
  renderRuleCodeLabel,
  skillDamagePolicyOptions,
  skillEffectPolicyOptions,
  skillHitPolicyOptions,
  skillTargetPolicyOptions,
  statusPolicyOptions,
  terrainPolicyOptions,
  weatherPolicyOptions,
  type BattleRuleCodeOption,
} from './battle-rule-policy-labels';

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

export function renderPolicyTag(value?: string | null) {
  if (!value) {
    return '-';
  }
  return (
    <Tag color="geekblue" title={value}>
      {renderRuleCodeLabel(value)}
    </Tag>
  );
}

export function renderOptionLabel(options: BattleRuleOption[], value?: number | string | null) {
  if (value === undefined || value === null) {
    return '-';
  }
  return (
    options.find((option) => optionValueEquals(option.value, value))?.label ?? '引用资料加载中'
  );
}

export function makeOptionLabel(record: { code?: string; name?: string }) {
  /**
   * 战斗规则页的引用选项大多来自游戏资料表；其中 code 是稳定接口编码，不是维护人员优先识别的文本。
   * 页面展示保持“中文名称优先，缺少名称时才显示 code”，这样技能、道具、属性等下拉项不会继续混入英文编码，
   * 同时仍然保留后端数据不完整时可以定位记录的兜底文本。
   */
  if (record.name) {
    return record.name;
  }
  return record.code ?? '未命名';
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

export function optionValueEquals(left: number | string, right: number | string) {
  return String(left) === String(right);
}
