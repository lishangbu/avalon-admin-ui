import { expect, it } from 'vitest';
import {
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
  expect(renderRuleCodeLabel('maximize-user-attack-half-max-hp-cost')).toBe(
    '支付半数最大 HP 并最大化攻击',
  );
  expect(renderRuleCodeLabel('average-user-target-current-hp')).toBe('平均使用者与目标当前 HP');
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
  expect(skillTargetPolicyOptions).toContainEqual({
    value: 'user-side-active',
    label: '己方当前上场成员',
  });
  expect(weatherPolicyOptions).toContainEqual({
    value: 'weather-sun',
    label: '大晴天',
  });
  expect(itemPolicyOptions).toContainEqual({
    value: 'element-damage-reduction-fire',
    label: '降低火属性伤害',
  });
});
