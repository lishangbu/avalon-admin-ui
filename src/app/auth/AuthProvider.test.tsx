import { fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { useState, type PropsWithChildren } from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { apiRequest } from '../../services/client';
import { AuthProvider, useAuth } from './AuthProvider';
import { AuthenticatedRoute } from './ProtectedRoute';
import { readAccessToken, saveAccessToken } from './auth-storage';

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
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    ),
  );

  const wrapper = ({ children }: PropsWithChildren) => <AuthProvider>{children}</AuthProvider>;
  const { result } = renderHook(() => useAuth(), { wrapper });

  await waitFor(() => expect(result.current.status).toBe('authenticated'));
  expect(result.current.session?.user.username).toBe('admin');
});

it('clears an invalid token when session restoration fails', async () => {
  saveAccessToken('invalid-token');
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 401 }));

  const wrapper = ({ children }: PropsWithChildren) => <AuthProvider>{children}</AuthProvider>;
  const { result } = renderHook(() => useAuth(), { wrapper });

  await waitFor(() => expect(result.current.status).toBe('anonymous'));
  expect(result.current.session).toBeNull();
  expect(readAccessToken()).toBeNull();
});

it('returns to login and clears the token after a protected API responds with 401', async () => {
  saveAccessToken('expired-token');
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
    const url = requestUrl(input);
    if (url.endsWith('/api/session')) {
      return jsonResponse({
        user: { id: '1', username: 'admin', displayName: '管理员' },
        roles: [],
        accessNodeCodes: [],
      });
    }

    return new Response(
      JSON.stringify({ code: 'authentication.required', message: '登录态已失效' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } },
    );
  });

  render(<ProtectedActionTestApp />);

  fireEvent.click(await screen.findByRole('button', { name: '加载受保护数据' }));

  expect(await screen.findByText('登录页')).toBeInTheDocument();
  expect(readAccessToken()).toBeNull();
});

function ProtectedActionTestApp() {
  const [router] = useState(() => {
    const rootRoute = createRootRoute();
    const loginRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: 'login',
      component: () => <div>登录页</div>,
    });
    const authenticatedRoute = createRoute({
      getParentRoute: () => rootRoute,
      id: '_authenticated',
      component: AuthenticatedRoute,
    });
    const privateRoute = createRoute({
      getParentRoute: () => authenticatedRoute,
      path: 'private',
      component: ProtectedAction,
    });
    return createRouter({
      routeTree: rootRoute.addChildren([
        loginRoute,
        authenticatedRoute.addChildren([privateRoute]),
      ]),
      history: createMemoryHistory({ initialEntries: ['/private'] }),
    });
  });
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

function ProtectedAction() {
  return (
    <button
      type="button"
      onClick={() => {
        void apiRequest('GET', `${window.location.origin}/api/protected`).catch(() => undefined);
      }}
    >
      加载受保护数据
    </button>
  );
}

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') {
    return input;
  }
  if (input instanceof URL) {
    return input.href;
  }
  return input.url;
}

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
