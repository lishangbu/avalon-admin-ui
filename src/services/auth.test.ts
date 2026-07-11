import { afterEach, expect, it, vi } from 'vitest';
import { loginWithPassword, refreshAccessToken } from './auth';
import { readAccessToken, readRefreshToken, saveRefreshToken } from '../app/auth/auth-storage';

afterEach(() => {
  vi.restoreAllMocks();
  sessionStorage.clear();
});

it('serializes concurrent refreshes and stores the rotated token', async () => {
  saveRefreshToken('old-refresh');
  const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify({ access_token: 'new-access', refresh_token: 'new-refresh' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  await Promise.all([refreshAccessToken(), refreshAccessToken()]);

  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(readAccessToken()).toBe('new-access');
  expect(readRefreshToken()).toBe('new-refresh');
});

it('posts custom password grant request as a public client without a secret', async () => {
  const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify({ access_token: 'access-token', token_type: 'Bearer' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  await loginWithPassword({ username: 'admin', password: 'secret' });

  const [url, init] = fetchMock.mock.calls[0]!;
  const body = init?.body as URLSearchParams;

  expect(url).toBe('/oauth2/token');
  expect(init?.method).toBe('POST');
  expect(init?.headers).toMatchObject({
    'Content-Type': 'application/x-www-form-urlencoded',
  });
  expect((init?.headers as Record<string, string>).Authorization).toBeUndefined();
  expect(body.get('client_id')).toBe('avalon-web');
  expect(body.get('grant_type')).toBe('urn:security:params:oauth:grant-type:password');
  expect(body.get('username')).toBe('admin');
  expect(body.get('password')).toBe('secret');
  expect(body.get('scope')).toBe(
    'battle-rules:admin battle-sandbox:run battle-sessions:run game-data:admin player security:admin',
  );
});
