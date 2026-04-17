# 架构总览

## 技术栈

- React 19
- Vite
- TypeScript
- Ant Design 6 与 `@ant-design/pro-components`
- React Router 7
- TanStack Query
- Zustand
- Axios，统一封装在 `src/shared/api/http.ts`

## 仓库结构

- `src/pages/**`：页面模块，通常一个功能一个目录
- `src/pages/<domain>/<feature>/index.tsx`：页面入口组件
- `src/pages/<domain>/<feature>/service.ts`：页面接口层
- `src/pages/<domain>/<feature>/types.ts`：页面本地类型
- `src/pages/system/shared/*`：IAM 相关的共享 normalizer 和辅助逻辑
- `src/shared/api/http.ts`：axios 实例、鉴权头注入与统一报错
- `src/utils/request.ts`：分页、查询参数和请求辅助函数
- `src/router/page-loader.tsx`：按 `src/pages/**/index.tsx` 懒加载页面
- `src/router/AppRouter.tsx`：静态路由加后端菜单动态路由
- `src/utils/menu.tsx`：菜单树到路由树的转换和菜单辅助函数
- `src/store/auth.ts`：认证状态、用户信息与启动流程
- `src/store/menu.ts`：菜单缓存与派生路由
- `src/layouts/AppLayout.tsx`：ProLayout 外壳、菜单渲染和标签页管理

## 启动流程

1. 登录后 token 会写入本地存储。
2. `useAuthStore.bootstrap()` 会在登录后或刷新后拉取当前用户信息。
3. 当前用户响应里会包含用户信息、角色码、权限码和后端菜单树。
4. `useMenuStore.setTree()` 会把菜单树转换成 `AppRouteItem[]`。
5. `AppRouter` 会展开这些路由、跳过外链项、解析 `component` 键并注册动态路由。
6. `AppLayout` 再把路由转换成 ProLayout 菜单配置，并根据当前路由同步标签页。

## 服务与数据约定

- 接口调用优先使用 `src/shared/api/http.ts` 里的 `request<T>()`
- 有需要时复用 `compactParams`、`normalizePageRequest`、`mapPage` 等请求辅助方法
- 如果后端 DTO 形状不适合直接给页面使用，优先在服务层或 shared normalizer 里做转换
- 成功提示放在页面层，网络和传输层问题放在请求层处理

## 状态边界

- Zustand 负责应用级状态：认证、菜单、标签页、偏好设置
- TanStack Query 负责服务端数据缓存：列表、详情、选项数据
- 组件本地状态负责界面交互：弹窗开关、分页、查询表单、保存中状态

## 改动清单

- 新增或修改页面时，先确认目标是否落在 `src/pages/**`
- 新增或修改接口时，优先补到对应 `service.ts`
- 只在需要时扩展本地或 shared 类型
- 新增前端权限判断时，先决定是否补全局权限常量
- 新页面要可访问时，确认后端菜单 `component` 能对应到真实页面入口
- 改动结束后，执行与影响范围匹配的最小验证
