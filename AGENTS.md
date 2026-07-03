# Avalon Admin UI Agent 指南

## 仓库边界

- 本仓库是 Avalon 管理端前端仓库。
- 后端在独立仓库 `avalon`。
- 没有用户明确要求时，不执行 `git commit`。
- 不要跨仓库混合提交前端和后端改动。

## 必读技能

在本仓库执行前端实现、评审、计划延续或提交前，按任务读取：

| 任务类型                            | 必读技能                                 |
| ----------------------------------- | ---------------------------------------- |
| React、Ant Design、页面、路由、样式 | `.codex/skills/react-antd/SKILL.md`      |
| OpenAPI、请求层、认证、权限         | `.codex/skills/api-auth/SKILL.md`        |
| 源码注释、用户可见文案              | `.codex/skills/source-comments/SKILL.md` |
| 提交说明或实际提交                  | `.codex/skills/commit/SKILL.md`          |

## 技术边界

- 使用 React Router、TanStack Query、antd 6 和 ProComponents。
- 组件 API 以官方文档或本地 `@ant-design/cli` 查询结果为准。
- 样式优先使用 Ant Design tokens、组件 props 和局部 CSS；不要依赖内部 `.ant-*` DOM 结构。
- 系统 API 类型来自 `src/services/generated/schema.d.ts`。
- 前端权限只用于菜单、路由和按钮体验；最终授权由后端强制执行。

## 验证命令

从仓库根目录运行：

```bash
npm run verify
```

如果使用 WSL 且系统 PATH 指向 Windows 版 Node，请先使用 WSL 原生 Node：

```bash
export PATH=/tmp/codex-node-v24.14.1/bin:$PATH
```
