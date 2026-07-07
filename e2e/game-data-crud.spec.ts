import { expect, test, type Page } from '@playwright/test';

interface CreatureRecord {
  id: number;
  code: string;
  name: string;
  height?: number | null;
  weight?: number | null;
  enabled?: boolean;
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
      id: 1,
      code: 'bulbasaur',
      name: '妙蛙种子',
      height: 7,
      weight: 69,
      enabled: true,
    },
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
          accessNodeCodes: ['game-data', 'game-data:admin', 'game-data.creatures'],
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
              ],
            },
          ],
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
      const record = { id: nextId++, ...payload } as CreatureRecord;
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
      const id = Number(creatureMatch[1]);
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
