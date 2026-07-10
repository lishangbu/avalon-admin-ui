# Avalon Admin UI Agent 指南

## 仓库边界

- 本仓库是独立 Git 仓库 `avalon-admin-ui`；后端位于独立仓库 `avalon`。
- 只修改用户要求范围内的前端文件；不要跨仓库暂存、提交或改写历史。
- 用户未明确要求时，不执行 commit 或 push。

## 领域语言与决定

- 领域页面、API 语义或 Identifier 变化前读取 `CONTEXT.md`。
- 遇到难以逆转或不明显的既有决定时读取 `docs/adr/`。
- 新术语即时写入 `CONTEXT.md`；它只保存领域语言，不保存实现细节。
- 只有难以逆转、代码中不明显且存在真实取舍的决定才新增 ADR。

## 技术栈路由

| 变更内容                                       | 必读 skill                                        |
| ---------------------------------------------- | ------------------------------------------------- |
| TypeScript 类型、nullability、Identifier       | `.codex/skills/typescript/SKILL.md`               |
| React 组件、Hooks、Provider、状态              | `.codex/skills/react/SKILL.md`                    |
| React Router、导航、路由守卫                   | `.codex/skills/react-router/SKILL.md`             |
| Ant Design、ProComponents、表格、表单          | `.codex/skills/ant-design-procomponents/SKILL.md` |
| Tailwind、全局 CSS、响应式布局                 | `.codex/skills/tailwind-css/SKILL.md`             |
| TanStack Query、缓存、mutation                 | `.codex/skills/tanstack-query/SKILL.md`           |
| OpenAPI、生成类型、openapi-fetch、认证/session | `.codex/skills/openapi-typescript-fetch/SKILL.md` |
| Vitest、Testing Library、组件测试、TDD         | `.codex/skills/vitest-testing-library/SKILL.md`   |
| Playwright、E2E、浏览器流程                    | `.codex/skills/playwright/SKILL.md`               |
| npm、Vite、ESLint、Prettier、Husky             | `.codex/skills/frontend-tooling/SKILL.md`         |
| Git、暂存、提交、签名                          | `.codex/skills/git/SKILL.md`                      |

命中多个技术栈时全部读取。遇到“继续”或“下一步”，先检查当前对话、计划和 diff，再加载实际命中的 skills；不使用独立 router。

## 跨栈政策

- 版本事实来自 `package.json`、lockfile 和本地类型；不顺手升级。
- 新行为与缺陷修复遵循 red-green-refactor；重构先补 characterization test。
- 源码注释和用户可见文案使用中文；标识符、API 字段和 permission code 保持英文。
- 后端 OpenAPI 是唯一契约权威；生成类型禁止手改，Identifier 始终作为字符串。
- Ant Design 负责组件语义与 token，Tailwind 主要负责布局和响应式，不依赖内部 `.ant-*` DOM。
- 验证按风险分层；跨栈、工具链或完成交付前运行 `npm run verify`。

## 完成前

- 确认所有命中 skills 的 completion criteria 已满足。
- 运行聚焦测试、typecheck、lint，并按风险运行 build 与 Playwright。
- 运行 `git diff --check`，保留用户无关改动。
- Docker、浏览器或真实后端不可用时，报告具体命令和未验证范围。
