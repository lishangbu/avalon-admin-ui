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

const actionViolationSkillResourceCodes = new Set([
  'skill-not-found',
  'skill-no-pp',
  'choice-locked',
  'heal-blocked',
  'taunted',
  'disabled-skill',
  'tormented-repeat',
  'locked-move-prevents-switch',
  'charging-prevents-switch',
]);

export function renderActionViolationResourceLabel(
  code: string,
  resourceId: number | string | null | undefined,
  skillOptions: BattleRuleOption[],
) {
  // 行动校验接口为了保持战斗引擎纯净，只返回稳定 code 和通用 resourceId。当前后端只有技能相关行动违规会把
  // resourceId 指向技能资料，例如 PP 耗尽、讲究锁定、挑衅阻止变化技能、定身法和锁招/蓄力阻止替换。
  // 前端只对这些明确 code 做技能名称渲染；未知 code 保留原始 resourceId，避免把未来的道具、特性或其它资源
  // 误显示成技能名称。
  if (actionViolationSkillResourceCodes.has(code)) {
    return renderOptionLabel(skillOptions, resourceId);
  }
  return renderOptionalText(resourceId);
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
