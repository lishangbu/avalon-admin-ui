import { expect, test, type Page } from '@playwright/test';

test('战斗规则核心页面展示资料引用文本', async ({ page }) => {
  const browserIssues = collectBrowserIssues(page);
  await mockBackend(page);

  await login(page);

  await page.goto('/battle-rules/skill-rules');
  await expect(page.getByRole('heading', { name: '技能规则' })).toBeVisible();
  await expect(page.getByRole('row').filter({ hasText: '十万伏特' })).toBeVisible();

  await page.goto('/battle-rules/ability-rules');
  await expect(page.getByRole('heading', { name: '特性规则' })).toBeVisible();
  await expect(page.getByRole('row').filter({ hasText: '蓄电' })).toBeVisible();

  await page.goto('/battle-rules/item-rules');
  await expect(page.getByRole('heading', { name: '道具规则' })).toBeVisible();
  await expect(page.getByRole('row').filter({ hasText: '气势披带' })).toBeVisible();
  expect(browserIssues()).toEqual([]);
});

test('战斗规则核心页面可以编辑并刷新技能特性道具规则', async ({ page }) => {
  const browserIssues = collectBrowserIssues(page);
  await mockBackend(page);

  await login(page);

  await editSortOrder(page, '/battle-rules/skill-rules', '十万伏特', '编辑技能规则', 11);
  await editSortOrder(page, '/battle-rules/ability-rules', '蓄电', '编辑特性规则', 21);
  await editSortOrder(page, '/battle-rules/item-rules', '气势披带', '编辑道具规则', 31);

  expect(browserIssues()).toEqual([]);
});

async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel('用户名').fill('admin');
  await page.getByLabel('密码').fill('123456');
  await page.locator('button[type="submit"]').click();
  await expect(page.getByRole('heading', { name: '工作台' })).toBeVisible();
}

async function mockBackend(page: Page) {
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
        body: JSON.stringify({
          user: { id: 1, username: 'admin', displayName: '管理员' },
          roles: [{ code: 'admin', name: '管理员' }],
          accessNodeCodes: [
            'battle-rules',
            'battle-rules:admin',
            'battle-rules.skill-rules',
            'battle-rules.ability-rules',
            'battle-rules.item-rules',
          ],
          menus: [
            {
              code: 'battle-rules',
              name: '战斗规则',
              icon: 'lucide:swords',
              type: 'DIRECTORY',
              path: '/battle-rules',
              children: [
                menu('battle-rules.skill-rules', '技能规则', '/battle-rules/skill-rules'),
                menu('battle-rules.ability-rules', '特性规则', '/battle-rules/ability-rules'),
                menu('battle-rules.item-rules', '道具规则', '/battle-rules/item-rules'),
              ],
            },
          ],
        }),
      });
      return;
    }

    if (url.pathname.startsWith('/api/battle-rules/') && route.request().method() === 'PUT') {
      const collectionPath = url.pathname.replace(/\/\d+$/, '');
      const id = Number(url.pathname.split('/').pop());
      const rows = apiRows[collectionPath] ?? [];
      const current = rows.find((row) => row.id === id);
      const next = { ...current, ...parsePostJson(route.request().postData()), id };
      apiRows[collectionPath] = rows.map((row) => (row.id === id ? next : row));
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify(next) });
      return;
    }

    const pageBody = apiPage(apiRows[url.pathname] ?? []);
    if (
      url.pathname.startsWith('/api/battle-rules/') ||
      url.pathname.startsWith('/api/game-data/')
    ) {
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify(pageBody) });
      return;
    }

    await route.continue();
  });
}

async function editSortOrder(
  page: Page,
  path: string,
  rowText: string,
  dialogTitle: string,
  sortOrder: number,
) {
  await page.goto(path);
  const row = page.getByRole('row').filter({ hasText: rowText });
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: /编辑/ }).click();

  const dialog = page.getByRole('dialog', { name: dialogTitle });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('spinbutton', { name: '排序' }).fill(String(sortOrder));
  await dialog.getByRole('button', { name: /保\s*存/ }).click();

  // 保存后会由 React Query 重新拉表格；这里用页面可见文本验证真实的 PUT -> GET 闭环。
  await expect(
    page
      .getByRole('row')
      .filter({ hasText: rowText })
      .filter({ hasText: String(sortOrder) }),
  ).toBeVisible();
}

type ApiRow = Record<string, unknown> & { id: number };

const apiRows: Record<string, ApiRow[]> = {
  '/api/game-data/skills': [{ id: 85, code: 'thunderbolt', name: '十万伏特' }],
  '/api/game-data/abilities': [{ id: 10, code: 'volt-absorb', name: '蓄电' }],
  '/api/game-data/items': [{ id: 252, code: 'focus-sash', name: '气势披带' }],
  '/api/battle-rules/skill-rules': [
    {
      id: 1,
      skillId: 85,
      effectPolicy: 'standard-damage',
      targetPolicy: 'selected-target',
      hitPolicy: 'standard-hit',
      damagePolicy: 'standard-damage',
      minHits: 1,
      maxHits: 1,
      criticalHitStage: 0,
      makesContact: false,
      affectedByProtect: true,
      protectsUser: false,
      enduresFatalDamage: false,
      thawsUserBeforeMove: false,
      weakenedByGrassyTerrain: false,
      chargesBeforeUse: false,
      rechargesAfterUse: false,
      soundBased: false,
      powderBased: false,
      punchBased: false,
      slicingBased: false,
      lockMoveTurnsMin: 1,
      lockMoveTurnsMax: 1,
      confusesUserAfterLock: false,
      forceTargetSwitch: false,
      enabled: true,
      sortOrder: 10,
    },
  ],
  '/api/battle-rules/ability-rules': [
    {
      id: 2,
      abilityId: 10,
      triggerTiming: 'BEFORE_DAMAGE',
      effectPolicy: 'element-absorb-heal',
      triggerOrder: 10,
      enabled: true,
      sortOrder: 20,
    },
  ],
  '/api/battle-rules/item-rules': [
    {
      id: 3,
      itemId: 252,
      triggerTiming: 'BEFORE_DAMAGE',
      effectPolicy: 'fatal-damage-survive',
      consumable: true,
      triggerOrder: 10,
      enabled: true,
      sortOrder: 30,
    },
  ],
};

function parsePostJson(raw: string | null): Record<string, unknown> {
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function menu(code: string, name: string, path: string) {
  return {
    code,
    name,
    icon: 'lucide:circle',
    type: 'ROUTE',
    path,
    children: [],
  };
}

function apiPage(rows: unknown[]) {
  return {
    rows,
    totalRowCount: rows.length,
    totalPageCount: 1,
    page: 0,
    size: 20,
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
