import { expect, it } from 'vitest';
import type { GameDataResourceConfig } from './game-data-resources';
import { normalizeFieldFilters, toFormValues, toRecordFields } from './GameDataRecordTransforms';

const config: GameDataResourceConfig = {
  key: 'example',
  path: '/game-data/example',
  title: '示例',
  description: '示例资料',
  searchPlaceholder: '关键字',
  fields: [
    { name: 'parent_id', label: '父级', type: 'long', reference: { resource: 'example' } },
    { name: 'name', label: '名称', type: 'string' },
  ],
};

it('keeps response identifiers as strings while forms are populated', () => {
  expect(toFormValues(config, { id: '9007199254740993', parent_id: '42', name: '示例' })).toEqual({
    parent_id: '42',
    name: '示例',
  });
});

it('keeps Long form and filter values as request strings', () => {
  expect(toRecordFields(config, { parent_id: '42', name: ' 示例 ' })).toEqual({
    parent_id: '42',
    name: '示例',
  });
  expect(normalizeFieldFilters(config, { parent_id: '42' })).toEqual({ parent_id: '42' });
});
