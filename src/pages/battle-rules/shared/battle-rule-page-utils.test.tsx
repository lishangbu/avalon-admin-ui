import { expect, it } from 'vitest';
import {
  makeOptions,
  optionValueEquals,
  renderOptionLabel,
  renderRuleCodeLabel,
} from './battle-rule-page-utils';

it('renders reference labels when ids arrive as either numbers or strings', () => {
  const options = makeOptions([{ id: 2105, code: 'fairy-plate', name: '妖精石板' }]);

  expect(renderOptionLabel(options, 2105)).toBe('妖精石板（fairy-plate）');
  expect(renderOptionLabel(options, '2105')).toBe('妖精石板（fairy-plate）');
  expect(optionValueEquals(2105, '2105')).toBe(true);
});

it('renders battle rule policy codes with Chinese maintenance labels', () => {
  expect(renderRuleCodeLabel('standard-damage')).toBe('标准伤害');
  expect(renderRuleCodeLabel('set-weather-sun')).toBe('设置大晴天');
  expect(renderRuleCodeLabel('element-damage-boost-fairy')).toBe('强化妖精属性招式');
  expect(renderRuleCodeLabel('element-damage-reduction-fire')).toBe('降低火属性伤害');
  expect(renderRuleCodeLabel('unknown-runtime-policy')).toBe('unknown-runtime-policy');
});
