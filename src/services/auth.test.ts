import { afterEach, expect, it, vi } from 'vitest';
import { fetchCurrentSession, loginWithPassword, revokeCurrentLogin } from './auth';
import { saveAccessToken } from '../app/auth/auth-storage';

afterEach(() => {
  vi.restoreAllMocks();
  sessionStorage.clear();
});

it('posts credentials to the sa token login endpoint', async () => {
  const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify({ tokenName: 'avalon-token', tokenValue: 'token', timeout: 60 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  await loginWithPassword({ username: 'admin', password: 'secret' });

  expect(fetchMock).toHaveBeenCalledWith('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'secret' }),
  });
});

it('uses the avalon token header for session recovery and logout', async () => {
  saveAccessToken('current-token');
  const fetchMock = vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ user: {}, roles: [], accessNodeCodes: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    .mockResolvedValueOnce(new Response(null, { status: 204 }));

  await fetchCurrentSession();
  await revokeCurrentLogin('current-token');

  expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/session', {
    headers: { 'avalon-token': 'current-token' },
  });
  expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/auth/logout', {
    method: 'POST',
    headers: { 'avalon-token': 'current-token' },
  });
});
