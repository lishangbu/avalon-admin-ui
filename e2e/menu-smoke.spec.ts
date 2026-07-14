import { expect, test, type Page } from '@playwright/test';

const grantedAccessNodeCodes = [
  'system.rbac.access-nodes',
  'game-data.creatures',
  'game-data.creature-stats',
  'battle-rules.battle-formats',
  'battle-rules.format-clauses',
  'battle-rules.format-clause-bindings',
  'battle-rules.format-restrictions',
  'battle-rules.preparation-validation',
  'battle-rules.action-validation',
  'battle-rules.special-mechanics',
  'battle-rules.format-special-mechanics',
  'battle-rules.status-rules',
  'battle-rules.weather-rules',
  'battle-rules.terrain-rules',
  'battle-rules.field-rules',
  'battle-rules.skill-rules',
  'battle-rules.skill-status-effects',
  'battle-rules.skill-stat-stage-effects',
  'battle-rules.skill-stat-stage-operations',
  'battle-rules.skill-field-effects',
  'battle-rules.skill-global-field-effects',
  'battle-rules.skill-weather-accuracy-overrides',
  'battle-rules.skill-weather-power-modifiers',
  'battle-rules.skill-weather-element-overrides',
  'battle-rules.skill-terrain-power-modifiers',
  'battle-rules.skill-terrain-element-overrides',
  'battle-rules.skill-charge-skip-weathers',
  'battle-rules.ability-rules',
  'battle-rules.item-rules',
  'battle-sandbox',
  'battle-sessions',
] as const;

const criticalPages = [
  { path: '/', heading: '工作台' },
  { path: '/system/rbac/access-nodes', heading: '访问节点' },
  { path: '/game-data/creatures', heading: '精灵资料' },
  { path: '/game-data/creature-stats', heading: '精灵数值绑定' },
  { path: '/battle-rules/battle-formats', heading: '战斗赛制' },
  { path: '/battle-rules/weather-rules', heading: '天气规则' },
  { path: '/battle-rules/skill-terrain-power-modifiers', heading: '技能场地威力' },
  { path: '/battle-sandbox', heading: '战斗沙盒' },
  { path: '/battle-sessions', heading: '战斗会话' },
] as const;

test('登录后菜单根节点和关键页面可以渲染', async ({ page }) => {
  const browserIssues = collectBrowserIssues(page);
  if (process.env.AVALON_E2E_MOCK === '1') {
    await mockBackend(page);
  }

  await login(page);

  /**
   * 这组 smoke 只兜底最常出问题的入口：系统、资料、战斗规则。
   * 逐页全量打开所有资料表会很慢，路由完整性已由 Vitest 的 route 配置测试覆盖。
   */
  for (const label of ['系统管理', '游戏资料', '战斗规则', '战斗沙盒', '战斗会话']) {
    await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
  }

  for (const criticalPage of criticalPages) {
    await page.goto(criticalPage.path);
    await expect(page.getByRole('heading', { name: criticalPage.heading })).toBeVisible();
    await expect(page.getByText(/加载失败|当前登录态已失效|页面不存在|没有访问权限/)).toHaveCount(
      0,
    );
  }

  await page.goto('/battle-rules/weather-rules');
  await expect(page.getByRole('heading', { name: '天气规则' })).toBeVisible();
  await expect(page.getByText('下雨').first()).toBeVisible();
  await page.getByRole('button', { name: /新建天气/ }).click();
  await expect(page.getByText('新建天气规则')).toBeVisible();

  expect(browserIssues()).toEqual([]);
});

async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel('用户名').fill(process.env.AVALON_E2E_USERNAME ?? 'admin');
  await page.getByLabel('密码').fill(process.env.AVALON_E2E_PASSWORD ?? '123456');
  await page.locator('button[type="submit"]').click();
  await expect(page.getByRole('heading', { name: '工作台' })).toBeVisible();
}

async function mockBackend(page: Page) {
  /**
   * CI 环境没有真实后端和数据库，这里只模拟 smoke 必需的稳定契约：
   * token 登录、权限快照和空分页响应。真实接口字段完整性仍由 Vitest 的
   * OpenAPI/路由契约测试覆盖，本地不设置 AVALON_E2E_MOCK 时继续打真实服务。
   */
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());

    if (url.pathname === '/api/auth/login') {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          tokenName: 'avalon-token',
          tokenValue: 'mock-access-token',
          timeout: 1_800,
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

    if (url.pathname === '/api/battle-rules/weather-rules') {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          rows: [
            {
              id: 1,
              code: 'rain',
              name: '下雨',
              effectPolicy: 'weather-rain',
              defaultDurationTurns: 5,
              enabled: true,
              sortOrder: 10,
            },
          ],
          totalRowCount: 1,
          totalPageCount: 1,
          page: 0,
          size: 20,
        }),
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
  return {
    user: { id: 1, username: 'admin', displayName: '管理员' },
    roles: [{ code: 'admin', name: '管理员' }],
    accessNodeCodes: grantedAccessNodeCodes,
  };
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
