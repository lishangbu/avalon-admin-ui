import { expect, test, type Page } from '@playwright/test';

type SessionMenuNode = {
  code: string;
  name?: string;
  icon?: string;
  type?: 'DIRECTORY' | 'ROUTE';
  path?: string;
  children?: SessionMenuNode[];
};

const criticalPages = [
  { path: '/', heading: '工作台' },
  { path: '/system/rbac/access-nodes', heading: '访问节点' },
  { path: '/game-data/creatures', heading: '精灵资料' },
  { path: '/game-data/creature-stats', heading: '精灵数值绑定' },
  { path: '/battle-rules/battle-formats', heading: '战斗赛制' },
  { path: '/battle-rules/weather-rules', heading: '天气规则' },
] as const;

const requiredMenuPaths = criticalPages.map((page) => page.path).filter((path) => path !== '/');

test('登录后菜单根节点和关键页面可以渲染', async ({ page }) => {
  const browserIssues = collectBrowserIssues(page);
  if (process.env.AVALON_E2E_MOCK === '1') {
    await mockBackend(page);
  }

  await login(page);

  const menuNodes = await loadSessionMenus(page);
  const allMenuNodes = flattenMenuNodes(menuNodes);
  const routePaths = allMenuNodes
    .filter((node) => node.type === 'ROUTE')
    .map((node) => node.path)
    .filter((path): path is string => Boolean(path));

  /**
   * 这组 smoke 只兜底最常出问题的入口：系统、资料、战斗规则。
   * 逐页全量打开所有资料表会很慢，路由完整性已由 Vitest 的 route 配置测试覆盖。
   */
  expect(menuNodes.map((node) => node.name)).toEqual(
    expect.arrayContaining(['系统管理', '游戏资料', '战斗规则']),
  );
  expect(routePaths).toEqual(expect.arrayContaining(requiredMenuPaths));

  for (const criticalPage of criticalPages) {
    await page.goto(criticalPage.path);
    await expect(page.getByRole('heading', { name: criticalPage.heading })).toBeVisible();
    await expect(page.getByText(/加载失败|当前登录态已失效|页面不存在|没有访问权限/)).toHaveCount(
      0,
    );
  }

  expect(browserIssues()).toEqual([]);
});

async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel('用户名').fill(process.env.AVALON_E2E_USERNAME ?? 'admin');
  await page.getByLabel('密码').fill(process.env.AVALON_E2E_PASSWORD ?? 'secret');
  await page.locator('button[type="submit"]').click();
  await expect(page.getByRole('heading', { name: '工作台' })).toBeVisible();
}

async function mockBackend(page: Page) {
  /**
   * CI 环境没有真实后端和数据库，这里只模拟 smoke 必需的稳定契约：
   * token 登录、后端菜单树和空分页响应。真实接口字段完整性仍由 Vitest 的
   * OpenAPI/路由契约测试覆盖，本地不设置 AVALON_E2E_MOCK 时继续打真实服务。
   */
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());

    if (url.pathname === '/oauth2/token') {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-access-token',
          token_type: 'Bearer',
          expires_in: 1_800,
          scope: 'security:admin battle-rules:admin game-data:admin',
        }),
      });
      return;
    }

    if (url.pathname === '/api/session') {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(createMockSession()),
      });
      return;
    }

    if (url.pathname.startsWith('/api/')) {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ rows: [], totalRowCount: 0, totalPageCount: 0, page: 0, size: 20 }),
      });
      return;
    }

    await route.continue();
  });
}

function createMockSession() {
  const menus: SessionMenuNode[] = [
    {
      code: 'system',
      name: '系统管理',
      icon: 'lucide:settings',
      type: 'DIRECTORY',
      children: [
        {
          code: 'system.rbac.access-nodes',
          name: '访问节点',
          icon: 'lucide:network',
          type: 'ROUTE',
          path: '/system/rbac/access-nodes',
        },
      ],
    },
    {
      code: 'game-data',
      name: '游戏资料',
      icon: 'lucide:database',
      type: 'DIRECTORY',
      children: [
        {
          code: 'game-data.creatures',
          name: '精灵资料',
          icon: 'lucide:circle-dot',
          type: 'ROUTE',
          path: '/game-data/creatures',
        },
        {
          code: 'game-data.creature-stats',
          name: '精灵数值绑定',
          icon: 'lucide:chart-column',
          type: 'ROUTE',
          path: '/game-data/creature-stats',
        },
      ],
    },
    {
      code: 'battle-rules',
      name: '战斗规则',
      icon: 'lucide:swords',
      type: 'DIRECTORY',
      children: [
        {
          code: 'battle-rules.battle-formats',
          name: '战斗赛制',
          icon: 'lucide:shield-check',
          type: 'ROUTE',
          path: '/battle-rules/battle-formats',
        },
        {
          code: 'battle-rules.weather-rules',
          name: '天气规则',
          icon: 'lucide:cloud-sun',
          type: 'ROUTE',
          path: '/battle-rules/weather-rules',
        },
      ],
    },
  ];

  return {
    user: { id: 1, username: 'admin', displayName: '管理员' },
    roles: [{ code: 'admin', name: '管理员' }],
    accessNodeCodes: flattenMenuNodes(menus).map((node) => node.code),
    menus,
  };
}

async function loadSessionMenus(page: Page): Promise<SessionMenuNode[]> {
  return page.evaluate(async () => {
    const token = sessionStorage.getItem('avalon_admin_access_token');
    const response = await fetch('/api/session', {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!response.ok) {
      throw new Error(`session 加载失败：${response.status}`);
    }
    return (await response.json()).menus;
  });
}

function collectBrowserIssues(page: Page) {
  const issues: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error' || message.text().includes('[antd: message]')) {
      issues.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on('pageerror', (error) => {
    issues.push(`pageerror: ${error.message}`);
  });
  return () => issues;
}

function flattenMenuNodes(nodes: SessionMenuNode[]): SessionMenuNode[] {
  return nodes.flatMap((node) => [node, ...flattenMenuNodes(node.children ?? [])]);
}
