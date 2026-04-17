---
name: avalon-admin-ui
description: 在 Avalon Admin UI 的 React/Vite/Ant Design 前端仓库中进行功能开发、重构与审查。适用于处理 `src/pages/**` 下的 CRUD 页面、后端驱动菜单路由、权限控制界面、Zustand 认证与菜单状态、TanStack Query 数据流，以及本仓库特有的请求与 normalizer 约定。
---

# Avalon Admin UI

## 概览

这个技能用于在 `avalon-admin-ui` 仓库内开展前端功能工作。先遵守仓库里的 `AGENTS.md`，再按任务类型只读取必要的 reference，不要把整套文档一次性都塞进上下文。

## 快速开始

1. 先读取仓库根目录 `AGENTS.md`，并保持 `rtk` 命令约束有效。
2. 先判断当前任务主要落在哪一层：页面、服务、菜单路由、权限、共享架构或排障。
3. 只读取当前最相关的 reference：
   - `references/quick-checklist.md`：动手前先做一次 30 秒自检
   - `references/crud-page.md`：新增或调整常规 CRUD 页面
   - `references/menu-routing.md`：处理后端驱动菜单、路由树和 `component` 键
   - `references/permissions.md`：处理 `usePermission`、`PermissionGuard` 和权限常量
   - `references/architecture.md`：查看状态边界、请求封装、normalizer 和启动流程
   - `references/scaffolding.md`：准备运行脚手架生成新 CRUD 页面
   - `references/examples.md`：参考仓库内真实实现模式
   - `references/troubleshooting.md`：页面、菜单、权限或脚手架结果不符合预期时排障
4. 先匹配已有模式，再决定是否需要扩展抽象。
5. 代码改动后做与范围匹配的最小验证。

## 工作流

### CRUD 与页面开发

- 页面默认放在 `src/pages/<domain>/<feature>/`
- 优先使用 `index.tsx` 作为页面入口，`service.ts` 处理接口，`types.ts` 只在页面确实需要本地类型时创建
- 继续沿用仓库里已有的 `PageContainer`、Ant Design 和 TanStack Query 模式
- 后端请求参数整形、返回值清洗和 DTO 转换优先放在服务层或 shared normalizer，不要直接堆在 JSX 里
- 如果是从零开始的新管理页，优先考虑 `scripts/scaffold_crud_page.py`，再根据真实字段、权限和接口映射做收尾

### 菜单与路由

- 主导航默认是后端驱动，不要再发明第二套路由系统
- 后端菜单里的 `component` 必须和 `src/pages/**/index.tsx` 的标准键保持一致
- 不要添加 `page-loader` 无法解析的页面入口
- 外链、重定向、隐藏菜单、标签页行为都应继续遵守已有菜单元数据模型

### 权限控制

- 能复用权限常量时，优先复用，不要在多个页面散落字符串字面量
- 页面级查询权限和按钮级权限分开处理
- 前端隐藏按钮只是体验优化，不是最终的安全边界；后端授权仍然是准绳

## 护栏

- 没有明确理由时，不要绕过 `src/shared/api/http.ts` 和 `src/utils/request.ts`
- 后端 DTO 的兼容处理优先收敛到 normalizer，而不是扩散到页面里
- 不要在 `transformMenuTree`、`resolvePageComponent` 和现有认证启动流程之外再造一套菜单路由逻辑
- 不要假设新的权限常量已经存在；如果需要复用全局常量，就先确认 `src/constants/permissions.ts`
- 单页需求优先扩展现有模式，不要为了一个页面提前造过度通用的抽象

## References

- `references/architecture.md`
- `references/quick-checklist.md`
- `references/crud-page.md`
- `references/menu-routing.md`
- `references/permissions.md`
- `references/scaffolding.md`
- `references/examples.md`
- `references/troubleshooting.md`
