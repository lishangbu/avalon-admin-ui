---
name: playwright
description: 'Playwright end-to-end testing in Avalon Admin UI. Use when changing e2e specs, browser workflows, mock backend routes, real-backend tests, Playwright configuration, selectors, authentication setup, traces, screenshots, or smoke tests.'
---

# Playwright

## 修改前

- 从 `package.json` 与 `playwright.config.ts` 确认版本、base URL、webServer 和项目配置。
- 选择测试模式前读取 [references/test-modes.md](references/test-modes.md)。
- 先确认行为是否可由更快的 Vitest/Testing Library 覆盖；E2E 保留给跨边界用户流程。

## 项目要求

- 使用 role、label、可见文本和稳定业务属性定位；不依赖 Ant Design 私有 DOM 或脆弱 nth-child。
- 每个测试独立建立数据和认证状态，不依赖执行顺序。
- mock 模式模拟协议真实形态，包括错误与权限；不要为了让页面通过返回不可能数据。
- 真实后端模式不得静默回退到 mock；未启动后端时明确跳过或失败。
- 不使用固定 sleep；等待可见状态、响应或 URL。
- 危险写操作使用隔离数据，并在测试结束清理或使用可重建环境。
- 失败保留 trace/screenshot 等诊断产物，但不提交临时产物。

## 测试驱动

- 新主流程先写失败 E2E，再实现页面与 API 协作。
- 页面内部边界仍由组件测试覆盖，避免用大量 E2E 替代聚焦反馈。
- 修复 flaky 测试必须找到竞争条件，不只增加 timeout。

## 完成标准

- 目标 Playwright spec 在 Chromium 稳定通过。
- 完整 mock E2E 在交付前通过。
- 真实后端 E2E 仅在明确联调时要求；未运行必须报告。
- 无固定 sleep、顺序依赖、遗留临时数据或脆弱 selector。
