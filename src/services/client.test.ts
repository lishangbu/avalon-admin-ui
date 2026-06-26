import { beforeEach, expect, it, vi } from 'vitest';
import { ApiError } from '../shared/api/errors';
import { apiRequest } from './client';

const request = vi.hoisted(() => vi.fn());

vi.mock('openapi-fetch', () => ({
  default: vi.fn(() => ({
    request,
  })),
}));

beforeEach(() => {
  request.mockReset();
  sessionStorage.clear();
});

it('allows configured command endpoints to complete with an empty success body', async () => {
  request.mockResolvedValue({
    data: undefined,
    response: new Response(null, { status: 201 }),
  });

  await expect(
    apiRequest('POST', '/api/system/oauth/jwks/rotation', { allowEmptyResponse: true }),
  ).resolves.toBeUndefined();
});

it('keeps empty success bodies invalid by default', async () => {
  request.mockResolvedValue({
    data: undefined,
    response: new Response(null, { status: 201 }),
  });

  await expect(apiRequest('POST', '/api/system/oauth/jwks/rotation')).rejects.toThrow(ApiError);
  await expect(apiRequest('POST', '/api/system/oauth/jwks/rotation')).rejects.toThrow(
    '后端响应为空',
  );
});
