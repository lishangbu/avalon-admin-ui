# 权限控制

## 核心模式

权限信息会在认证启动时一起加载，并以 `permissionCodes` 的形式挂在当前用户上。前端主要在两层使用这些权限码：

- 页面级：决定页面是否有资格显示数据
- 操作级：决定按钮、操作组或局部区域是否显示

## 关键文件

- `src/store/auth.ts`
- `src/hooks/usePermission.ts`
- `src/components/PermissionGuard.tsx`
- `src/constants/permissions.ts`

## 推荐用法

### 页面级权限

- 用 `usePermission()` 读取权限
- 如果用户缺少页面查询权限，优先渲染 `Result status="403"`
- 没有查询权限时，不要继续触发列表查询

### 操作级权限

- 按钮和操作组优先用 `PermissionGuard`
- 能复用 `src/constants/permissions.ts` 里的常量就不要散写字符串
- 只有在多个权限都能解锁同一个操作时，才考虑 `mode="any"`

## 当前常量模式

`SYSTEM_PERMISSION_CODES` 按领域和动作分组，例如：

- `system:user:query`
- `system:user:create`
- `system:user:update`
- `system:user:delete`

如果新增新的管理领域，优先继续沿用这种对象分组写法，而不是把权限字符串散在多个页面里。

## 细节提醒

- `usePermission().has(code)` 在 `code` 为空时会返回 `true`，所以不要把空值当作权限控制的替代方案
- `PermissionGuard` 同时支持 `permission` 和 `permissions` 两种输入，也支持 `all` 与 `any`
- 前端权限校验只能改善体验，最终安全边界仍在后端

## 动手前检查

- 列表查询是否被页面级查询权限正确保护
- 新增、编辑、删除等按钮是否分别按动作权限控制
- 前端权限码命名是否和后端约定一致
- 如果某个权限会被多个页面复用，是否应该先补进 `src/constants/permissions.ts`
- 没权限时，页面提示是否足够明确

## 常见错误

- 按钮虽然隐藏了，但受保护的数据仍然照常请求
- 多个文件重复硬编码同一权限字符串
- 误把前端权限控制当成真正的授权机制
- 新功能已经接了权限判断，但忘了补权限常量
