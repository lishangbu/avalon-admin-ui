# AGENTS.md

## Instructions

- 如果当前环境提供 `rtk`，优先用 `rtk` 包装 shell 命令
- 全程优先使用中文沟通；新增注释和项目内说明优先使用中文，专有名词保留英文

使用项目内技能：

- `./.agents/skills/avalon-admin-ui`

详细项目约束以：

- `./.agents/skills/avalon-admin-ui/references/architecture.md`

为准。`AGENTS.md` 只保留仓库级入口规则，不重复展开完整细则。

## 核心目标

- 优先交付结构清晰、便于持续扩展的管理后台实现
- 优先复用现有 CRUD、路由、权限、请求和状态管理模式
- 避免在页面层重复写 DTO 转换、菜单解析和权限字符串

## 最小硬约束

- 先理解现有实现，再改动
- 页面默认放在 `src/pages/<domain>/<feature>/`
- 菜单路由遵循后端驱动模型，不额外发明第二套路由系统
- 权限控制优先复用 `usePermission`、`PermissionGuard` 和既有常量
- 共享请求逻辑优先走 `src/shared/api/http.ts` 和 `src/utils/request.ts`

## 默认工作方式

- 先复用，再扩展，再新增
- 只读取当前任务相关的 reference 文件
- 改动后执行与范围匹配的最小验证，并明确说明结果
