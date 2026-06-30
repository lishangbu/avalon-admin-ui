import { expect, it } from 'vitest';
import { makeOptions, optionValueEquals, renderOptionLabel } from './battle-rule-page-utils';

it('renders reference labels when ids arrive as either numbers or strings', () => {
  const options = makeOptions([{ id: 2105, code: 'fairy-plate', name: '妖精石板' }]);

  expect(renderOptionLabel(options, 2105)).toBe('妖精石板（fairy-plate）');
  expect(renderOptionLabel(options, '2105')).toBe('妖精石板（fairy-plate）');
  expect(optionValueEquals(2105, '2105')).toBe(true);
});
