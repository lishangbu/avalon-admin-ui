# 菜单与路由

## 核心思路

这个项目的主导航是后端驱动的。后端会在认证启动阶段返回菜单树，前端再把它转换成：

- 动态路由
- ProLayout 菜单
- 标签页元数据

## 关键文件

- `src/store/auth.ts`
- `src/store/menu.ts`
- `src/types/menu.ts`
- `src/utils/menu.tsx`
- `src/router/page-loader.tsx`
- `src/router/AppRouter.tsx`
- `src/layouts/AppLayout.tsx`

## 动态路由是怎么生成的

1. 当前用户响应里包含 `menuTree`
2. shared normalizer 会把后端菜单记录转换成 `MenuTreeNode[]`
3. `transformMenuTree()` 会把菜单树转换成 `AppRouteItem[]`
4. `AppRouter` 会把这些路由拍平并构造成 React Router 路由对象
5. 只要某个节点不是外链且有 `component`，就会通过 `resolvePageComponent()` 去解析页面组件

## `component` 键契约

`src/router/page-loader.tsx` 只会收集 `src/pages/**/index.tsx`，并把它规范成下面这种键：

- `auth/login/index`
- `dashboard/home/index`
- `system/user/index`
- `dataset/berry/index`

因此，后端菜单里的 `component` 必须精确匹配这样的键。如果匹配不到，最终会回退到 404 页面。

## 路径拼接规则

- 子菜单 `path` 如果不是绝对路径，就会和父路径拼接
- `disabled=true` 和 `type=button` 的节点不会生成正常路由
- 只有重定向的节点会被转成 `<Navigate />`
- 外链项仍会出现在菜单里，但不会生成普通页面路由

## 关键菜单元数据

- `hidden`：是否在菜单中隐藏
- `hideChildrenInMenu`：是否在菜单里收起子节点显示
- `flatMenu`：是否在 ProLayout 中扁平展示
- `activeMenu`：详情页等场景下高亮另一个菜单项
- `external`：是否按外链处理
- `target`：外链打开方式
- `showTab`、`enableMultiTab`：标签页行为

## 新增页面时的检查顺序

1. 创建 `src/pages/<domain>/<feature>/index.tsx`
2. 页面需要接口或本地类型时，再补 `service.ts` 和 `types.ts`
3. 确认后端菜单 `component` 指向 `<domain>/<feature>/index`
4. 确认菜单 `path` 在父子拼接后能得到预期 URL
5. 验证页面是否同时能被菜单展示并被路由正常解析

## 修改菜单行为时的原则

- 菜单数据结构新增字段时，优先一起更新 `MenuView`、`AppRouteMeta` 和 `transformMenuTree()`
- 布局行为优先通过路由元数据驱动，不要单独再造 layout-only 开关
- 如果后端菜单契约变了，先修 normalizer，再修路由转换层

## 常见故障

- 后端 `component` 和页面入口键不一致
- 子路径被错误拼接，最终 URL 和预期不一致
- 后端新增了元数据字段，但前端没有映射进 `AppRouteMeta`
- 外链项被当作普通页面去处理
