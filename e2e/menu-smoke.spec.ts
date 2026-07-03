import { expect, test, type Page } from '@playwright/test';

type SessionMenuNode = {
  code: string;
  name?: string;
  type?: 'DIRECTORY' | 'ROUTE';
  path?: string;
  children?: SessionMenuNode[];
};

const criticalPages = [
  { path: '/', heading: '工作台' },
  { path: '/system/rbac/access-nodes', heading: '访问节点' },
  { path: '/game-data/creatures', heading: '生物资料' },
  { path: '/game-data/creature-stats', heading: '生物数值绑定' },
  { path: '/battle-rules/battle-formats', heading: '战斗赛制' },
  { path: '/battle-rules/weather-rules', heading: '天气规则' },
] as const;

const requiredMenuPaths = criticalPages.map((page) => page.path).filter((path) => path !== '/');

test('登录后菜单根节点和关键页面可以渲染', async ({ page }) => {
  const browserIssues = collectBrowserIssues(page);
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
