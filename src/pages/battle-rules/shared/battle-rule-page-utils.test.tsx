import { expect, it } from 'vitest';
import {
  abilityPolicyOptions,
  itemPolicyOptions,
  makeOptions,
  optionValueEquals,
  renderOptionLabel,
  renderRuleCodeLabel,
  skillEffectPolicyOptions,
  skillTargetPolicyOptions,
  weatherPolicyOptions,
} from './battle-rule-page-utils';

it('renders reference labels when ids arrive as either numbers or strings', () => {
  const options = makeOptions([{ id: 2105, code: 'fairy-plate', name: '妖精石板' }]);

  expect(renderOptionLabel(options, 2105)).toBe('妖精石板');
  expect(renderOptionLabel(options, '2105')).toBe('妖精石板');
  expect(optionValueEquals(2105, '2105')).toBe(true);
});

it('keeps reference code as the fallback label when Chinese name is absent', () => {
  const options = makeOptions([{ id: 2105, code: 'fairy-plate' }]);

  expect(renderOptionLabel(options, 2105)).toBe('fairy-plate');
});

it('renders battle rule policy codes with Chinese maintenance labels', () => {
  expect(renderRuleCodeLabel('standard-damage')).toBe('标准伤害');
  expect(renderRuleCodeLabel('set-weather-sun')).toBe('设置大晴天');
  expect(renderRuleCodeLabel('user-side-active')).toBe('己方当前上场成员');
  expect(renderRuleCodeLabel('self-major-status-cure')).toBe('清除自身主要异常');
  expect(renderRuleCodeLabel('maximize-user-attack-half-max-hp-cost')).toBe(
    '支付半数最大 HP 并最大化攻击',
  );
  expect(renderRuleCodeLabel('average-user-target-current-hp')).toBe('平均使用者与目标当前 HP');
  expect(renderRuleCodeLabel('target-heal-quarter-max-hp')).toBe('回复目标最大体力的四分之一');
  expect(renderRuleCodeLabel('target-heal-quarter-max-hp-user-side-active-major-status-cure')).toBe(
    '回复己方上场成员体力并清除主要异常',
  );
  expect(renderRuleCodeLabel('target-last-skill-pp-reduction-four')).toBe(
    '扣减目标最近技能 4 点 PP',
  );
  expect(renderRuleCodeLabel('target-pending-damaging-skill-damage')).toBe('目标待攻击伤害');
  expect(renderRuleCodeLabel('target-pending-priority-damaging-skill-damage')).toBe(
    '目标待先制度攻击伤害',
  );
  expect(renderRuleCodeLabel('break-target-protection-damage')).toBe('破除保护伤害');
  expect(renderRuleCodeLabel('user-side-multi-target-skill-protection')).toBe(
    '一侧范围技能防护',
  );
  expect(renderRuleCodeLabel('user-side-priority-skill-protection')).toBe(
    '一侧先制度技能防护',
  );
  expect(renderRuleCodeLabel('contact-skill-protection-bypass')).toBe('接触招式绕过保护');
  expect(renderRuleCodeLabel('contact-damage-to-attacker-eighth')).toBe('接触后反伤八分之一');
  expect(renderRuleCodeLabel('contact-damage-to-attacker-sixth')).toBe('接触后反伤六分之一');
  expect(renderRuleCodeLabel('contact-transfer-to-attacker')).toBe('接触后转移给攻击方');
  expect(renderRuleCodeLabel('held-end-turn-damage-eighth')).toBe('回合末损失八分之一体力');
  expect(renderRuleCodeLabel('punch-based-skill-power-boost')).toBe('强化拳击类招式威力');
  expect(renderRuleCodeLabel('punch-based-contact-suppression')).toBe('拳击类招式不接触');
  expect(renderRuleCodeLabel('contact-side-effect-immunity')).toBe('免疫接触副作用');
  expect(renderRuleCodeLabel('first-skill-action-only-damage')).toBe('上场首行动限定伤害');
  expect(renderRuleCodeLabel('apply-leech-seed')).toBe('附加寄生种子');
  expect(renderRuleCodeLabel('clear-field-hazards-and-substitutes')).toBe('清除全场陷阱与替身');
  expect(renderRuleCodeLabel('clear-target-side-barriers-and-field-hazards')).toBe(
    '清除目标侧屏障与全场陷阱',
  );
  expect(renderRuleCodeLabel('clear-user-side-hazards-and-traps')).toBe('清除己方陷阱与束缚');
  expect(renderRuleCodeLabel('element-damage-boost-fairy')).toBe('强化妖精属性招式');
  expect(renderRuleCodeLabel('element-damage-reduction-fire')).toBe('降低火属性伤害');
  expect(renderRuleCodeLabel('unknown-runtime-policy')).toBe('unknown-runtime-policy');
});

it('provides Chinese select options for battle rule policies', () => {
  expect(skillEffectPolicyOptions).toContainEqual({
    value: 'protect-self',
    label: '保护自身',
  });
  expect(skillEffectPolicyOptions).toContainEqual({
    value: 'endure-fatal-damage',
    label: '挺住保留 HP',
  });
  expect(skillEffectPolicyOptions).toContainEqual({
    value: 'maximize-user-attack-half-max-hp-cost',
    label: '支付半数最大 HP 并最大化攻击',
  });
  expect(skillEffectPolicyOptions).toContainEqual({
    value: 'average-user-target-current-hp',
    label: '平均使用者与目标当前 HP',
  });
  expect(skillEffectPolicyOptions).toContainEqual({
    value: 'self-major-status-cure',
    label: '清除自身主要异常',
  });
  expect(skillEffectPolicyOptions).toContainEqual({
    value: 'target-heal-quarter-max-hp',
    label: '回复目标最大体力的四分之一',
  });
  expect(skillEffectPolicyOptions).toContainEqual({
    value: 'target-heal-quarter-max-hp-user-side-active-major-status-cure',
    label: '回复己方上场成员体力并清除主要异常',
  });
  expect(skillEffectPolicyOptions).toContainEqual({
    value: 'target-last-skill-pp-reduction-four',
    label: '扣减目标最近技能 4 点 PP',
  });
  expect(skillEffectPolicyOptions).toContainEqual({
    value: 'target-pending-damaging-skill-damage',
    label: '目标待攻击伤害',
  });
  expect(skillEffectPolicyOptions).toContainEqual({
    value: 'target-pending-priority-damaging-skill-damage',
    label: '目标待先制度攻击伤害',
  });
  expect(skillEffectPolicyOptions).toContainEqual({
    value: 'break-target-protection-damage',
    label: '破除保护伤害',
  });
  expect(skillEffectPolicyOptions).toContainEqual({
    value: 'user-side-multi-target-skill-protection',
    label: '一侧范围技能防护',
  });
  expect(skillEffectPolicyOptions).toContainEqual({
    value: 'user-side-priority-skill-protection',
    label: '一侧先制度技能防护',
  });
  expect(skillEffectPolicyOptions).toContainEqual({
    value: 'first-skill-action-only-damage',
    label: '上场首行动限定伤害',
  });
  expect(skillEffectPolicyOptions).toContainEqual({
    value: 'apply-leech-seed',
    label: '附加寄生种子',
  });
  expect(skillEffectPolicyOptions).toContainEqual({
    value: 'clear-field-hazards-and-substitutes',
    label: '清除全场陷阱与替身',
  });
  expect(skillEffectPolicyOptions).toContainEqual({
    value: 'clear-target-side-barriers-and-field-hazards',
    label: '清除目标侧屏障与全场陷阱',
  });
  expect(skillEffectPolicyOptions).toContainEqual({
    value: 'clear-user-side-hazards-and-traps',
    label: '清除己方陷阱与束缚',
  });
  expect(skillTargetPolicyOptions).toContainEqual({
    value: 'user-side-active',
    label: '己方当前上场成员',
  });
  expect(weatherPolicyOptions).toContainEqual({
    value: 'weather-sun',
    label: '大晴天',
  });
  expect(abilityPolicyOptions).toContainEqual({
    value: 'contact-skill-protection-bypass',
    label: '接触招式绕过保护',
  });
  expect(abilityPolicyOptions).toContainEqual({
    value: 'contact-damage-to-attacker-eighth',
    label: '接触后反伤八分之一',
  });
  expect(itemPolicyOptions).toContainEqual({
    value: 'contact-damage-to-attacker-sixth',
    label: '接触后反伤六分之一',
  });
  expect(itemPolicyOptions).toContainEqual({
    value: 'contact-transfer-to-attacker',
    label: '接触后转移给攻击方',
  });
  expect(itemPolicyOptions).toContainEqual({
    value: 'held-end-turn-damage-eighth',
    label: '回合末损失八分之一体力',
  });
  expect(itemPolicyOptions).toContainEqual({
    value: 'punch-based-skill-power-boost',
    label: '强化拳击类招式威力',
  });
  expect(itemPolicyOptions).toContainEqual({
    value: 'punch-based-contact-suppression',
    label: '拳击类招式不接触',
  });
  expect(itemPolicyOptions).toContainEqual({
    value: 'contact-side-effect-immunity',
    label: '免疫接触副作用',
  });
  expect(itemPolicyOptions).toContainEqual({
    value: 'element-damage-reduction-fire',
    label: '降低火属性伤害',
  });
});
