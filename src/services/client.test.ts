import { beforeEach, expect, it, vi } from 'vitest';
import { readAccessToken, saveAccessToken } from '../app/auth/auth-storage';
import { ApiError } from '../shared/api/errors';
import {
  clearTrainerSessionCredential,
  readTrainerSessionCredential,
  saveTrainerSessionCredential,
} from '../app/auth/trainer-session-storage';
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
  clearTrainerSessionCredential();
  vi.unstubAllGlobals();
});

it('allows configured command endpoints to complete with an empty success body', async () => {
  request.mockResolvedValue({
    data: undefined,
    response: new Response(null, { status: 201 }),
  });

  await expect(
    apiRequest('POST', '/api/system/scheduler/tasks/1/enable', { allowEmptyResponse: true }),
  ).resolves.toBeUndefined();
});

it('keeps empty success bodies invalid by default', async () => {
  request.mockResolvedValue({
    data: undefined,
    response: new Response(null, { status: 201 }),
  });

  await expect(apiRequest('POST', '/api/system/scheduler/tasks/1/enable')).rejects.toThrow(
    ApiError,
  );
  await expect(apiRequest('POST', '/api/system/scheduler/tasks/1/enable')).rejects.toThrow(
    '后端响应为空',
  );
});

it('invalidates the current access token when the backend responds with 401', async () => {
  saveAccessToken('expired-token');
  request.mockResolvedValue({
    error: { code: 'authentication.required', message: '登录态已失效' },
    response: new Response(null, { status: 401 }),
  });

  await expect(apiRequest('GET', '/api/protected')).rejects.toThrow('登录态已失效');
  expect(readAccessToken()).toBeNull();
});

it('rejects an empty 401 response even when the endpoint allows an empty success body', async () => {
  saveAccessToken('expired-token');
  request.mockResolvedValue({
    error: undefined,
    response: new Response(null, { status: 401 }),
  });

  await expect(
    apiRequest('DELETE', '/api/protected', { allowEmptyResponse: true }),
  ).rejects.toThrow('当前登录态已失效');
  expect(readAccessToken()).toBeNull();
});

it('does not invalidate a newer token when an old request returns 401 late', async () => {
  let resolveRequest!: (value: unknown) => void;
  request.mockReturnValue(
    new Promise((resolve) => {
      resolveRequest = resolve;
    }),
  );
  saveAccessToken('old-token');

  const pendingRequest = apiRequest('GET', '/api/protected');
  saveAccessToken('new-token');
  resolveRequest({
    error: { code: 'authentication.required', message: '旧登录态已失效' },
    response: new Response(null, { status: 401 }),
  });

  await expect(pendingRequest).rejects.toThrow('旧登录态已失效');
  expect(readAccessToken()).toBe('new-token');
});

it('injects Trainer Session header and clears only that credential when it expires', async () => {
  saveAccessToken('access-token');
  saveTrainerSessionCredential('trainer-credential');
  request.mockResolvedValue({
    error: { code: 'trainer-session.invalid', message: 'Trainer Session 已失效' },
    response: new Response(null, { status: 401 }),
  });

  await expect(
    apiRequest('GET', '/api/player/trainer-session', { requiresTrainerSession: true }),
  ).rejects.toThrow('Trainer Session 已失效');

  expect(request).toHaveBeenCalledWith(
    'get',
    '/api/player/trainer-session',
    expect.objectContaining({
      headers: {
        'avalon-token': 'access-token',
        'X-Trainer-Session': 'trainer-credential',
      },
    }),
  );
  expect(readTrainerSessionCredential()).toBeNull();
  expect(readAccessToken()).toBe('access-token');
});
