import { expect, it } from 'vitest';
import { toBackendPage, toProTableResult } from './page';

it('maps jimmer page response to pro table request result', () => {
  expect(toProTableResult({ rows: [{ id: 1 }], totalRowCount: 1 })).toEqual({
    data: [{ id: 1 }],
    success: true,
    total: 1,
  });
});

it('converts pro table one-based current page to backend zero-based page', () => {
  expect(toBackendPage({ current: 2, pageSize: 20 })).toEqual({ page: 1, size: 20 });
});
