import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

test.skip(
  process.env.AVALON_E2E_REAL_BACKEND !== '1',
  '设置 AVALON_E2E_REAL_BACKEND=1 后连接本机真实后端运行。',
);
test.setTimeout(180_000);

test('两个普通账户可以完成私人对战并查看历史', async ({ browser, request }) => {
  const suffix = Date.now().toString(36);
  const password = `Match${suffix}Aa1`;
  const first = { username: `match_a_${suffix}`, trainer: `Alpha${suffix}` };
  const second = { username: `match_b_${suffix}`, trainer: `Beta${suffix}` };
  await createPlayerAccounts(request, password, first.username, second.username);

  const firstContext = await browser.newContext();
  const secondContext = await browser.newContext();
  const firstPage = await firstContext.newPage();
  const secondPage = await secondContext.newPage();

  await loginAndPrepareTrainer(firstPage, first.username, password, first.trainer);
  await loginAndPrepareTrainer(secondPage, second.username, password, second.trainer);

  // 双方都保持 Trainer Presence 后再发现目标，确保测试覆盖真实在线判定。
  await firstPage.getByLabel('Trainer 名称').fill(second.trainer);
  await firstPage.getByRole('button', { name: '精确查找' }).click();
  await expect(firstPage.getByText('当前在线，可以发起挑战')).toBeVisible();

  await firstPage.getByLabel('目标 Trainer').fill(second.trainer);
  await firstPage.getByRole('button', { name: '发起 Challenge' }).click();
  await expect(
    firstPage.getByText(new RegExp(`${first.trainer}.*${second.trainer}`)),
  ).toBeVisible();

  // Challenge 列表不轮询；刷新后重新选择 Trainer，从服务端恢复权威列表。
  await secondPage.reload();
  const challengesResponsePromise = secondPage.waitForResponse(
    (response) =>
      response.request().method() === 'GET' && response.url().includes('/api/player/challenges'),
  );
  await selectTrainer(secondPage, second.trainer);
  const challengesResponse = await challengesResponsePromise;
  expect(challengesResponse.status()).toBe(200);
  const challenges = (await challengesResponse.json()) as Array<{
    challengedDisplayName: string;
    direction: string;
    status: string;
  }>;
  expect(challenges).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        challengedDisplayName: second.trainer,
        direction: 'INCOMING',
        status: 'PENDING',
      }),
    ]),
  );
  const acceptButton = secondPage.getByRole('button', { name: /接\s*受/ });
  await expect(acceptButton).toBeVisible();
  await acceptButton.click();
  await expect(secondPage.getByText(/Match ACTIVE.*Turn 0/)).toBeVisible();

  // 发起方同样通过重新进入恢复当前 Match，覆盖刷新后凭据仅存内存的恢复边界。
  await firstPage.reload();
  await selectTrainer(firstPage, first.trainer);
  await expect(firstPage.getByText(/Match ACTIVE.*Turn 0/)).toBeVisible();
  await expect(secondPage.getByText(/Match ACTIVE.*Turn 0/)).toBeVisible();

  await lockFirstAvailableAction(firstPage);
  await lockFirstAvailableAction(secondPage);
  await expect(secondPage.getByText(/Match ACTIVE.*Turn 1/)).toBeVisible();

  await secondPage.getByRole('button', { name: /认\s*输/ }).click();
  await secondPage.getByRole('button', { name: /确\s*定/ }).click();
  await expect(secondPage.getByText(/(WIN|LOSS|FORFEIT)/).first()).toBeVisible();

  await firstPage.reload();
  await selectTrainer(firstPage, first.trainer);
  const historyRow = firstPage.getByRole('listitem').filter({ hasText: second.trainer }).first();
  await expect(historyRow).toBeVisible();
  await historyRow.getByRole('button', { name: '查看详情' }).click();
  await expect(firstPage.getByText(/历史详情/)).toBeVisible();
});

async function createPlayerAccounts(
  request: APIRequestContext,
  password: string,
  ...usernames: string[]
) {
  const tokenResponse = await request.post('/oauth2/token', {
    form: {
      grant_type: 'urn:security:params:oauth:grant-type:password',
      client_id: 'avalon-web',
      username: process.env.AVALON_E2E_USERNAME ?? 'admin',
      password: process.env.AVALON_E2E_PASSWORD ?? '123456',
      scope:
        'battle-rules:admin battle-sandbox:run battle-sessions:run game-data:admin player security:admin',
    },
  });
  expect(tokenResponse.ok(), await tokenResponse.text()).toBeTruthy();
  const token = (await tokenResponse.json()) as { access_token: string };

  for (const username of usernames) {
    const response = await request.post('/api/system/rbac/users', {
      headers: { Authorization: `Bearer ${token.access_token}` },
      // 用户管理契约要求至少一个角色；runner 仅有沙盒执行权，不含任何管理权限。
      data: { username, password, displayName: username, roleCodes: ['battle-sandbox-runner'] },
    });
    expect(response.ok(), await response.text()).toBeTruthy();
  }
}

async function loginAndPrepareTrainer(
  page: Page,
  username: string,
  password: string,
  trainerName: string,
) {
  await page.goto('/login');
  await page.getByLabel('用户名').fill(username);
  await page.getByLabel('密码').fill(password);
  const tokenResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/oauth2/token'),
  );
  await page.locator('button[type="submit"]').click();
  const tokenResponse = await tokenResponsePromise;
  expect(tokenResponse.status(), `password grant failed for ${username}`).toBe(200);
  await expect(page).not.toHaveURL(/\/login$/);
  await page.goto('/play');

  await page.getByPlaceholder('Trainer 名称').fill(trainerName);
  await page.getByRole('button', { name: '创建 Trainer' }).click();
  await selectTrainer(page, trainerName);

  await page.getByRole('button', { name: '添加 Team 成员' }).click();
  await page.getByLabel('精灵 ID').fill('1');
  await page.getByLabel('技能 ID').fill('14');
  await page.getByLabel('特性 ID').fill('65');
  await page.getByLabel('道具 ID').fill('1');
  await page.getByLabel('性格 ID').fill('1');
  await page.getByRole('button', { name: '保存 Team' }).click();
  await expect(page.getByText(/Team 已保存，版本/)).toBeVisible();
}

async function selectTrainer(page: Page, trainerName: string) {
  const row = page.getByRole('listitem').filter({ hasText: trainerName });
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: '选择 Trainer' }).click();
  await expect(page.getByText(`当前 Trainer：${trainerName}`)).toBeVisible();
}

async function lockFirstAvailableAction(page: Page) {
  await page
    .getByRole('button', { name: /技能 \d+.*#\d+/ })
    .first()
    .click();
  const responsePromise = page.waitForResponse(
    (response) => response.request().method() === 'POST' && response.url().includes('/turns'),
  );
  await page.getByRole('button', { name: '锁定本回合行动' }).click();
  const response = await responsePromise;
  expect(response.status()).toBe(200);
}
