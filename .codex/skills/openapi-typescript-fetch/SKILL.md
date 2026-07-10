---
name: openapi-typescript-fetch
description: 'OpenAPI client work in Avalon Admin UI. Use when changing generated openapi.json or schema.d.ts, openapi-typescript, openapi-fetch, API services, request or response types, identifiers, authentication headers, token storage, sessions, 401 handling, or backend contract synchronization.'
---

# OpenAPI TypeScript 与 Fetch

## 修改前

- 先读 `CONTEXT.md`、`docs/adr/0001-backend-openapi-authority.md` 和后端交付的契约变化。
- 同步契约时读取 [references/contract-sync.md](references/contract-sync.md)。
- 修改登录、token、session 或 401 时读取 [references/auth-session.md](references/auth-session.md)。

## 项目要求

- 后端 admin OpenAPI 是唯一契约权威；`openapi.json` 与 `schema.d.ts` 是提交到前端仓库的 Contract Snapshot。
- 禁止手工修改生成的 `schema.d.ts`；业务 service 从生成路径与 components 类型推导。
- 不重复声明后端 DTO，不用断言掩盖 schema 的 required/nullability 错误。
- Identifier 作为字符串贯穿路径、请求、响应、表单和 query key；只在后端要求数值 JSON 时转换普通数值。
- 底层 `openapi-fetch` client 集中处理 base URL、headers、错误转换和认证，不在页面散落 fetch。
- API 错误统一转换成稳定 `ApiError`；不得向用户暴露 token、secret、SQL 或内部栈。
- access token 只存 `sessionStorage`；401 或 session 失败清理 token 并回到登录态。
- 前端权限只控制菜单、路由和按钮体验，不能替代后端授权。

## 测试驱动

- 契约变化先让 `openapi:check`、typecheck 或 service 测试暴露漂移。
- client 变化覆盖成功、结构化错误、401、网络失败和无响应体。
- Identifier 变化覆盖大于 JavaScript 安全整数的字符串。

## 完成标准

- `npm run openapi:check`、`npm run typecheck` 与相关 service 测试通过。
- 生成文件可由脚本复现，且没有手写 DTO 漂移。
- token 与错误信息不泄漏，401/session 行为有测试。
- 后端和前端分别验证、分别提交。
