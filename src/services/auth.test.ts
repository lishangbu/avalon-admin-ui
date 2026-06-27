import { afterEach, expect, it, vi } from 'vitest';
import { loginWithPassword } from './auth';

afterEach(() => {
  vi.restoreAllMocks();
});

it('posts custom password grant request with basic client authentication', async () => {
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
    Authorization: `Basic ${btoa('system-admin-jwt:system-admin-jwt-secret')}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  });
  expect(body.get('grant_type')).toBe('urn:security:params:oauth:grant-type:password');
  expect(body.get('username')).toBe('admin');
  expect(body.get('password')).toBe('secret');
  expect(body.get('scope')).toBe('security:admin game-data:admin');
});
