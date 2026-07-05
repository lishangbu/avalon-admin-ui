import { expect, test, type Page } from '@playwright/test';

test('战斗沙盒可以连续提交回合并展示结算结果', async ({ page }) => {
  const browserIssues = collectBrowserIssues(page);
  if (process.env.AVALON_E2E_MOCK === '1') {
    await mockBackend(page);
  }

  await login(page);
  await page.goto('/battle-sandbox');

  await expect(page.getByRole('heading', { name: '战斗沙盒' })).toBeVisible();
  await expect(page.getByText('标准单打').first()).toBeVisible();

  await page.getByRole('button', { name: '结算回合' }).click();

  await expect(page.getByText('回合结算完成').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: '双方状态' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '事件流' })).toBeVisible();
  await expect(page.getByText('造成伤害').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: '随机轨迹' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '原因' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '已结算回合' })).toBeVisible();
  await expect(page.getByRole('button', { name: '复制复盘 JSON' })).toBeEnabled();

  await page.getByRole('button', { name: '继续结算' }).click();

  await expect(page.getByText('第 2 回合已结算。').first()).toBeVisible();
  expect(browserIssues()).toEqual([]);
});

test('移动端默认收起侧边栏并保留战斗沙盒内容宽度', async ({ page }) => {
  const browserIssues = collectBrowserIssues(page);
  if (process.env.AVALON_E2E_MOCK === '1') {
    await mockBackend(page);
  }

  await page.setViewportSize({ width: 390, height: 900 });
  await login(page);
  await page.goto('/battle-sandbox');

  await expect(page.getByRole('heading', { name: '战斗沙盒' })).toBeVisible();
  const mainBox = await page.locator('main').boundingBox();
  expect(mainBox?.width ?? 0).toBeGreaterThan(300);
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
  let sandboxTurnNumber = 0;

  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());

    if (url.pathname === '/oauth2/token') {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-access-token',
          token_type: 'Bearer',
          expires_in: 1_800,
          scope: 'security:admin battle-rules:admin battle-sandbox:run game-data:admin',
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
          accessNodeCodes: ['battle-sandbox', 'battle-sandbox:run'],
          menus: [
            {
              code: 'battle-sandbox',
              name: '战斗沙盒',
              icon: 'lucide:flask-conical',
              type: 'ROUTE',
              path: '/battle-sandbox',
              children: [],
            },
          ],
        }),
      });
      return;
    }

    if (url.pathname === '/api/battle-rules/battle-formats') {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          rows: [{ id: 1, code: 'standard-single', name: '标准单打' }],
          totalRowCount: 1,
          totalPageCount: 1,
        }),
      });
      return;
    }

    if (url.pathname === '/api/game-data/creatures') {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          rows: [
            { id: 1, code: 'bulbasaur', name: '妙蛙种子' },
            { id: 2, code: 'ivysaur', name: '妙蛙草' },
            { id: 4, code: 'charmander', name: '小火龙' },
            { id: 5, code: 'charmeleon', name: '火恐龙' },
          ],
          totalRowCount: 4,
          totalPageCount: 1,
        }),
      });
      return;
    }

    if (url.pathname === '/api/game-data/skills') {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          rows: [{ id: 1, code: 'pound', name: '拍击' }],
          totalRowCount: 1,
          totalPageCount: 1,
        }),
      });
      return;
    }

    if (url.pathname === '/api/game-data/abilities' || url.pathname === '/api/game-data/items') {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ rows: [], totalRowCount: 0, totalPageCount: 0 }),
      });
      return;
    }

    if (url.pathname === '/api/battle-sandbox/turn') {
      const requestBody = parsePostJson(route.request().postData());
      sandboxTurnNumber = (requestBody?.state?.turnNumber ?? sandboxTurnNumber) + 1;
      const targetHp = sandboxTurnNumber === 1 ? 96 : 82;
      const randomTrace = [{ sequence: 1, bound: 100, reason: 'damage-roll', value: 15 }];
      const turnEvents = Array.from({ length: sandboxTurnNumber }, (_, index) => ({
        type: 'DamageApplied',
        turnNumber: index + 1,
        message: `side-b-1 受到 ${index + 1 === sandboxTurnNumber ? 110 - targetHp : 14} 点伤害。`,
        payload: {},
      }));
      const events = [
        { type: 'BattleStarted', turnNumber: 0, message: '战斗开始。', payload: {} },
        ...turnEvents,
      ];
      const actions = [
        { type: 'USE_SKILL', actorId: 'side-a-1', skillId: 1, targetActorId: 'side-b-1' },
      ];
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          resolved: true,
          turnNumber: sandboxTurnNumber,
          sides: [
            {
              sideId: 'side-a',
              activeActorIds: ['side-a-1'],
              participants: [
                {
                  actorId: 'side-a-1',
                  creatureId: 1,
                  active: true,
                  level: 50,
                  currentHp: 120,
                  maxHp: 120,
                  statStages: {},
                  skillSlots: [{ skillId: 1, name: '拍击', remainingPp: 34, maxPp: 35 }],
                },
              ],
            },
            {
              sideId: 'side-b',
              activeActorIds: ['side-b-1'],
              participants: [
                {
                  actorId: 'side-b-1',
                  creatureId: 4,
                  active: true,
                  level: 50,
                  currentHp: targetHp,
                  maxHp: 110,
                  statStages: {},
                  skillSlots: [{ skillId: 1, name: '拍击', remainingPp: 34, maxPp: 35 }],
                },
              ],
            },
          ],
          events,
          violations: [],
          randomTrace,
          state: {
            turnNumber: sandboxTurnNumber,
            environment: { weather: 'NONE', terrain: 'NONE' },
            sides: [
              createMockStateSide('side-a', 'side-a-1', 120, 34),
              createMockStateSide('side-b', 'side-b-1', targetHp, 34),
            ],
            events,
            turns: turnEvents.map((event) => ({
              turnNumber: event.turnNumber,
              actions,
              randomTrace,
              events: [event],
            })),
          },
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

function parsePostJson(raw: string | null): { state?: { turnNumber?: number } } | undefined {
  if (!raw) {
    return undefined;
  }
  try {
    return JSON.parse(raw) as { state?: { turnNumber?: number } };
  } catch {
    return undefined;
  }
}

function createMockStateSide(
  sideId: string,
  actorId: string,
  currentHp: number,
  remainingPp: number,
) {
  return {
    sideId,
    activeActorIds: [actorId],
    participants: [
      {
        actorId,
        currentHp,
        elementIds: [1],
        grounded: true,
        statStages: {},
        skillSlots: [{ skillId: 1, remainingPp }],
        weightReduction: 0,
        protectionChain: 0,
        badPoisonCounter: 0,
        sleepTurnsRemaining: 0,
        chargingTurnsRemaining: 0,
        rechargeTurnsRemaining: 0,
        flinched: false,
        confusionTurnsRemaining: 0,
        healBlockTurnsRemaining: 0,
        tauntTurnsRemaining: 0,
        disabledSkillTurnsRemaining: 0,
        tormented: false,
        bindingTurnsRemaining: 0,
        lockedMoveTurnsRemaining: 0,
        lockedMoveConfusesOnEnd: false,
        substituteHp: 0,
      },
    ],
    damageReductions: [],
    speedModifiers: [],
    entryHazards: [],
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
