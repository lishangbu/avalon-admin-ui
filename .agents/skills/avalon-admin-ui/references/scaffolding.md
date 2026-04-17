# 脚手架

## 适用场景

- 要快速起一个全新的 CRUD 管理页
- 想确认脚手架支持哪些参数
- 想知道生成后哪些地方必须手工收尾

## 脚本位置

- `scripts/scaffold_crud_page.py`

默认从仓库根目录运行。只有在明确要给别的项目生成页面时，才使用 `--output-root`。

## 会生成什么

针对 `src/pages/<domain>/<feature>/`，脚手架会生成：

- `index.tsx`
- `service.ts`
- `types.ts`

默认生成的页面会包含：

- 带分页的列表查询
- 带 `keyword` 和 `enabled` 的查询表单
- 页面级权限控制
- 新增、编辑、删除操作流程
- 带 `code`、`name`、`enabled`、`remark` 的基础弹窗表单
- 默认的本地权限常量

## 推荐用法

```bash
rtk python .agents/skills/avalon-admin-ui/scripts/scaffold_crud_page.py system audit-log --title 审计日志管理 --endpoint /iam/audit-logs
```

如果该功能已经在 `src/constants/permissions.ts` 里有权限分组，优先使用：

```bash
rtk python .agents/skills/avalon-admin-ui/scripts/scaffold_crud_page.py system user-profile --title 用户资料管理 --endpoint /iam/user-profiles --shared-permission-group user
```

## 重要参数

- `domain`：`src/pages` 下的一级目录
- `feature`：领域下的功能目录
- `--title`：`PageContainer` 使用的页面标题
- `--endpoint`：`service.ts` 使用的接口前缀
- `--entity-name`：可选，手动指定 PascalCase 的实体类型名
- `--subject-name`：可选，手动指定中文业务名称
- `--permission-prefix`：覆盖默认的 `<domain>:<feature>` 权限前缀
- `--shared-permission-group`：直接使用 `SYSTEM_PERMISSION_CODES.<group>`
- `--output-root`：输出到其他项目根目录
- `--force`：覆盖目标目录中已有文件

## 生成后必须做的事

- 如果真实实体字段不是 `keyword`、`code`、`name`、`enabled`、`remark`，尽快替换掉
- 如果后端 DTO 结构不匹配生成的 view 类型，在 `service.ts` 或 shared normalizer 中处理
- 如果该功能会长期存在并复用，考虑把本地权限常量提升到 `src/constants/permissions.ts`
- 把查询键、表单校验、标签文案和成功提示改成真实业务语义
- 在后端菜单里补上对应的 `component=<domain>/<feature>/index`
- 如果脚手架产物改了一轮后仍然不对，直接看 `references/troubleshooting.md`

## 不适合直接用脚手架的场景

- 页面不是标准 CRUD 管理页
- 一开始就需要多个选项查询、树选择器或复杂关联关系
- 后端接口需要很重的 normalizer，远超默认模板
- 仓库里已经有一个更贴近的现成页面，直接扩展会更自然
