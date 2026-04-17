# 示例

## 适用场景

- 想把抽象规则快速落到真实实现上
- 想直接照着仓库里的成熟页面模式做
- 想理解一个新页面是怎么接到后端菜单上的
- 想知道脚手架生成后第一轮应该改什么

## 示例 1：以 `system/user` 作为标准 CRUD 基线

当一个新页面需要下面这些能力时，默认先参考 `src/pages/system/user/`：

- 分页列表
- 查询表单
- 新增或编辑弹窗
- 编辑前先拉详情
- 页面级和按钮级权限控制

### 为什么优先看它

`src/pages/system/user/index.tsx` 已经覆盖了完整闭环：

- `toSearchQuery()`：把表单值转成查询条件
- `normalizePayload()`：把表单值整理成请求体
- `SYSTEM_PERMISSION_CODES.user`：页面级和按钮级权限判断
- 稳定的 TanStack Query `queryKey`
- `openEdit()`：编辑前先拉详情
- `Result` 与 `PermissionGuard`：403 和按钮权限的标准处理

`src/pages/system/user/service.ts` 也展示了服务层该怎么写：

- 用 `endpoint` 常量集中管理接口前缀
- `getUserPage()` 里用 `compactParams()` 处理查询参数
- 用 `normalizeUser()`、`toBackendUserPayload()` 把后端 DTO 清洗到共享 normalizer 里

### 迁移时怎么改

1. 复制的是整体结构，不是具体字段
2. 把 `username`、`phone`、`email`、`avatar`、`roleIds` 换成真实业务字段
3. 如果后端 DTO 需要清洗，继续保留服务层或 shared normalizer 模式
4. 页面级查询权限和按钮级权限继续拆开处理
5. 所有服务端筛选条件都要进入 `queryKey`

### 说明你改对方向的信号

- 页面仍然沿用 `PageContainer`、TanStack Query 和 `PermissionGuard`
- 表单模型、服务函数和成功提示已经换成真实业务语言
- 页面里不再残留 `user`、`username` 之类无关字段

## 示例 2：让一个新页面通过后端菜单接入路由

假设你新增了：

```text
src/pages/system/audit-log/index.tsx
```

### 前端这边的契约

- 页面文件必须是 `src/pages/**/index.tsx`
- `src/router/page-loader.tsx` 只会发现这种入口
- 这个页面会被规范成 `system/audit-log/index`

### 后端菜单应该怎么配

菜单 `component` 应该写成：

```text
system/audit-log/index
```

如果它挂在 `/system` 父菜单下，子路径可以写：

```text
audit-log
```

如果希望直接指定绝对路径，也可以写：

```text
/system/audit-log
```

### 前端收到菜单后会发生什么

1. 认证启动拿到 `menuTree`
2. `transformMenuTree()` 会处理父子路径拼接、过滤 `button` 与禁用项，并生成路由元数据
3. `AppRouter` 会把这些路由拍平并尝试解析 `component`
4. `resolvePageComponent()` 找到页面就正常渲染，找不到就回退到 404

### 如果这里不工作，先查什么

- 页面文件是不是 `src/pages/system/audit-log/index.tsx`
- 后端 `component` 是否精确等于 `system/audit-log/index`
- 菜单是否被标记成 `external`
- 菜单类型是否被设成了 `button`

如果这些都没问题但仍然异常，再看 `references/troubleshooting.md`。

## 示例 3：先跑脚手架，再把结果收敛到真实页面

当仓库里没有更接近的现成页面可直接扩展时，可以先跑：

```bash
rtk python .agents/skills/avalon-admin-ui/scripts/scaffold_crud_page.py system audit-log --title 审计日志管理 --endpoint /iam/audit-logs
```

如果该功能已经有共享权限常量，优先用：

```bash
rtk python .agents/skills/avalon-admin-ui/scripts/scaffold_crud_page.py system user-profile --title 用户资料管理 --endpoint /iam/user-profiles --shared-permission-group user
```

### 脚手架会给你什么

- `index.tsx`
- `service.ts`
- `types.ts`
- 默认查询字段
- 默认弹窗表单
- 默认权限策略
- 默认查询键和增删改流程

### 生成后第一轮必须改什么

1. 把 `keyword`、`code`、`name`、`enabled`、`remark` 换成真实字段
2. 决定页面继续使用本地 `permissionCodes`，还是切到 `SYSTEM_PERMISSION_CODES`
3. 如果后端 DTO 不匹配生成的 view 类型，在 `service.ts` 或 shared normalizer 里处理
4. 把标签、提示、校验文案改成真实业务语义
5. 给后端菜单补上 `<domain>/<feature>/index` 形式的 `component`

### 什么时候不要再死守脚手架结果

一旦页面开始需要下面这些能力，就不要强撑着沿用通用模板：

- 多个选项查询
- 树选择器
- 关联标签展示
- shared DTO normalizer
- 非标准的提交或刷新流程

这时更好的做法是转去参考更贴近的真实页面，比如 `system/user` 或 `system/role`。
