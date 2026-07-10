---
name: typescript
description: 'TypeScript development in Avalon Admin UI. Use when creating, changing, reviewing, or testing .ts or .tsx types, interfaces, generics, nullability, identifiers, type guards, generated API types, utility functions, or TypeScript compiler behavior.'
---

# TypeScript

## 修改前

- 从 `package.json`、lockfile 与 `tsconfig.app.json` 确认 TypeScript 版本和严格选项。
- API 类型变化同时加载 `openapi-typescript-fetch`；React 组件类型同时加载 `react`。
- 领域术语或 Identifier 语义变化先读 `CONTEXT.md` 与相关 ADR。

## 项目要求

- 保持 strict 类型边界；不用 `any`、双重断言或宽泛 `Record<string, unknown>` 绕开已知契约。
- 优先从生成 OpenAPI 类型推导请求和响应，不重复手写后端 DTO。
- Identifier 始终作为不透明字符串处理；不使用 `Number(id)`、算术、数值排序或精度不安全转换。
- 用 `null`、`undefined` 与可选属性准确表达契约差异，不用空字符串或魔法数字表示缺失。
- 外部数据进入应用边界时先收窄；只在运行时确实需要时编写 type guard。
- 使用 discriminated union 表达有限状态；不要用多个布尔值制造不可达组合。
- 保持公共函数输入输出明确；避免通过全局声明或隐式模块扩展隐藏依赖。
- 注释使用中文，标识符保持英文；只解释类型无法表达的协议或边界。

## 测试驱动

- 新转换、校验和状态行为先写失败测试。
- 纯类型变更先获得 `typecheck` 失败或类型测试证据，再修复调用点。
- 重构先锁定运行时输出与关键编译边界。

## 完成标准

- 聚焦 Vitest 通过，`npm run typecheck` 通过。
- 没有新增 `any`、未解释断言、Identifier 数值化或重复 DTO。
- 生成类型的 nullability 与调用点处理一致。
- 跨页面公共类型变更运行相关页面测试和完整 lint。
