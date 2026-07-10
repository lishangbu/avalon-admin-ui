---
name: frontend-tooling
description: 'Frontend tooling work in Avalon Admin UI. Use when changing package.json, package-lock.json, npm scripts, Vite configuration, environment variables, development proxy, ESLint, Prettier, Tailwind Vite integration, Husky, lint-staged, Node versions, builds, or dependency upgrades.'
---

# 前端工程化

## 修改前

- 从 `package.json`、lockfile、Vite/ESLint 配置和 hooks 确认 Node、npm 与工具版本。
- 使用项目本地二进制和 npm scripts；不要依赖全局安装。
- 先运行能复现现有问题的最小 script，区分环境失败与代码失败。

## 项目要求

- `package.json` 与 `package-lock.json` 通过 npm 同步；不手工拼改 lockfile。
- 遵守 engines 中的 Node/npm 范围；不顺手升级依赖或重写整个 lockfile。
- Vite proxy 集中维护后端路径；页面和 service 不硬编码开发服务器地址。
- 只有 `VITE_*` 变量可进入浏览器，并且不得包含 secret。
- ESLint 负责代码问题，Prettier 负责格式；不要用互相冲突的规则重复处理。
- Husky/lint-staged 只处理 staged 文件，不在 hook 中产生无关全仓改动。
- Tailwind plugin、React plugin 与测试配置保持单一 Vite 入口。
- 新增 script 使用可组合名称，并复用既有 typecheck、lint、test、build 和 E2E scripts。

## 变更验证

- 配置变更先运行对应单项 script。
- 依赖、Vite 或全局 lint 配置变化运行 `npm run verify`。
- hook 环境缺少 `npx` 等命令时，先修复可解析性或手动运行等价验证；不得把环境失败伪装成代码通过。

## 完成标准

- `npm run openapi:check`、typecheck、lint、test 和 build 按风险通过。
- 完整交付运行 `npm run verify`；真实后端 E2E 按任务范围另行报告。
- lockfile 只反映授权依赖变化。
- 构建产物和临时测试目录不进入提交。
