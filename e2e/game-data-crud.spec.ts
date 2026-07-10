import { expect, test, type Page } from '@playwright/test';

interface CreatureRecord {
  id: string;
  code: string;
  name: string;
  height?: number | null;
  weight?: number | null;
  enabled?: boolean;
}

interface CreatureStatRecord {
  id: string;
  creature_id: string;
  stat_id: string;
  base_value: number;
  effort: number;
}

test('精灵资料页面可以完成新增编辑删除流程', async ({ page }) => {
  const browserIssues = collectBrowserIssues(page);
  await mockBackend(page);

  await login(page);
  await page.goto('/game-data/creatures');

  await expect(page.getByRole('heading', { name: '精灵资料' })).toBeVisible();
  await expect(page.getByText('妙蛙种子').first()).toBeVisible();

  await page.getByRole('button', { name: '新建资料' }).click();
  const createDialog = page.getByRole('dialog', { name: '新建精灵资料' });
  await createDialog.getByLabel('编码').fill('test-creature');
  await createDialog.getByLabel('名称').fill('测试精灵');
  await createDialog.getByLabel('高度').fill('7');
  await createDialog.getByRole('button', { name: /保\s*存/ }).click();
  await expect(page.getByText('测试精灵').first()).toBeVisible();

  const createdRow = page.getByRole('row').filter({ hasText: '测试精灵' });
  await createdRow.getByRole('button', { name: '编辑' }).click();
  const editDialog = page.getByRole('dialog', { name: '编辑精灵资料' });
  await editDialog.getByLabel('名称').fill('测试精灵改');
  await editDialog.getByRole('button', { name: /保\s*存/ }).click();
  await expect(page.getByText('测试精灵改').first()).toBeVisible();

  const updatedRow = page.getByRole('row').filter({ hasText: '测试精灵改' });
  await updatedRow.getByRole('button', { name: '删除' }).click();
  await page.getByRole('button', { name: /确\s*认/ }).click();
  await expect(page.getByText('测试精灵改')).toHaveCount(0);
  expect(browserIssues()).toEqual([]);
});

test('精灵数值绑定页面显示引用文本并可编辑数值', async ({ page }) => {
  const browserIssues = collectBrowserIssues(page);
  await mockBackend(page);

  await login(page);
  await page.goto('/game-data/creature-stats');

  /**
   * 这条浏览器验收专门固定“关系表外键不能露出裸 ID”的真实页面行为。
   *
   * Vitest 已经覆盖组件层会调用引用资料 service，但曾经出问题的是浏览器里表格和弹窗组合后仍只展示数字。
   * 所以这里用完整路由、登录态菜单和模拟 HTTP 响应跑一遍：表格要看到“妙蛙种子 / 体力”，编辑弹窗也要继续
   * 看到可读文本；用户真正编辑的业务字段只改基础值，避免把测试写成依赖 Ant Design Select 内部 DOM 的脆弱用例。
   */
  await expect(page.getByRole('heading', { name: '精灵数值绑定' })).toBeVisible();
  const row = page.getByRole('row').filter({ hasText: '妙蛙种子' }).filter({ hasText: '体力' });
  await expect(row).toBeVisible();
  await expect(row).toContainText('45');

  await row.getByRole('button', { name: '编辑' }).click();
  const editDialog = page.getByRole('dialog', { name: '编辑精灵数值绑定' });
  await expect(editDialog.getByText('妙蛙种子').first()).toBeVisible();
  await expect(editDialog.getByText('体力').first()).toBeVisible();
  await editDialog.getByLabel('基础值').fill('46');
  await editDialog.getByRole('button', { name: /保\s*存/ }).click();

  await expect(page.getByRole('row').filter({ hasText: '46' })).toBeVisible();
  expect(browserIssues()).toEqual([]);
});

async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel('用户名').fill('admin');
  await page.getByLabel('密码').fill('secret');
  await page.locator('button[type="submit"]').click();
  await expect(page.getByRole('heading', { name: '工作台' })).toBeVisible();
}

async function mockBackend(page: Page) {
  let nextId = 2;
  let records: CreatureRecord[] = [
    {
      id: '1',
      code: 'bulbasaur',
      name: '妙蛙种子',
      height: 7,
      weight: 69,
      enabled: true,
    },
  ];
  const stats = [{ id: '1', code: 'hp', name: '体力' }];
  let creatureStats: CreatureStatRecord[] = [
    { id: '1', creature_id: '1', stat_id: '1', base_value: 45, effort: 0 },
  ];

  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());

    if (url.pathname === '/oauth2/token') {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-access-token',
          token_type: 'Bearer',
          expires_in: 1_800,
          scope: 'security:admin game-data:admin',
        }),
      });
      return;
    }

    if (url.pathname === '/api/session') {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 1, username: 'admin', displayName: '管理员' },
          roles: [{ code: 'admin', name: '管理员' }],
          accessNodeCodes: [
            'game-data',
            'game-data:admin',
            'game-data.creatures',
            'game-data.creature-stats',
          ],
          menus: [
            {
              code: 'game-data',
              name: '游戏资料',
              icon: 'lucide:database',
              type: 'DIRECTORY',
              path: '/game-data',
              children: [
                {
                  code: 'game-data.creatures',
                  name: '精灵资料',
                  icon: 'lucide:badge',
                  type: 'ROUTE',
                  path: '/game-data/creatures',
                  children: [],
                },
                {
                  code: 'game-data.creature-stats',
                  name: '精灵数值绑定',
                  icon: 'lucide:activity',
                  type: 'ROUTE',
                  path: '/game-data/creature-stats',
                  children: [],
                },
              ],
            },
          ],
        }),
      });
      return;
    }

    if (url.pathname === '/api/game-data/creature-stats' && route.request().method() === 'GET') {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          rows: creatureStats,
          totalRowCount: creatureStats.length,
          totalPageCount: 1,
          page: 0,
          size: 20,
        }),
      });
      return;
    }

    const creatureStatMatch = url.pathname.match(/^\/api\/game-data\/creature-stats\/(\d+)$/);
    if (creatureStatMatch && route.request().method() === 'PUT') {
      const id = creatureStatMatch[1];
      const payload = parsePostJson(route.request().postData());
      const current = creatureStats.find((record) => record.id === id);
      const updated = { ...current, ...payload, id } as CreatureStatRecord;
      creatureStats = creatureStats.map((record) => (record.id === id ? updated : record));
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify(updated) });
      return;
    }

    if (url.pathname === '/api/game-data/stats' && route.request().method() === 'GET') {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          rows: stats,
          totalRowCount: stats.length,
          totalPageCount: 1,
          page: 0,
          size: 20,
        }),
      });
      return;
    }

    if (url.pathname === '/api/game-data/creatures' && route.request().method() === 'GET') {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          rows: records,
          totalRowCount: records.length,
          totalPageCount: 1,
          page: 0,
          size: 20,
        }),
      });
      return;
    }

    if (url.pathname === '/api/game-data/creatures' && route.request().method() === 'POST') {
      const payload = parsePostJson(route.request().postData());
      const record = { id: String(nextId++), ...payload } as CreatureRecord;
      records = [...records, record];
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(record),
      });
      return;
    }

    const creatureMatch = url.pathname.match(/^\/api\/game-data\/creatures\/(\d+)$/);
    if (creatureMatch) {
      const id = creatureMatch[1];
      if (route.request().method() === 'GET') {
        const record = records.find((item) => item.id === id);
        await route.fulfill({ contentType: 'application/json', body: JSON.stringify(record) });
        return;
      }
      if (route.request().method() === 'PUT') {
        const payload = parsePostJson(route.request().postData());
        const current = records.find((record) => record.id === id);
        const updated = { ...current, ...payload, id } as CreatureRecord;
        records = records.map((record) => (record.id === id ? updated : record));
        await route.fulfill({ contentType: 'application/json', body: JSON.stringify(updated) });
        return;
      }
      if (route.request().method() === 'DELETE') {
        records = records.filter((record) => record.id !== id);
        await route.fulfill({ status: 204 });
        return;
      }
    }

    const statMatch = url.pathname.match(/^\/api\/game-data\/stats\/(\d+)$/);
    if (statMatch && route.request().method() === 'GET') {
      const id = statMatch[1];
      const record = stats.find((item) => item.id === id);
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify(record) });
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

function parsePostJson(raw: string | null): Record<string, unknown> {
  if (!raw) {
    return {};
  }
  return JSON.parse(raw) as Record<string, unknown>;
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
