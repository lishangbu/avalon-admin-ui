---
name: ant-design-procomponents
description: 'Ant Design 6 and ProComponents work in Avalon Admin UI. Use when changing antd components, ProTable, ProForm, Modal, Drawer, Form, theme tokens, table columns, pagination, filters, destructive actions, or Ant Design page tests.'
---

# Ant Design 与 ProComponents

## 修改前

- 从 `package.json` 确认 antd 与 ProComponents 版本。
- 修改不熟悉或版本敏感的组件 API 时读取 [references/component-api.md](references/component-api.md)。
- 同时检查现有共享组件、页面测试和 TanStack Query/service 边界。

## 项目要求

- 页面以管理工具为目标，保持高信息密度、可扫描结构和稳定布局。
- 表格使用稳定字符串 `rowKey`；远程分页、搜索和筛选交给 service/后端，不做本地假筛选。
- 创建和编辑使用 Form 与 Modal/Drawer 的明确生命周期；关闭或成功后正确 reset。
- 危险操作使用 `Popconfirm` 或等价二次确认，并在 mutation pending 时防止重复提交。
- 优先使用 Ant Design token、组件 props 和局部 class；不依赖内部 `.ant-*` DOM。
- 复用 `src/shared/components` 中的错误、权限、状态与详情能力。
- 字段 label 与用户文案使用中文，API 字段名保持英文。
- 表单校验与后端约束一致，但后端仍是最终校验权威。

## 测试驱动

- 先用 Testing Library 覆盖标题、主操作、表单校验、确认、错误和权限状态。
- 远程表格测试断言发送给 service 的分页/筛选参数，而非内部 DOM 结构。
- 组件升级或 API 调整先建立能暴露不兼容的测试或 typecheck 失败。

## 完成标准

- 聚焦页面测试、typecheck 和 lint 通过。
- 无不稳定 rowKey、本地假分页、内部 antd selector 或重复提交。
- loading、empty、error、forbidden 与成功反馈可观察。
- 关键 CRUD 流程变化运行对应 Playwright 用例。
