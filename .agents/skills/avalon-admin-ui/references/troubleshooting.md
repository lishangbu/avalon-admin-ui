# 排障

## 适用场景

- 后端已经有菜单，但前端菜单不显示
- 页面地址存在，但最终落到 404
- 页面或按钮因为权限判断没有显示
- CRUD 列表不查询、不刷新或更新后不回显
- 脚手架生成的页面能编译，但行为仍然不对

## 快速判断

1. 先确认症状属于哪一类：路由、菜单、权限、数据还是脚手架收尾问题
2. 只检查最相关的几份文件，不要一开始全盘乱搜
3. 先判断问题出在前端约定、后端返回，还是两边契约不一致
4. 先修边界契约，再修页面表现

## 页面落到 404

### 表现

- 地址能打开，但渲染的是 404 页面
- 菜单项存在，点击后却跳到 404

### 检查顺序

1. 确认页面文件是 `src/pages/<domain>/<feature>/index.tsx`
2. 确认后端菜单 `component` 精确匹配 `<domain>/<feature>/index`
3. 查看 `src/router/page-loader.tsx`，确认它只会识别 `src/pages/**/index.tsx`
4. 查看 `src/router/AppRouter.tsx`，确认该节点没有因为外链或缺失 `component` 被跳过
5. 确认后端菜单不是重定向或外链节点

### 常见原因

- 后端 `component` 写错或漏了 `/index`
- 页面文件不是 `index.tsx`
- 菜单节点被标记成了 `external`
- 菜单类型或元数据让它无法生成普通页面路由

## 后端有菜单，但侧边栏不显示

### 表现

- 当前用户响应里已经有菜单数据，但侧边栏没有这一项
- 页面能直达，但菜单树看起来不对

### 检查顺序

1. 确认节点不是 `disabled`
2. 确认节点类型不是 `button`
3. 查看 `hidden`、`hideChildrenInMenu`、`flatMenu`、`activeMenu` 的影响
4. 确认当前用户拿到的 `menuTree` 里真的包含这一项
5. 确认认证启动流程已经跑完，`useMenuStore.setTree()` 已经执行

### 常见原因

- 后端把节点类型返回成了 `button`
- 后端新增了菜单元数据，但前端没映射到 `AppRouteMeta`
- 父子路径拼接后最终 URL 和预期不同
- 该菜单本来就是隐藏节点，只用于路由激活

## 按钮不显示或整页 403

### 表现

- 页面直接显示 403 结果
- 新增、编辑、删除按钮缺失

### 检查顺序

1. 确认页面检查的是正确的权限码
2. 确认当前用户的 `permissionCodes` 里真的有这个权限
3. 如果页面来自脚手架，确认默认本地权限前缀和后端命名一致
4. 如果应该复用共享常量，确认 `SYSTEM_PERMISSION_CODES.<group>` 已存在且组名正确
5. 确认查询 hook 使用了 `enabled: canQuery`，不是被错误地静默关掉

### 常见原因

- 前端权限字符串和后端约定不一致
- 脚手架生成的默认权限前缀没有替换
- 期望复用共享权限常量，但 `src/constants/permissions.ts` 里还没补
- 前端按钮确实被权限挡住，而后端也顺带没有下发对应菜单

## 列表不查询或刷新异常

### 表现

- 接口没问题，但表格一直空着
- 改了查询条件，表格结果不变
- 新增或更新成功后，列表没有刷新

### 检查顺序

1. 确认 `enabled: canQuery` 且 `canQuery=true`
2. 确认所有影响服务端结果的筛选条件都进入了 `queryKey`
3. 确认本地的 `query`、`page`、`pageSize` 确实被更新
4. 确认刷新入口统一走了 `loadRows()`、`refetch()` 或 `ensureQueryData()`
5. 确认后端返回结构真的符合 `Page<T>`，并且需要的 normalizer 已经接上

### 常见原因

- 改了筛选条件，但 `queryKey` 没跟着变
- 只重置了表单，没有重置实际查询状态
- DTO 需要先做 normalizer，否则页面拿到的数据不完整
- 新增或更新成功后没有显式刷新列表

## 数据形状不对

### 表现

- 某些地方 id 是数字，某些地方又当字符串用
- 表格列大量显示 `-`
- 编辑弹窗回填字段不完整

### 检查顺序

1. 对比后端响应和本地 `View` 类型
2. 先判断这个差异应该在页面里处理，还是在 normalizer 里处理
3. 可复用或明显属于后端兼容的差异，优先收敛到 `service.ts` 或 shared normalizer
4. 页面尽量只消费已经清洗好的 view model

### 常见原因

- 数字 id 没有先转成字符串
- 后端字段名和脚手架默认字段不一致
- 列表响应和详情响应结构不同，但页面按同一种形状在用

## 脚手架生成的页面“差一点能用”

### 表现

- 文件已经生成且能编译，但页面仍然很泛化

### 每次生成后都要检查

1. 默认字段 `keyword`、`code`、`name`、`enabled`、`remark` 是否需要替换
2. 接口返回结构是否真的符合脚手架生成的 `Page<T>` 和 item 类型
3. 权限策略是否正确：
   - 小范围页面可继续用本地权限常量
   - 已有共享常量时优先切到 `SYSTEM_PERMISSION_CODES.<group>`
4. 后端菜单 `component` 是否已经补成 `<domain>/<feature>/index`
5. 成功提示、表单校验、标签文案、查询键是否已经换成真实业务语言

### 常见原因

- 把脚手架结果当成最终实现，而不是起点
- 后端接口形状和默认模板差异太大
- 页面从一开始就需要树选择器、关联标签或复杂选项数据

## 常用文件地图

- `src/router/page-loader.tsx`：页面发现与 `component` 键解析
- `src/router/AppRouter.tsx`：路由注册和动态路由加载流程
- `src/utils/menu.tsx`：菜单树到路由树的转换
- `src/store/auth.ts`：认证启动与当前用户加载
- `src/store/menu.ts`：菜单缓存和派生路由
- `src/hooks/usePermission.ts`：权限判断辅助
- `src/components/PermissionGuard.tsx`：按钮级权限渲染
- `src/shared/api/http.ts`：请求客户端和报错处理
- `src/utils/request.ts`：分页与查询参数辅助
