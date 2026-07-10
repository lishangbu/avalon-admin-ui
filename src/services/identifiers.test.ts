import { expect, it } from 'vitest';
import { toRequestLongId } from './identifiers';

it('preserves response string identifiers at the request boundary', () => {
  expect(toRequestLongId('9007199254740993')).toBe('9007199254740993');
});
