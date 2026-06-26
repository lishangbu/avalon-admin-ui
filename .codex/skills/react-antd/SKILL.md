---
name: react-antd
description: 'Use when implementing or reviewing Avalon Admin UI React pages, routing, layout, Ant Design components, ProComponents tables/forms, theme tokens, and frontend tests.'
---

# React 与 Ant Design 页面约束

## 范围

适用于 `avalon-admin-ui` 的 React、Ant Design 6、ProComponents、路由、布局、页面和测试。

## 组件规则

- 修改 antd 或 ProComponents 代码前，先查询组件 API，例如 `antd info Button --format json`。
- 页面以管理工具体验为主，保持信息密度、可扫描性和稳定布局。
- 表格使用稳定 `rowKey`，远程分页、筛选和搜索由 service 层请求后端，不做本地假筛选。
- 危险操作使用 `Popconfirm`，详情使用 Drawer，创建和编辑使用 Modal/Form。
- 复用 `src/shared/components` 中的错误、权限、状态和详情组件。

## 样式规则

- 优先使用 Ant Design tokens、组件 props 和局部 class。
- 不依赖内部 `.ant-*` DOM 选择器。
- 不做营销式首页；登录页保持紧凑、直接、可操作。
- 文案使用中文，字段名和接口契约保持英文。

## 测试

- 页面测试用 Testing Library，mock service 层。
- 验证页面标题、主要按钮、筛选项、错误和权限状态。
- 修改页面后至少运行相关页面测试，并在可行时运行 `npm run typecheck`。
