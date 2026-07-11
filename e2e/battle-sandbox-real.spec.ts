import { expect, test, type Page } from '@playwright/test';

test.skip(
  process.env.AVALON_E2E_REAL_BACKEND !== '1',
  '设置 AVALON_E2E_REAL_BACKEND=1 后连接本机真实后端运行。',
);

test('真实后端可以结算、保存并校验战斗沙盒复盘', async ({ page }) => {
  const browserIssues = collectBrowserIssues(page);
  const replayTitle = `真实后端复盘 ${Date.now()}`;

  await login(page);
  await page.goto('/battle-sandbox');

  await expect(page.getByRole('heading', { name: '战斗沙盒' })).toBeVisible();
  await page.getByRole('button', { name: '结算回合' }).click();

  await expect(page.getByRole('heading', { name: '已结算回合' })).toBeVisible();
  await page.getByLabel('复盘标题').fill(replayTitle);
  await expect(page.getByRole('button', { name: '保存当前' })).toBeEnabled();
  const createReplayResponsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' &&
      response.url().includes('/api/battle-sandbox/replays') &&
      !response.url().endsWith('/validation'),
  );
  await page.getByRole('button', { name: '保存当前' }).click();
  const createReplayResponse = await createReplayResponsePromise;
  expect(createReplayResponse.ok(), await createReplayResponse.text()).toBeTruthy();

  await page.getByLabel('搜索复盘').fill(replayTitle);
  await page.getByRole('button', { name: 'Search' }).click();
  const replayRow = page.getByRole('row').filter({ hasText: replayTitle });
  await expect(replayRow).toBeVisible();
  const validationResponsePromise = page.waitForResponse(
    (response) => response.request().method() === 'POST' && response.url().endsWith('/validation'),
  );
  await replayRow.getByRole('button', { name: /校验/ }).click();
  const validationResponse = await validationResponsePromise;
  expect(validationResponse.ok(), await validationResponse.text()).toBeTruthy();
  await expect(page.locator('main').getByText('复盘校验通过').first()).toBeVisible();
  await expect(page.locator('main').getByText('确定性重放：已匹配')).toBeVisible();

  await replayRow.getByRole('button', { name: '删除' }).click();
  await page.getByRole('button', { name: /确\s*定/ }).click();
  await expect(replayRow).toHaveCount(0);
  expect(browserIssues()).toEqual([]);
});

async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel('用户名').fill(process.env.AVALON_E2E_USERNAME ?? 'admin');
  await page.getByLabel('密码').fill(process.env.AVALON_E2E_PASSWORD ?? '123456');
  await page.locator('button[type="submit"]').click();
  await expect(page.getByRole('heading', { name: '工作台' })).toBeVisible();
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
