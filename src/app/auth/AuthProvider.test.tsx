import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthProvider';
import { saveAccessToken } from './auth-storage';

afterEach(() => {
  vi.restoreAllMocks();
  sessionStorage.clear();
});

it('restores session when an access token exists', async () => {
  saveAccessToken('token-value');
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(
      JSON.stringify({
        user: {
          id: 1,
          username: 'admin',
          displayName: '管理员',
        },
        roles: [{ code: 'system-admin', name: '系统管理员' }],
        accessNodeCodes: ['security:admin'],
        menus: [],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    ),
  );

  const wrapper = ({ children }: PropsWithChildren) => <AuthProvider>{children}</AuthProvider>;
  const { result } = renderHook(() => useAuth(), { wrapper });

  await waitFor(() => expect(result.current.status).toBe('authenticated'));
  expect(result.current.session?.user.username).toBe('admin');
});
