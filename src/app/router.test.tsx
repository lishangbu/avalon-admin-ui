import { render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { App } from './App';
import { saveAccessToken } from './auth/auth-storage';

afterEach(() => {
  vi.restoreAllMocks();
  sessionStorage.clear();
  window.history.replaceState({}, '', '/');
});

it('redirects an anonymous visitor from a protected route to login', async () => {
  window.history.pushState({}, '', '/system/rbac/users');

  render(<App />);

  expect(await screen.findByText('使用 Avalon 后端账号登录管理端。')).toBeInTheDocument();
  expect(window.location.pathname).toBe('/login');
});

it('shows access denied when an authenticated user opens a route without its access node', async () => {
  saveAccessToken('limited-user-token');
  window.history.pushState({}, '', '/system/rbac/users');
  mockAuthenticatedSession();

  render(<App />);

  expect(await screen.findByText('访问受限')).toBeInTheDocument();
  expect(screen.queryByText('用户管理')).not.toBeInTheDocument();
});

it.each([
  '/system/rbac/roles',
  '/system/rbac/access-nodes',
  '/system/oauth/clients',
  '/system/oauth/tokens',
  '/system/oauth/jwks',
  '/system/scheduler/tasks',
  '/game-data/creatures',
  '/battle-rules/battle-formats',
  '/battle-sandbox',
])('guards the management route %s with its access node', async (path) => {
  saveAccessToken('limited-user-token');
  window.history.pushState({}, '', path);
  mockAuthenticatedSession();

  render(<App />);

  expect(await screen.findByText('访问受限')).toBeInTheDocument();
});

it.each([
  ['/system/rbac/users', 'system.rbac.users', '用户管理'],
  ['/game-data/creatures', 'game-data.creatures', '精灵资料'],
  ['/battle-rules/battle-formats', 'battle-rules.battle-formats', '战斗赛制'],
  ['/battle-sandbox', 'battle-sandbox', '战斗沙盒'],
])('renders %s when the session grants %s', async (path, accessNodeCode, pageTitle) => {
  saveAccessToken('authorized-user-token');
  window.history.pushState({}, '', path);
  mockAuthenticatedSession([accessNodeCode]);

  render(<App />);

  expect(await screen.findByText(pageTitle)).toBeInTheDocument();
  expect(screen.queryByText('访问受限')).not.toBeInTheDocument();
});

function mockAuthenticatedSession(accessNodeCodes: string[] = []): void {
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
    const url = typeof input === 'string' ? input : input.url;
    if (url.endsWith('/api/session')) {
      return jsonResponse({
        user: { id: '1', username: 'limited-user', displayName: '受限用户' },
        roles: [],
        accessNodeCodes,
        menus: [],
      });
    }

    return jsonResponse({ rows: [], totalRowCount: 0, totalPageCount: 0 });
  });
}

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
