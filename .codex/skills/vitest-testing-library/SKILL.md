---
name: vitest-testing-library
description: 'Frontend unit and component testing in Avalon Admin UI with Vitest, Testing Library, jest-dom, and user-event. Use when adding or changing tests, mocks, jsdom setup, render helpers, fake timers, assertions, coverage of components or services, or applying TDD to frontend behavior.'
---

# Vitest 与 Testing Library

## 测试驱动循环

1. 先写最小失败用例，确认失败来自目标行为缺失。
2. 实现最少代码使测试通过。
3. 全绿后重构，并补充关键错误与权限边界。
4. 按涉及技术栈运行 typecheck、lint 或 E2E。

## 项目要求

- 组件测试从用户可见行为出发，优先 role、label、text 和 user-event。
- 不断言 React 内部结构、hook 调用次数、Ant Design 私有 DOM 或 CSS 实现细节。
- 页面测试 mock service 边界；需要验证 URL/请求组装时 mock 底层 openapi-fetch。
- 每个测试获得独立 QueryClient、router、store 与 DOM；不得泄漏缓存或 mock。
- 异步断言使用 `findBy*`、`waitFor` 或明确 promise，不使用任意 timeout。
- fake timer、spy 与全局 mock 在测试后恢复。
- 覆盖 loading、empty、error、forbidden、成功和重复操作边界。
- snapshot 只辅助稳定结构，不替代关键行为断言。

## 风险分层

- 工具函数/service：聚焦 Vitest。
- 组件/页面：Testing Library + typecheck。
- 路由、权限、缓存：相关页面集合测试。
- 用户主流程：再运行 Playwright。

## 完成标准

- 红灯与绿灯命令可复述。
- 测试单独运行和全套运行都稳定。
- `npm test`、相关 typecheck/lint 按风险通过。
- 不通过跳过、放宽断言或过度 mock 隐藏缺陷。
