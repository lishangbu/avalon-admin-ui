import { expect, test, type Page, type Route } from '@playwright/test';
import type { components } from '../src/services/generated/schema';

type BattleSessionResponse = components['schemas']['BattleSessionResponse'];
type BattleSessionCreateRequest = components['schemas']['BattleSessionCreateRequest'];
type BattleSessionRosterSideRequest = components['schemas']['BattleSessionRosterSideRequest'];
type BattleSessionRosterParticipantRequest =
  components['schemas']['BattleSessionRosterParticipantRequest'];
type BattleSessionTurnRecordResponse = components['schemas']['BattleSessionTurnRecordResponse'];

const SESSION_ID = '550e8400-e29b-41d4-a716-446655440000';

test('管理员可以创建、推进并终止 Battle Session', async ({ page }) => {
  const browserIssues = collectBrowserIssues(page);
  const backend = await mockBackend(page);

  await login(page);
  await page.goto('/battle-sessions');
  await expect(page.getByRole('heading', { name: '战斗会话' })).toBeVisible();
  await page.getByRole('link', { name: '创建会话' }).click();

  await expect(page.getByRole('heading', { name: '创建战斗会话' })).toBeVisible();
  await page.getByRole('button', { name: '创建会话' }).click();

  await expect(page).toHaveURL(new RegExp(`/battle-sessions/${SESSION_ID}$`));
  await expect(page.getByText(SESSION_ID)).toBeVisible();
  expect(backend.createBody()).toEqual({
    formatCode: 'standard-single',
    sides: [
      {
        activeParticipantIndexes: [0],
        participants: [
          expect.objectContaining({ creatureId: '1', level: 50, skillIds: ['1'] }),
          expect.objectContaining({ creatureId: '2', level: 50, skillIds: ['1'] }),
        ],
      },
      {
        activeParticipantIndexes: [0],
        participants: [
          expect.objectContaining({ creatureId: '4', level: 50, skillIds: ['1'] }),
          expect.objectContaining({ creatureId: '5', level: 50, skillIds: ['1'] }),
        ],
      },
    ],
  });
  expect(JSON.stringify(backend.createBody())).not.toMatch(/randomSeed|sideId|actorId|state/);

  await page.getByRole('radio', { name: /side-1-actor-1 使用技能 1/ }).click();
  await page.getByRole('radio', { name: /side-2-actor-1 使用技能 1/ }).click();
  await page.getByRole('button', { name: '提交完整回合' }).click();
  await expect(page.getByText('damage-roll')).toBeVisible();
  expect(backend.turnBody()).toEqual(
    expect.objectContaining({
      expectedRevision: 0,
      actions: [
        {
          type: 'USE_SKILL',
          actorId: 'side-1-actor-1',
          skillId: '1',
          targetActorId: 'side-2-actor-1',
        },
        {
          type: 'USE_SKILL',
          actorId: 'side-2-actor-1',
          skillId: '1',
          targetActorId: 'side-1-actor-1',
        },
      ],
    }),
  );

  await page.getByRole('button', { name: '终止会话' }).click();
  await page.getByRole('button', { name: '确认终止' }).click();

  await expect(page.getByText('终态只读')).toBeVisible();
  await expect(page.getByText('2026-07-11T01:25:00Z')).toBeVisible();
  expect(backend.terminationBody()).toEqual(
    expect.objectContaining({ expectedRevision: 1, reason: '管理员终止' }),
  );
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
  let createRequestBody: unknown;
  let turnRequestBody: unknown;
  let terminationRequestBody: unknown;
  let session: BattleSessionResponse | undefined;
  let turnRecords: BattleSessionTurnRecordResponse[] = [];

  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    const method = route.request().method();

    if (url.pathname === '/oauth2/token') {
      await fulfillJson(route, {
        access_token: 'battle-session-token',
        token_type: 'Bearer',
        expires_in: 1_800,
        scope:
          'security:admin battle-rules:admin battle-sandbox:run battle-sessions:run game-data:admin',
      });
      return;
    }

    if (url.pathname === '/api/session') {
      await fulfillJson(route, {
        user: { id: '1', username: 'admin', displayName: '管理员' },
        roles: [{ code: 'admin', name: '管理员' }],
        accessNodeCodes: ['battle-sessions'],
        menus: [
          {
            code: 'battle-sessions',
            name: '战斗会话',
            icon: 'lucide:swords',
            type: 'ROUTE',
            path: '/battle-sessions',
          },
        ],
      });
      return;
    }

    if (url.pathname === '/api/battle-rules/battle-formats') {
      await fulfillPage(route, [{ id: '1', code: 'standard-single', name: '标准单打' }]);
      return;
    }

    if (url.pathname.startsWith('/api/game-data/')) {
      const resource = url.pathname.split('/').at(-1);
      const rows =
        resource === 'creatures'
          ? [
              { id: '1', name: '妙蛙种子' },
              { id: '2', name: '妙蛙草' },
              { id: '4', name: '小火龙' },
              { id: '5', name: '火恐龙' },
            ]
          : resource === 'skills'
            ? [{ id: '1', name: '拍击' }]
            : [];
      await fulfillPage(route, rows);
      return;
    }

    if (url.pathname === '/api/battle-sessions' && method === 'GET') {
      await fulfillPage(route, []);
      return;
    }

    if (url.pathname === '/api/battle-sessions' && method === 'POST') {
      createRequestBody = route.request().postDataJSON();
      session = createActiveSession(readCreateRequest(createRequestBody));
      await fulfillJson(route, session, 201);
      return;
    }

    if (url.pathname === `/api/battle-sessions/${SESSION_ID}` && method === 'GET') {
      await fulfillJson(route, requireCreatedSession(session));
      return;
    }

    if (url.pathname === `/api/battle-sessions/${SESSION_ID}/turns` && method === 'GET') {
      await fulfillPage(route, turnRecords);
      return;
    }

    if (url.pathname === `/api/battle-sessions/${SESSION_ID}/turns` && method === 'POST') {
      const body: unknown = route.request().postDataJSON();
      turnRequestBody = body;
      const currentSession = requireCreatedSession(session);
      if (readNumberField(body, 'expectedRevision') !== currentSession.revision) {
        await fulfillJson(route, { code: 'resource.conflict', message: 'revision 已变化' }, 409);
        return;
      }
      const commandId = readStringField(body, 'commandId');
      const record: BattleSessionTurnRecordResponse = {
        commandId,
        revisionBefore: 0,
        revisionAfter: 1,
        turnNumber: 1,
        submittedActions: [
          {
            type: 'USE_SKILL',
            actorId: 'side-1-actor-1',
            skillId: '1',
            targetActorId: 'side-2-actor-1',
          },
          {
            type: 'USE_SKILL',
            actorId: 'side-2-actor-1',
            skillId: '1',
            targetActorId: 'side-1-actor-1',
          },
        ],
        randomTrace: [{ sequence: 1, bound: 100, reason: 'damage-roll', value: 42 }],
        events: [],
        resolvedAt: '2026-07-11T01:06:00Z',
      };
      turnRecords = [record];
      session = {
        ...currentSession,
        revision: 1,
        turnNumber: 1,
        updatedAt: '2026-07-11T01:06:00Z',
        turnRequirements: [],
      };
      await fulfillJson(route, { session, turnRecord: record });
      return;
    }

    if (url.pathname === `/api/battle-sessions/${SESSION_ID}/termination` && method === 'POST') {
      terminationRequestBody = route.request().postDataJSON();
      const currentSession = requireCreatedSession(session);
      if (readNumberField(terminationRequestBody, 'expectedRevision') !== currentSession.revision) {
        await fulfillJson(route, { code: 'resource.conflict', message: 'revision 已变化' }, 409);
        return;
      }
      session = {
        ...currentSession,
        status: 'TERMINATED',
        revision: 2,
        updatedAt: '2026-07-11T01:10:00Z',
        endedAt: '2026-07-11T01:10:00Z',
        expiresAt: '2026-07-11T01:25:00Z',
        termination: {
          commandId: readStringField(terminationRequestBody, 'commandId'),
          reason: readStringField(terminationRequestBody, 'reason'),
          revisionBefore: 1,
          revisionAfter: 2,
          terminatedAt: '2026-07-11T01:10:00Z',
        },
      };
      await fulfillJson(route, session);
      return;
    }

    await route.continue();
  });

  return {
    createBody: () => createRequestBody,
    turnBody: () => turnRequestBody,
    terminationBody: () => terminationRequestBody,
  };
}

function createActiveSession(request: BattleSessionCreateRequest): BattleSessionResponse {
  const sides = request.sides.map((side, sideIndex) => {
    const sideId = `side-${sideIndex + 1}`;
    const activeActorIds = side.activeParticipantIndexes.map(
      (participantIndex) => `${sideId}-actor-${participantIndex + 1}`,
    );
    return {
      sideId,
      activeActorIds,
      participants: side.participants.map((participant, participantIndex) => ({
        actorId: `${sideId}-actor-${participantIndex + 1}`,
        creatureId: participant.creatureId,
        active: side.activeParticipantIndexes.includes(participantIndex),
        level: participant.level,
        currentHp: 100,
        maxHp: 100,
        statStages: {},
        skillSlots: participant.skillIds.map((skillId) => ({
          skillId,
          name: skillId === '1' ? '拍击' : `技能 ${skillId}`,
          remainingPp: 35,
          maxPp: 35,
        })),
      })),
    };
  });
  const activeActorIds = sides.flatMap((side) => side.activeActorIds);
  return {
    sessionId: SESSION_ID,
    formatCode: request.formatCode,
    status: 'ACTIVE',
    revision: 0,
    turnNumber: 0,
    createdAt: '2026-07-11T01:00:00Z',
    updatedAt: '2026-07-11T01:05:00Z',
    sides,
    turnRequirements: activeActorIds.map((actorId) => ({
      actorId,
      options: [
        {
          type: 'USE_SKILL',
          actorId,
          skillId: '1',
          targetActorId:
            sides.find((side) => !side.activeActorIds.includes(actorId))?.activeActorIds[0] ??
            actorId,
        },
      ],
    })),
  };
}

function readCreateRequest(value: unknown): BattleSessionCreateRequest {
  if (
    !isUnknownRecord(value) ||
    typeof value.formatCode !== 'string' ||
    !Array.isArray(value.sides) ||
    !value.sides.every(isRosterSideRequest)
  ) {
    throw new Error('创建请求不符合 BattleSessionCreateRequest');
  }
  return { formatCode: value.formatCode, sides: value.sides };
}

function isRosterSideRequest(value: unknown): value is BattleSessionRosterSideRequest {
  return (
    isUnknownRecord(value) &&
    Array.isArray(value.activeParticipantIndexes) &&
    value.activeParticipantIndexes.every((index) => typeof index === 'number') &&
    Array.isArray(value.participants) &&
    value.participants.every(isRosterParticipantRequest)
  );
}

function isRosterParticipantRequest(
  value: unknown,
): value is BattleSessionRosterParticipantRequest {
  return (
    isUnknownRecord(value) &&
    typeof value.creatureId === 'string' &&
    typeof value.level === 'number' &&
    Array.isArray(value.skillIds) &&
    value.skillIds.every((skillId) => typeof skillId === 'string')
  );
}

function requireCreatedSession(session: BattleSessionResponse | undefined): BattleSessionResponse {
  if (!session) {
    throw new Error('Battle Session 尚未创建');
  }
  return session;
}

async function fulfillPage(route: Route, rows: unknown[]) {
  await fulfillJson(route, {
    rows,
    totalRowCount: rows.length,
    totalPageCount: rows.length > 0 ? 1 : 0,
  });
}

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
}

function readStringField(value: unknown, field: string): string {
  if (!isUnknownRecord(value) || !(field in value)) {
    throw new Error(`请求缺少 ${field}`);
  }
  const fieldValue = value[field];
  if (typeof fieldValue !== 'string') {
    throw new Error(`请求字段 ${field} 不是字符串`);
  }
  return fieldValue;
}

function readNumberField(value: unknown, field: string): number {
  if (!isUnknownRecord(value) || !(field in value)) {
    throw new Error(`请求缺少 ${field}`);
  }
  const fieldValue = value[field];
  if (typeof fieldValue !== 'number') {
    throw new Error(`请求字段 ${field} 不是数字`);
  }
  return fieldValue;
}

function isUnknownRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function collectBrowserIssues(page: Page) {
  const issues: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error' || message.text().includes('[antd:')) {
      issues.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on('pageerror', (error) => {
    issues.push(`pageerror: ${error.message}`);
  });
  return () => issues;
}
