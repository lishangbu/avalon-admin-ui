---
name: api-auth
description: 'Use when working on Avalon Admin UI OpenAPI generated types, request client, password grant login, session loading, token storage, and RBAC permission experience.'
---

# API、认证与权限约束

## API 契约

- OpenAPI 源为 `http://localhost:8080/v3/api-docs/system`。
- 生成文件位于 `src/services/generated/openapi.json` 和 `src/services/generated/schema.d.ts`。
- 业务 service 优先从生成类型推导请求和响应，不重复手写 DTO。
- 请求错误统一转换为 `ApiError`，页面通过共享错误组件展示。

## 认证

- 登录使用后端自定义 password grant。
- token endpoint 为 `/oauth2/token`，client 使用 HTTP Basic。
- access token 只保存在 `sessionStorage`。
- 401 或 session 加载失败时清理 token，并回到登录态。

## 权限

- 当前用户、角色、访问节点和菜单来自 `GET /api/session`。
- 前端权限只控制交互体验，不替代后端授权。
- 路由、菜单和按钮权限使用 `src/shared/permissions.ts`。

## 验证

修改认证或请求层后运行：

```bash
npm test -- src/app/auth src/services src/shared/api src/shared/permissions.test.ts
npm run typecheck
```
