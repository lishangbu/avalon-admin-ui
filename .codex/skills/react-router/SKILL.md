---
name: react-router
description: 'React Router work in Avalon Admin UI. Use when changing route definitions, nested layouts, navigation, redirects, protected routes, route parameters, not-found behavior, menu-to-route mappings, or router tests.'
---

# React Router

## 修改前

- 从 `package.json` 确认 React Router 版本，检查 `src/app/router.tsx`、布局、菜单和权限组件。
- 涉及认证或 API session 时同时加载 `openapi-typescript-fetch`；涉及页面组件时加载 `react`。

## 项目要求

- 路由定义保持单一权威来源；不要在页面中拼接散落的路径字符串。
- 使用嵌套路由表达布局归属，保持稳定且可分享的 URL。
- 受保护路由在渲染页面前处理登录态；权限体验使用 session 中的稳定 permission/access code。
- 前端路由守卫只改善体验，不能替代后端授权。
- route params 视为未经校验的字符串；Identifier 不转成 number。
- 菜单、路由和可访问资源必须同步；删除资源时不得留下孤立入口。
- 重定向保留合理来源位置，避免登录后循环；未知路径进入明确 404。
- 导航使用 Router API，不直接操纵 `window.location`，除非执行外部协议跳转。

## 测试驱动

- 新路由先写 router test，覆盖已登录、未登录、无权限和未知路径。
- 参数路由覆盖合法 Identifier、缺失参数与不存在资源。
- 菜单变化使用精确集合测试防止入口漂移。

## 完成标准

- router 与菜单测试通过，typecheck 通过。
- 每个可导航页面存在唯一稳定路径，权限要求明确。
- 无重定向循环、孤立菜单或数字化 Identifier。
- 导航主流程变化运行 menu smoke Playwright。
