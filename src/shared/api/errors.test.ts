import { expect, it } from 'vitest';
import { ApiError, normalizeApiError } from './errors';

it('keeps backend error code message and field', () => {
  const error = normalizeApiError({
    code: 'validation.required',
    message: '用户名不能为空',
    field: 'username',
    matchId: '61',
  });

  expect(error).toBeInstanceOf(ApiError);
  expect(error.code).toBe('validation.required');
  expect(error.message).toBe('用户名不能为空');
  expect(error.field).toBe('username');
  expect(error.matchId).toBe('61');
});
