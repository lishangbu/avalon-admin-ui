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
  await expect(secondPage.getByText('实时连接已建立')).toBeVisible();

  await secondPage.getByLabel('Trainer 名称').fill(first.trainer);
  await secondPage.getByRole('button', { name: '精确查找' }).click();
  await expect(secondPage.getByText('当前在线，可以发起挑战')).toBeVisible();

  // 浏览器离线必须立即显示重连提示，恢复后 WebSocket 用当前 Sa-Token 重新认证。
  await secondContext.setOffline(true);
  await expect(secondPage.getByText('实时连接中断，正在重连')).toBeVisible();
  await secondContext.setOffline(false);
  await expect(secondPage.getByText('实时连接已建立')).toBeVisible();

  // 双方都保持 Trainer Presence 后再发现目标，确保测试覆盖真实在线判定。
  await firstPage.getByLabel('Trainer 名称').fill(second.trainer);
  await firstPage.getByRole('button', { name: '精确查找' }).click();
  await expect(firstPage.getByText('当前在线，可以发起挑战')).toBeVisible();

  await firstPage.getByLabel('目标 Trainer').fill(second.trainer);
  await firstPage.getByRole('button', { name: '发起 Challenge' }).click();
  await expect(
    firstPage.getByText(new RegExp(`${first.trainer}.*${second.trainer}`)),
  ).toBeVisible();

  // 接收方依靠最小 WebSocket 通知刷新 REST Challenge 列表，不再重载页面或重建 Session。
  const acceptButton = secondPage.getByRole('button', { name: /接\s*受/ });
  await expect(acceptButton).toBeVisible();
  await acceptButton.click();
  await expect(secondPage.getByText(/Match ACTIVE.*Turn 0/)).toBeVisible();

  // 接受命令完成后，发起方也通过通知读取新的当前 Match。
  await expect(firstPage.getByText(/Match ACTIVE.*Turn 0/)).toBeVisible();
  await expect(secondPage.getByText(/Match ACTIVE.*Turn 0/)).toBeVisible();

  await lockFirstAvailableAction(firstPage);
  await lockFirstAvailableAction(secondPage);
  await expect(secondPage.getByText(/Match ACTIVE.*Turn 1/)).toBeVisible();

  await secondPage.getByRole('button', { name: /认\s*输/ }).click();
  await secondPage.getByRole('button', { name: /确\s*定/ }).click();
  await expect(secondPage.getByText(/(WIN|LOSS|FORFEIT)/).first()).toBeVisible();

  // 终态通知会让对方刷新 History，无需刷新浏览器。
  const historyCard = firstPage.locator('.ant-card').filter({ hasText: 'Match History' });
  const historyRow = historyCard.getByRole('listitem').filter({ hasText: second.trainer }).first();
  await expect(historyRow).toBeVisible();
  await historyRow.getByRole('button', { name: '查看详情' }).click();
  await expect(firstPage.getByText(/历史详情/)).toBeVisible();
});

test('心跳停止后服务端关闭连接并由客户端自动恢复', async ({ browser, request }) => {
  const suffix = `hb_${Date.now().toString(36)}`;
  const password = `Match${suffix}Aa1`;
  await createPlayerAccounts(request, password, suffix);
  const context = await browser.newContext();
  await context.addInitScript(() => {
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data: string | ArrayBufferLike | Blob | ArrayBufferView) {
      if (typeof data === 'string' && data.includes('HEARTBEAT')) return;
      return originalSend.call(this, data);
    };
  });
  const page = await context.newPage();
  await loginAndPrepareTrainer(page, suffix, password, `T${suffix}`);
  await expect(page.getByText('实时连接已建立')).toBeVisible();

  // 后端 35 秒无心跳会以 heartbeat.timeout 主动关闭，前端随后进入退避重连并重新认证。
  await expect(page.getByText('实时连接中断，正在重连')).toBeVisible({ timeout: 45_000 });
  await expect(page.getByText('实时连接已建立')).toBeVisible({ timeout: 10_000 });
});

async function createPlayerAccounts(
  request: APIRequestContext,
  password: string,
  ...usernames: string[]
) {
  const tokenResponse = await request.post('/api/auth/login', {
    data: {
      username: process.env.AVALON_E2E_USERNAME ?? 'admin',
      password: process.env.AVALON_E2E_PASSWORD ?? '123456',
    },
  });
  expect(tokenResponse.ok(), await tokenResponse.text()).toBeTruthy();
  const token = (await tokenResponse.json()) as { tokenValue: string };

  for (const username of usernames) {
    const response = await request.post('/api/system/rbac/users', {
      headers: { 'avalon-token': token.tokenValue },
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
    response.url().includes('/api/auth/login'),
  );
  await page.locator('button[type="submit"]').click();
  const tokenResponse = await tokenResponsePromise;
  expect(tokenResponse.status(), `login failed for ${username}`).toBe(200);
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
