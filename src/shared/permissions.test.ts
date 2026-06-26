import { expect, it } from 'vitest';
import { hasAccess, hasAllAccess, hasAnyAccess } from './permissions';

it('checks a single access node code', () => {
  expect(hasAccess(['system.rbac.users'], 'system.rbac.users')).toBe(true);
  expect(hasAccess([], 'system.rbac.users')).toBe(false);
});

it('checks any and all access node codes', () => {
  expect(hasAnyAccess(['system.rbac.users'], ['missing', 'system.rbac.users'])).toBe(true);
  expect(hasAllAccess(['a', 'b'], ['a', 'b'])).toBe(true);
  expect(hasAllAccess(['a'], ['a', 'b'])).toBe(false);
});
