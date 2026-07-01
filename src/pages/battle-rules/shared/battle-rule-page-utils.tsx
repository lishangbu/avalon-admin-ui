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

const elementCodeLabels: Record<string, string> = {
  bug: '虫',
  dark: '恶',
  dragon: '龙',
  electric: '电',
  fairy: '妖精',
  fighting: '格斗',
  fire: '火',
  flying: '飞行',
  ghost: '幽灵',
  grass: '草',
  ground: '地面',
  ice: '冰',
  normal: '一般',
  poison: '毒',
  psychic: '超能力',
  rock: '岩石',
  steel: '钢',
  water: '水',
};

/**
 * 战斗规则里的 policy/code 是后端运行时使用的稳定业务键，表单提交和接口参数必须继续保留原值。
 * 这里的字典只服务管理端展示：表格、标签、引用下拉统一显示简体中文，同时保留 title 让维护者
 * 需要排查运行时适配器时还能看到原始编码。新增规则时如果后端引入了新的业务键，只补这一处即可。
 */
const ruleCodeLabels: Record<string, string> = {
  'all-adjacent-participants': '全部相邻成员',
  'all-opponents': '全部相邻对手',
  'always-hit': '必中',
  'apply-disable': '附加定身法',
  'apply-heal-block': '附加回复封锁',
  'apply-taunt': '附加挑衅',
  'apply-torment': '附加招式限制',
  'attack-stat-double': '攻击翻倍',
  binding: '束缚',
  'charge-skip-once': '跳过一次蓄力',
  'choice-speed-lock': '提升速度并锁定招式',
  'clear-all-active-stat-stages': '清除双方能力阶级',
  'consumable-full-hp-fatal-damage-survival': '满体力承受致命伤害并消耗',
  'contact-based-skill-damage-boost': '强化接触类招式',
  'contact-paralysis': '接触后麻痹攻击方',
  'copy-target-stat-stages': '复制目标能力阶级',
  'create-substitute-quarter-max-hp': '消耗四分之一最大体力建立替身',
  'critical-hit-immunity': '免疫击中要害',
  'damage-class-power-boost-physical': '强化物理招式',
  'damage-class-power-boost-special': '强化特殊招式',
  'damage-dealt-heal-eighth': '按造成伤害回复体力',
  'defense-stat-double': '防御翻倍',
  disable: '定身法',
  'drain-half-damage': '回复造成伤害的一半',
  'drain-three-quarter-damage': '回复造成伤害的四分之三',
  'element-dragon-damage-boost': '强化龙属性招式',
  'element-electric-absorb-heal': '吸收电属性招式并回复',
  'element-electric-absorb-speed-up': '吸收电属性招式并提升速度',
  'element-electric-damage-boost': '强化电属性招式',
  'element-fire-absorb-defense-up-two': '吸收火属性招式并大幅提升防御',
  'element-grass-absorb-attack-up': '吸收草属性招式并提升攻击',
  'element-ground-absorb-heal': '吸收地面属性招式并回复',
  'element-rock-damage-boost': '强化岩石属性招式',
  'element-steel-damage-boost': '强化钢属性招式',
  'element-water-absorb-heal': '吸收水属性招式并回复',
  'field-condition': '全场效果',
  'field-trick-room': '戏法空间',
  'fixed-damage': '固定伤害',
  'fixed-damage-20': '固定 20 点伤害',
  'fixed-damage-40': '固定 40 点伤害',
  'force-target-switch': '强制目标替换',
  'full-hp-damage-reduction': '满体力降低伤害',
  'full-hp-fatal-damage-survival': '满体力承受致命伤害保留 1 点体力',
  'grassy-terrain-defense-stat-boost': '青草场地提升防御',
  'ground-immunity': '不接地',
  'hazard-spikes': '撒菱',
  'hazard-stealth-rock': '隐形岩',
  'hazard-sticky-web': '黏黏网',
  'hazard-toxic-spikes': '毒菱',
  'heal-block': '回复封锁',
  'hp-derived-damage': '按体力差计算伤害',
  'ignore-opponent-accuracy-stat-stages': '无视对手命中与闪避阶级',
  'ignore-opponent-damage-stat-stages': '无视对手伤害能力阶级',
  'ignore-target-ability-effects': '无视目标防守特性',
  'indirect-damage-immunity': '免疫间接伤害',
  'invert-target-stat-stages': '反转目标能力阶级',
  'leftovers-heal': '回合末回复体力',
  'life-orb-boost-and-recoil': '增伤并反作用受伤',
  'low-hp-bug-boost': '低体力强化虫属性招式',
  'low-hp-fire-boost': '低体力强化火属性招式',
  'low-hp-grass-boost': '低体力强化草属性招式',
  'low-hp-water-boost': '低体力强化水属性招式',
  'major-burn': '灼伤',
  'major-freeze': '冰冻',
  'major-paralysis': '麻痹',
  'major-poison': '中毒',
  'major-sleep': '睡眠',
  'major-status-attack-stat-boost-ignore-burn-drop': '异常时提升攻击并忽略灼伤下降',
  'major-status-cure-all': '解除全部主要异常',
  'major-status-cure-burn': '解除灼伤',
  'major-status-cure-freeze': '解除冰冻',
  'major-status-cure-paralysis': '解除麻痹',
  'major-status-cure-poison': '解除中毒',
  'major-status-cure-sleep': '解除睡眠',
  'major-toxic': '剧毒',
  'medium-berry-heal': '低体力比例回复',
  'multi-hit': '多段命中',
  'multi-hit-damage': '多段伤害',
  'no-damage': '无伤害',
  'proportional-damage': '比例伤害',
  'protect-hit': '受保护判定',
  'protect-self': '保护自身',
  'punch-based-skill-damage-boost': '强化拳击类招式',
  'recoil-third-damage': '承受三分之一反作用伤害',
  'same-element-bonus-double': '本系加成翻倍',
  'selected-target': '指定目标',
  self: '自身',
  'self-heal-half-max-hp': '回复最大体力的一半',
  'set-terrain-electric': '设置电气场地',
  'set-terrain-grassy': '设置青草场地',
  'set-terrain-misty': '设置薄雾场地',
  'set-terrain-psychic': '设置精神场地',
  'set-weather-rain': '设置下雨',
  'set-weather-sandstorm': '设置沙暴',
  'set-weather-snow': '设置下雪',
  'set-weather-sun': '设置大晴天',
  'side-aurora-veil': '极光幕',
  'side-condition': '一侧场地效果',
  'side-condition-duration-screen': '延长屏障持续时间',
  'side-entry-hazard': '入场陷阱',
  'side-light-screen': '光墙',
  'side-priority-move-immunity': '阻止对手先制招式',
  'side-reflect': '反射壁',
  'side-tailwind': '顺风',
  'skill-recoil-damage-immunity': '免疫招式反作用伤害',
  'slicing-based-skill-damage-boost': '强化切割类招式',
  'small-berry-heal': '低体力固定回复',
  'sound-based-skill-damage-boost': '强化声音类招式',
  'sound-based-skill-damage-reduction': '降低声音类伤害',
  'sound-based-skill-immunity': '免疫声音类招式',
  'special-damage-reduction': '降低特殊伤害',
  'standard-damage': '标准伤害',
  'standard-damage-clear-target-stat-stages': '标准伤害并清除目标能力阶级',
  'standard-damage-with-force-switch': '标准伤害并强制替换',
  'standard-damage-with-stat': '标准伤害并改变能力',
  'standard-damage-with-status': '标准伤害并附加状态',
  'standard-hit': '标准命中',
  'stat-stage-change': '能力阶级变化',
  'status-application': '附加状态',
  'status-effect': '状态效果',
  'status-skill-priority-boost': '提升变化招式优先度',
  'super-effective-damage-boost': '强化效果绝佳伤害',
  'super-effective-damage-reduction': '降低效果绝佳伤害',
  'swap-all-stat-stages': '交换全部能力阶级',
  'swap-attack-stat-stages': '交换攻击类能力阶级',
  'swap-defense-stat-stages': '交换防御类能力阶级',
  'switch-in-opponents-attack-down': '出场降低对手攻击',
  'switch-in-terrain-electric': '出场设置电气场地',
  'switch-in-terrain-grassy': '出场设置青草场地',
  'switch-in-terrain-misty': '出场设置薄雾场地',
  'switch-in-terrain-psychic': '出场设置精神场地',
  'switch-in-weather-rain': '出场设置下雨',
  'switch-in-weather-sandstorm': '出场设置沙暴',
  'switch-in-weather-snow': '出场设置下雪',
  'switch-in-weather-sun': '出场设置大晴天',
  taunt: '挑衅',
  'target-current-hp-half-damage': '造成目标当前体力一半伤害',
  'target-hp-minus-user-hp-damage': '造成目标体力减使用者体力的伤害',
  'terrain-duration-all': '延长场地持续时间',
  'terrain-electric': '电气场地',
  'terrain-grassy': '青草场地',
  'terrain-misty': '薄雾场地',
  'terrain-psychic': '精神场地',
  'terrain-speed-electric': '电气场地速度翻倍',
  torment: '招式限制',
  'user-current-hp-sacrifice-damage': '造成使用者当前体力等量伤害并倒下',
  'user-level-fixed-damage': '造成使用者等级等量固定伤害',
  'volatile-binding': '束缚',
  'volatile-confusion': '混乱',
  'volatile-disable': '定身法',
  'volatile-flinch': '畏缩',
  'volatile-heal-block': '回复封锁',
  'volatile-status-cure-confusion': '解除混乱',
  'volatile-taunt': '挑衅',
  'volatile-torment': '招式限制',
  'weather-clear': '无天气',
  'weather-damage-immunity-sandstorm': '免疫沙暴伤害',
  'weather-duration-rain': '延长下雨持续时间',
  'weather-duration-sandstorm': '延长沙暴持续时间',
  'weather-duration-snow': '延长下雪持续时间',
  'weather-duration-sun': '延长大晴天持续时间',
  'weather-heal-rain': '下雨时回合末回复',
  'weather-heal-snow': '下雪时回合末回复',
  'weather-rain': '下雨',
  'weather-sandstorm': '沙暴',
  'weather-sandstorm-rock-ground-steel-damage-boost': '沙暴中强化岩石、地面与钢属性招式',
  'weather-self-heal-max-hp': '按天气回复最大体力',
  'weather-snow': '下雪',
  'weather-speed-rain': '下雨时速度翻倍',
  'weather-speed-sandstorm': '沙暴时速度翻倍',
  'weather-speed-snow': '下雪时速度翻倍',
  'weather-speed-sun': '大晴天时速度翻倍',
  'weather-sun': '大晴天',
};

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

export function renderRuleCodeLabel(value?: string | null) {
  if (!value) {
    return '-';
  }

  const elementBoost = value.match(/^element-damage-boost-(.+)$/);
  if (elementBoost) {
    const elementLabel = elementCodeLabels[elementBoost[1]];
    return elementLabel ? `强化${elementLabel}属性招式` : value;
  }

  const elementReduction = value.match(/^element-damage-reduction-(.+)$/);
  if (elementReduction) {
    const elementLabel = elementCodeLabels[elementReduction[1]];
    return elementLabel ? `降低${elementLabel}属性伤害` : value;
  }

  return ruleCodeLabels[value] ?? value;
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

export function optionValueEquals(left: number | string, right: number | string) {
  return String(left) === String(right);
}
