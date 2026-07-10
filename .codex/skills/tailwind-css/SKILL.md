---
name: tailwind-css
description: 'Tailwind CSS work in Avalon Admin UI. Use when changing Tailwind utilities, global CSS layers, @tailwindcss/vite, responsive layout classes, spacing, typography, Iconify Tailwind integration, or styling boundaries with Ant Design.'
---

# Tailwind CSS

## 修改前

- 从 `package.json`、`vite.config.ts` 和 `src/styles/global.css` 确认 Tailwind v4 接入方式。
- 涉及 Ant Design 组件外观时同时加载 `ant-design-procomponents`。
- 先检查现有 class 与全局样式，避免建立第二套同义设计规则。

## 项目要求

- Tailwind 主要用于页面布局、间距、响应式和轻量包装；Ant Design 组件外观优先使用 token 与 props。
- 保持 `theme`、`utilities` layer 与 Vite plugin 的现有顺序。
- 不使用 `!important` 或内部 `.ant-*` selector 压制组件样式。
- 不拼接 Tailwind class 片段；动态样式使用完整可发现 class 或显式映射。
- 重复组合抽成语义清晰的 React 组件或局部 class，不创建庞大通用 CSS。
- Iconify class 使用项目已安装集合，图标同时具备可访问文本或 `aria-hidden`。
- 全局 CSS 只保留 reset、根布局和真正跨页面规则。

## 测试驱动与验证

- 行为相关响应式变化先用组件或 Playwright 用例锁定可见结果。
- 纯样式变化不强造单元测试，但必须运行 build 以验证 class 扫描和 CSS 生成。
- 检查常用窄屏和桌面布局，不只验证单一视口。

## 完成标准

- `npm run build:bundle` 与 lint 通过。
- 无动态丢失 class、无 Ant Design 内部 selector、无无理由全局覆盖。
- 新布局在目标视口无溢出、遮挡或不可操作控件。
- class 改动只包含本轮需要的样式。
