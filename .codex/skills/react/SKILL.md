---
name: react
description: 'React development in Avalon Admin UI. Use when changing components, hooks, providers, contexts, local state, effects, rendering, forms outside library-specific APIs, component composition, error boundaries, or React component tests.'
---

# React

## 修改前

- 从 `package.json` 确认 React 版本，并阅读目标组件、调用方和现有测试。
- 涉及路由、服务端状态、Ant Design 或 TypeScript 边界时同时加载对应 skill。
- 用户可见领域行为变化先读 `CONTEXT.md`。

## 项目要求

- 使用函数组件和 Hooks；Hooks 只在顶层调用，依赖数组反映真实依赖。
- 服务端状态交给 TanStack Query；本地状态只保存视图交互，不复制查询数据。
- 状态放在最小拥有者；只有跨树共享且稳定的能力才使用 Provider/Context。
- effect 只同步外部系统，不用 effect 派生可在 render 中计算的值。
- 不为微小计算滥用 `useMemo`、`useCallback`；只有身份稳定具有可证明价值时使用。
- 明确呈现 loading、empty、error、forbidden 和 success 状态。
- 组件保持可组合；复杂业务转换移到具名函数或 service，不藏在 JSX 和事件回调中。
- 用户文案使用中文；交互元素提供可访问名称和键盘行为。

## 测试驱动

- 先用 Testing Library 写用户可观察失败用例。
- 覆盖主要交互、错误、权限和异步状态，不断言内部 hook 调用次数。
- 重构组件前保留行为测试，避免 snapshot 代替关键断言。

## 完成标准

- 聚焦组件测试、typecheck 与 lint 通过。
- 没有重复服务端状态、无依赖错误的 effect 或 render 中副作用。
- 新交互可由角色、标签或可见文本访问。
- 路由或端到端行为变化按风险运行 Playwright。
