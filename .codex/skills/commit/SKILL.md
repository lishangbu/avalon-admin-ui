---
name: commit
description: 'Use when creating, reviewing, generating, or executing Git commit messages in the avalon-admin-ui repository.'
---

# 前端提交

## 原则

- 没有用户明确允许，不执行 `git commit`。
- 一个提交只表达一个主要意图。
- 不使用 `git add .`，只暂存本轮相关文件。
- 不混合后端仓库改动。

## 格式

使用 Conventional Commits：

```text
<type>[optional scope]: <summary>
```

常用 type：

- `feat`
- `fix`
- `refactor`
- `test`
- `docs`
- `build`
- `chore`

summary 使用中文动宾短语，不以句号结尾。

## 提交前验证

提交前至少运行：

```bash
git status --short
git diff --check
```

并运行与改动匹配的验证命令。
