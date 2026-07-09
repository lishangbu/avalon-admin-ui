import { expect, test, type Page } from '@playwright/test';

type MockTurnMode = 'resolved' | 'violation' | 'error';

interface MockPostPayload {
  state?: { turnNumber?: number };
  title?: unknown;
  formatCode?: unknown;
  responseJson?: unknown;
  turnNumber?: unknown;
  resolved?: unknown;
}

test('战斗沙盒可以连续提交回合并展示结算结果', async ({ page }) => {
  const browserIssues = collectBrowserIssues(page);
  await mockBackend(page);

  await login(page);
  await page.goto('/battle-sandbox');

  await expect(page.getByRole('heading', { name: '战斗沙盒' })).toBeVisible();
  await expect(page.getByText('标准单打').first()).toBeVisible();

  await page.getByRole('button', { name: '结算回合' }).click();

  await expect(page.getByText('回合结算完成').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: '双方状态' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '事件流' })).toBeVisible();
  await expect(page.getByText('side-b-1 受到 14 点伤害。').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: '随机轨迹' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '原因' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '已结算回合' })).toBeVisible();
  await expect(page.getByRole('button', { name: /复制当前/ })).toBeEnabled();

  await page.getByRole('button', { name: '继续结算' }).click();

  await expect(page.getByText('第 2 回合已结算。').first()).toBeVisible();
  expect(browserIssues()).toEqual([]);
});

test('战斗沙盒可以导出导入复盘并按回合查看事件', async ({ page }) => {
  const browserIssues = collectBrowserIssues(page);
  await mockClipboard(page);
  await mockBackend(page);

  await login(page);
  await page.goto('/battle-sandbox');
  await page.getByRole('button', { name: '结算回合' }).click();
  await expect(page.getByRole('heading', { name: '已结算回合' })).toBeVisible();

  await page.getByRole('button', { name: /复制当前/ }).click();
  const copiedText = await page.evaluate(
    () => (window as Window & { __copiedText?: string }).__copiedText,
  );
  expect(copiedText).toContain('"turnNumber": 1');
  expect(copiedText).toContain('"resolved": true');

  await page.getByLabel('复盘标题').fill('连续回合复盘');
  await page.getByRole('button', { name: '保存当前' }).click();
  const replayRow = page.getByRole('row').filter({ hasText: '连续回合复盘' });
  await expect(replayRow).toBeVisible();
  await page.getByLabel('搜索复盘').fill('standard-single');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(replayRow).toBeVisible();
  await page.getByLabel('搜索复盘').fill('不存在的复盘');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(replayRow).toHaveCount(0);
  await page.getByLabel('搜索复盘').fill('');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(replayRow).toBeVisible();

  await page.getByRole('button', { name: '重开战斗' }).click();
  await expect(page.getByRole('heading', { name: '已结算回合' })).toHaveCount(0);

  await replayRow.getByRole('button', { name: '载入' }).click();
  await expect(page.getByRole('heading', { name: '已结算回合' })).toBeVisible();
  await expect(page.getByText('side-b-1 受到 14 点伤害。').first()).toBeVisible();

  await replayRow.getByRole('button', { name: '删除' }).click();
  await expect(replayRow).toHaveCount(0);

  await page.getByLabel('复盘 JSON').fill('{"turnNumber":1}');
  await page.getByRole('button', { name: /导入/ }).click();
  await expect(page.locator('main').getByText('复盘 JSON 无法导入')).toBeVisible();
  await expect(page.locator('main').getByText(/缺少字段：resolved/)).toBeVisible();

  await page.getByLabel('复盘 JSON').fill(copiedText ?? '');
  await page.getByRole('button', { name: /导入/ }).click();
  await expect(page.getByRole('heading', { name: '已结算回合' })).toBeVisible();
  await page.getByRole('button', { name: /查看事件/ }).click();
  await expect(page.getByText('side-b-1 受到 14 点伤害。').first()).toBeVisible();
  await page.getByRole('button', { name: '继续结算' }).click();
  await expect(page.getByText('第 2 回合已结算。').first()).toBeVisible();

  await page.getByRole('button', { name: '重开战斗' }).click();
  await expect(page.getByRole('heading', { name: '已结算回合' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: '结算回合' })).toBeEnabled();
  expect(browserIssues()).toEqual([]);
});

test('战斗沙盒展示后端状态校验错误并可重置', async ({ page }) => {
  const browserIssues = collectBrowserIssues(page);
  await mockBackend(page, { turnMode: 'error' });

  await login(page);
  await page.goto('/battle-sandbox');
  await page.getByRole('button', { name: '结算回合' }).click();

  await expect(page.getByText('沙盒结算失败')).toBeVisible();
  await expect(page.locator('main').getByText('state 上场成员数量必须符合赛制')).toBeVisible();

  await page.getByRole('button', { name: /重置样例/ }).click();
  await expect(page.getByText('沙盒结算失败')).toHaveCount(0);
  expect(browserIssues().filter((issue) => !issue.includes('400 (Bad Request)'))).toEqual([]);
});

test('战斗沙盒展示行动违规和关联技能名称', async ({ page }) => {
  const browserIssues = collectBrowserIssues(page);
  await mockBackend(page, { turnMode: 'violation' });

  await login(page);
  await page.goto('/battle-sandbox');
  await page.getByRole('button', { name: '结算回合' }).click();

  await expect(page.getByText('行动校验未通过').first()).toBeVisible();
  const violationRow = page.getByRole('row').filter({ hasText: 'skill-no-pp' });
  await expect(violationRow).toContainText('拍击');
  await expect(violationRow).toContainText('技能 PP 已耗尽');
  expect(browserIssues()).toEqual([]);
});

test('移动端默认收起侧边栏并保留战斗沙盒内容宽度', async ({ page }) => {
  const browserIssues = collectBrowserIssues(page);
  await mockBackend(page);

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

async function mockBackend(page: Page, options: { turnMode?: MockTurnMode } = {}) {
  let sandboxTurnNumber = 0;
  let nextReplayId = 1;
  let replayRows: Array<{
    id: number;
    title: string;
    formatCode: string;
    turnNumber: number;
    resolved: boolean;
    resultSummary?: string;
    savedAt: string;
    responseJson: string;
  }> = [];
  const turnMode = options.turnMode ?? 'resolved';

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

    if (url.pathname === '/api/battle-sandbox/replays' && route.request().method() === 'GET') {
      const query = (url.searchParams.get('q') ?? '').trim().toLowerCase();
      const rows = query
        ? replayRows.filter(
            (row) =>
              row.title.toLowerCase().includes(query) ||
              row.formatCode.toLowerCase().includes(query),
          )
        : replayRows;
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          rows,
          totalRowCount: rows.length,
          totalPageCount: rows.length > 0 ? 1 : 0,
          page: 0,
          size: 8,
        }),
      });
      return;
    }

    if (url.pathname === '/api/battle-sandbox/replays' && route.request().method() === 'POST') {
      const requestBody = parsePostJson(route.request().postData());
      const responseJson =
        typeof requestBody?.responseJson === 'string' ? requestBody.responseJson : '{}';
      const response = parsePostJson(responseJson);
      const replay = {
        id: nextReplayId++,
        title: String(requestBody?.title ?? '未命名复盘'),
        formatCode: String(requestBody?.formatCode ?? 'standard-single'),
        turnNumber: Number(response?.turnNumber ?? 0),
        resolved: Boolean(response?.resolved),
        resultSummary: undefined,
        savedAt: new Date('2026-07-08T09:00:00.000Z').toISOString(),
        responseJson,
      };
      replayRows = [replay, ...replayRows];
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(replay),
      });
      return;
    }

    if (url.pathname.startsWith('/api/battle-sandbox/replays/')) {
      const id = Number(url.pathname.split('/').at(-1));
      const replay = replayRows.find((row) => row.id === id);
      if (!replay) {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({
            code: 'resource.not_found',
            field: 'id',
            message: '复盘不存在',
          }),
        });
        return;
      }
      if (route.request().method() === 'DELETE') {
        replayRows = replayRows.filter((row) => row.id !== id);
        await route.fulfill({ status: 204, body: '' });
        return;
      }
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify(replay) });
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
      if (turnMode === 'error') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            code: 'validation.invalid',
            field: 'state',
            message: 'state 上场成员数量必须符合赛制',
          }),
        });
        return;
      }

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
          resolved: turnMode !== 'violation',
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
          violations:
            turnMode === 'violation'
              ? [
                  {
                    code: 'skill-no-pp',
                    actorId: 'side-a-1',
                    targetActorId: 'side-b-1',
                    resourceId: 1,
                    message: '技能 PP 已耗尽',
                  },
                ]
              : [],
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

async function mockClipboard(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (window as Window & { __copiedText?: string }).__copiedText = text;
        },
      },
    });
  });
}

function parsePostJson(raw: string | null): MockPostPayload | undefined {
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
