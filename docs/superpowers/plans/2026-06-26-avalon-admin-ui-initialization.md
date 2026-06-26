# Avalon Admin UI 初始化实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 初始化一个基于 React、Vite、Ant Design Pro 风格和 Avalon 后端 OpenAPI 的可运行管理端，并直接实现系统管理接口的可操作页面。

**架构：** 前端以 React Router + ProLayout 风格布局承载后端菜单，认证使用后端自定义 password grant，系统 API 通过 OpenAPI 生成类型后用 typed service 封装。页面统一走 React Query、ProTable、ModalForm 和 Drawer，权限体验来自 `/api/session`，最终授权仍由后端强制执行。

**技术栈：** npm、React 19、Vite 8、TypeScript、antd 6、`@ant-design/pro-components@3.1.12-0`、Tailwind CSS v4、React Router v7、TanStack Query、Zustand、openapi-fetch、openapi-typescript、Vitest、Testing Library、ESLint、Prettier、Husky、lint-staged。

**执行状态：** 已按当前工作区状态完成初始化、OpenAPI 同步、页面实现、文档、CI、Docker 和全量验证。原计划中的分步提交在本轮按一次前端初始化变更收口。

---

## 文件结构

创建和修改以下文件：

- `package.json`：精确依赖、脚本、lint-staged 配置。
- `index.html`：Vite HTML 入口。
- `vite.config.ts`：React、Tailwind、dev server、代理和测试配置。
- `tsconfig.json`、`tsconfig.app.json`、`tsconfig.node.json`、`tsconfig.test.json`：TypeScript 配置。
- `eslint.config.js`：ESLint flat config。
- `.prettierrc.json`、`.editorconfig`、`.gitignore`、`.npmrc`：工程约束。
- `.env.example`、`.env.development`、`.env.production`：前端环境变量。
- `src/main.tsx`：React 入口。
- `src/app/App.tsx`：应用根组件。
- `src/app/providers.tsx`：ConfigProvider、QueryClientProvider、BrowserRouter 等 provider。
- `src/app/router.tsx`：路由对象和受保护路由。
- `src/app/layout/AppLayout.tsx`：管理端布局和后端菜单渲染。
- `src/app/layout/menu.ts`：菜单转换和兜底菜单。
- `src/app/theme.ts`：antd 主题 token。
- `src/app/auth/AuthProvider.tsx`：认证状态、登录、登出、session 恢复。
- `src/app/auth/auth-storage.ts`：sessionStorage token 读写。
- `src/app/auth/ProtectedRoute.tsx`：认证和权限路由守卫。
- `src/services/generated/openapi.json`：从后端拉取的系统 OpenAPI 文档。
- `src/services/generated/schema.d.ts`：openapi-typescript 生成的类型。
- `src/services/client.ts`：openapi-fetch client、错误映射和 token 注入。
- `src/services/auth.ts`：password grant 登录和 session API。
- `src/services/system.ts`：系统管理资源 API 封装。
- `src/shared/api/page.ts`：Jimmer Page 到 ProTable 的分页适配。
- `src/shared/api/errors.ts`：错误类型和展示辅助。
- `src/shared/permissions.ts`：权限判断 helper。
- `src/shared/components/AccessDenied.tsx`：权限受限状态。
- `src/shared/components/EntityDrawer.tsx`：详情 Drawer。
- `src/shared/components/PageErrorState.tsx`：页面错误状态。
- `src/shared/components/StatusTag.tsx`：布尔和状态标签。
- `src/pages/auth/LoginPage.tsx`：password grant 登录页。
- `src/pages/dashboard/DashboardPage.tsx`：工作台。
- `src/pages/system/rbac/users/UsersPage.tsx`：用户管理。
- `src/pages/system/rbac/roles/RolesPage.tsx`：角色管理。
- `src/pages/system/rbac/access-nodes/AccessNodesPage.tsx`：访问节点。
- `src/pages/system/oauth/clients/OAuthClientsPage.tsx`：OAuth Client。
- `src/pages/system/oauth/jwks/JwksPage.tsx`：JWK。
- `src/pages/system/scheduler/tasks/ScheduledTasksPage.tsx`：定时任务。
- `src/pages/error/ForbiddenPage.tsx`、`src/pages/error/NotFoundPage.tsx`：错误页。
- `src/styles/global.css`：Tailwind v4 入口和基础样式。
- `src/test/setup.ts`：测试环境配置。
- `src/**/*.test.ts(x)`：认证、请求、权限、分页和页面渲染测试。
- `scripts/pull-openapi.mjs`：拉取 OpenAPI JSON。
- `.github/workflows/ci.yml`：CI。
- `Dockerfile`、`.dockerignore`、`docker/nginx.conf`：容器部署。
- `README.md`、`LICENSE`：项目文档和许可证。
- `AGENTS.md`、`.codex/skills/*/SKILL.md`：项目内 Agent 约束。
- `.husky/pre-commit`：pre-commit hook。

## 任务 1：工程骨架和依赖配置

**文件：**

- 创建：`package.json`
- 创建：`index.html`
- 创建：`vite.config.ts`
- 创建：`tsconfig.json`
- 创建：`tsconfig.app.json`
- 创建：`tsconfig.node.json`
- 创建：`tsconfig.test.json`
- 创建：`eslint.config.js`
- 创建：`.prettierrc.json`
- 创建：`.editorconfig`
- 创建：`.gitignore`
- 创建：`.npmrc`

- [x] **步骤 1：创建 package.json**

写入精确版本依赖、脚本和 lint-staged：

```json
{
  "name": "avalon-admin-ui",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "engines": {
    "node": "^20.19.0 || >=22.12.0",
    "npm": ">=10"
  },
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc --noEmit -p tsconfig.app.json && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --check .",
    "format:fix": "prettier --write .",
    "typecheck": "tsc --noEmit -p tsconfig.app.json",
    "test": "vitest run",
    "test:watch": "vitest",
    "openapi:pull": "node scripts/pull-openapi.mjs",
    "openapi:generate": "openapi-typescript src/services/generated/openapi.json -o src/services/generated/schema.d.ts",
    "openapi:sync": "npm run openapi:pull && npm run openapi:generate",
    "prepare": "husky"
  },
  "dependencies": {
    "@ant-design/icons": "6.2.5",
    "@ant-design/pro-components": "3.1.12-0",
    "@tanstack/react-query": "5.101.1",
    "antd": "6.4.5",
    "dayjs": "1.11.21",
    "openapi-fetch": "0.17.0",
    "react": "19.2.7",
    "react-dom": "19.2.7",
    "react-router-dom": "7.18.0",
    "zustand": "5.0.14"
  },
  "devDependencies": {
    "@eslint/js": "10.5.0",
    "@tailwindcss/vite": "4.3.1",
    "@testing-library/jest-dom": "6.9.1",
    "@testing-library/react": "16.3.2",
    "@testing-library/user-event": "14.6.1",
    "@types/node": "26.0.1",
    "@types/react": "19.2.17",
    "@types/react-dom": "19.2.3",
    "@vitejs/plugin-react": "6.0.3",
    "eslint": "10.5.0",
    "globals": "17.5.0",
    "husky": "9.1.7",
    "jsdom": "29.1.1",
    "lint-staged": "17.0.8",
    "openapi-typescript": "7.13.0",
    "prettier": "3.8.4",
    "tailwindcss": "4.3.1",
    "typescript": "6.0.3",
    "typescript-eslint": "8.62.0",
    "vite": "8.1.0",
    "vitest": "4.1.9"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css,html,yml,yaml}": ["prettier --write"]
  }
}
```

- [x] **步骤 2：创建 Vite 和 TypeScript 配置**

`vite.config.ts` 配置 React、Tailwind、端口、代理和 Vitest：

```ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:8080',
      '/oauth2': 'http://localhost:8080',
      '/v3': 'http://localhost:8080',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
```

`tsconfig.app.json` 使用 strict、React JSX 和路径别名。

- [x] **步骤 3：创建 ESLint、Prettier 和基础工程文件**

`eslint.config.js` 使用 `@eslint/js`、`typescript-eslint`、`globals`，覆盖 TS/TSX，并忽略 `dist`、`node_modules`、生成的 `openapi.json`。

- [x] **步骤 4：安装依赖**

运行：`npm install`

预期：生成 `package-lock.json`，无 peer dependency error。

- [x] **步骤 5：运行初始检查**

运行：`npm run typecheck`

预期：如果源码入口还没创建，出现缺失入口或无输入文件错误。该失败用于确认下一任务需要补齐源码入口。

- [x] **步骤 6：Commit**

```bash
git add package.json package-lock.json index.html vite.config.ts tsconfig*.json eslint.config.js .prettierrc.json .editorconfig .gitignore .npmrc
git commit -m "chore: configure frontend toolchain"
```

## 任务 2：环境变量、OpenAPI 拉取与生成

**文件：**

- 创建：`.env.example`
- 创建：`.env.development`
- 创建：`.env.production`
- 创建：`scripts/pull-openapi.mjs`
- 创建：`src/services/generated/openapi.json`
- 创建：`src/services/generated/schema.d.ts`

- [x] **步骤 1：创建环境变量文件**

`.env.example`：

```env
VITE_API_BASE_URL=/api
VITE_OAUTH_TOKEN_URL=/oauth2/token
VITE_OAUTH_CLIENT_ID=system-admin-jwt
VITE_OAUTH_CLIENT_SECRET=replace-in-production
VITE_OAUTH_SCOPE=security:admin
VITE_OPENAPI_URL=http://localhost:8080/v3/api-docs/system
```

`.env.development` 使用本地默认 client secret；`.env.production` 不写真实 secret。

- [x] **步骤 2：创建 OpenAPI 拉取脚本**

`scripts/pull-openapi.mjs`：

```js
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const url = process.env.VITE_OPENAPI_URL ?? 'http://localhost:8080/v3/api-docs/system';
const outputPath = resolve('src/services/generated/openapi.json');

const response = await fetch(url);
if (!response.ok) {
  throw new Error(`Failed to pull OpenAPI document: ${response.status} ${response.statusText}`);
}

const text = await response.text();
JSON.parse(text);
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${text}\n`, 'utf8');
console.log(`OpenAPI document written to ${outputPath}`);
```

- [x] **步骤 3：拉取并生成 OpenAPI 类型**

运行：`npm run openapi:sync`

预期：生成 `src/services/generated/openapi.json` 和 `schema.d.ts`。

- [x] **步骤 4：Commit**

```bash
git add .env.example .env.development .env.production scripts/pull-openapi.mjs src/services/generated/openapi.json src/services/generated/schema.d.ts
git commit -m "chore: add openapi contract generation"
```

## 任务 3：测试环境和基础入口

**文件：**

- 创建：`src/test/setup.ts`
- 创建：`src/styles/global.css`
- 创建：`src/main.tsx`
- 创建：`src/app/App.tsx`
- 创建：`src/app/providers.tsx`
- 创建：`src/app/theme.ts`
- 测试：`src/app/App.test.tsx`

- [x] **步骤 1：编写失败的根组件测试**

`src/app/App.test.tsx`：

```tsx
import { render, screen } from '@testing-library/react';
import { App } from './App';

it('renders avalon admin shell', () => {
  render(<App />);
  expect(screen.getByText('Avalon Admin')).toBeInTheDocument();
});
```

- [x] **步骤 2：运行测试验证失败**

运行：`npm test -- src/app/App.test.tsx`

预期：FAIL，提示 `Cannot find module './App'` 或缺少测试 setup。

- [x] **步骤 3：创建测试 setup 和基础入口**

`src/test/setup.ts`：

```ts
import '@testing-library/jest-dom/vitest';
```

`src/app/App.tsx`：

```tsx
export function App() {
  return <div>Avalon Admin</div>;
}
```

`src/main.tsx` 挂载 `App`，`src/styles/global.css` 引入 `@import "tailwindcss";`。

- [x] **步骤 4：运行测试验证通过**

运行：`npm test -- src/app/App.test.tsx`

预期：PASS。

- [x] **步骤 5：Commit**

```bash
git add src index.html
git commit -m "chore: add react application entry"
```

## 任务 4：认证存储和 password grant

**文件：**

- 创建：`src/app/auth/auth-storage.ts`
- 创建：`src/services/auth.ts`
- 测试：`src/app/auth/auth-storage.test.ts`
- 测试：`src/services/auth.test.ts`

- [x] **步骤 1：编写 token 存储失败测试**

测试 `saveAccessToken`、`readAccessToken`、`clearAccessToken` 使用 `sessionStorage`。

- [x] **步骤 2：实现 token 存储**

`auth-storage.ts` 导出：

```ts
export const ACCESS_TOKEN_KEY = 'avalon_admin_access_token';
export function readAccessToken(): string | null;
export function saveAccessToken(token: string): void;
export function clearAccessToken(): void;
```

每个函数写中文注释说明为什么使用 `sessionStorage`。

- [x] **步骤 3：编写 password grant 请求测试**

mock `fetch`，断言请求：

- URL 为 `/oauth2/token`
- method 为 `POST`
- `Authorization` 为 Basic
- body 包含 grant_type、username、password、scope

- [x] **步骤 4：实现 loginWithPassword**

`src/services/auth.ts` 导出：

```ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
}

export async function loginWithPassword(input: LoginRequest): Promise<TokenResponse>;
```

失败时抛出统一错误，成功时返回 token response。

- [x] **步骤 5：运行测试**

运行：`npm test -- src/app/auth/auth-storage.test.ts src/services/auth.test.ts`

预期：PASS。

- [x] **步骤 6：Commit**

```bash
git add src/app/auth src/services/auth.ts
git commit -m "feat: add password grant authentication service"
```

## 任务 5：OpenAPI client、错误和分页适配

**文件：**

- 创建：`src/shared/api/errors.ts`
- 创建：`src/shared/api/page.ts`
- 创建：`src/services/client.ts`
- 测试：`src/shared/api/page.test.ts`
- 测试：`src/shared/api/errors.test.ts`
- 测试：`src/services/client.test.ts`

- [x] **步骤 1：编写分页适配测试**

输入 `{ rows: [{ id: 1 }], totalRowCount: 1 }`，期望 `{ data: [{ id: 1 }], success: true, total: 1 }`。

- [x] **步骤 2：实现 Page 适配**

导出 `toProTableResult`、`toBackendPage`，注释说明前端 1-based 和后端 0-based 的转换。

- [x] **步骤 3：编写错误映射测试**

输入 `{ code: 'validation.required', message: '用户名不能为空', field: 'username' }`，期望 `ApiError` 保留三个字段。

- [x] **步骤 4：实现 ApiError 和 normalizeApiError**

`errors.ts` 定义 `ApiErrorPayload`、`ApiError`、`normalizeApiError`。

- [x] **步骤 5：编写 client token 注入测试**

mock openapi-fetch 或 fetch，确认 `Authorization: Bearer <token>` 被注入。

- [x] **步骤 6：实现 typed client**

`client.ts` 使用生成的 `paths` 类型和 `openapi-fetch` 创建 client，并集中读取 token。

- [x] **步骤 7：运行测试并提交**

运行：`npm test -- src/shared/api src/services/client.test.ts`

预期：PASS。

Commit：`feat: add typed api client utilities`

## 任务 6：认证上下文、session 和路由守卫

**文件：**

- 创建：`src/app/auth/AuthProvider.tsx`
- 创建：`src/app/auth/ProtectedRoute.tsx`
- 创建：`src/shared/permissions.ts`
- 修改：`src/services/auth.ts`
- 测试：`src/app/auth/AuthProvider.test.tsx`
- 测试：`src/shared/permissions.test.ts`

- [x] **步骤 1：编写权限判断测试**

断言 `hasAccess(['system.rbac.users'], 'system.rbac.users')` 为 true；空权限为 false。

- [x] **步骤 2：实现权限 helper**

导出 `hasAccess`、`hasAnyAccess`、`hasAllAccess`。

- [x] **步骤 3：编写 session 加载测试**

mock `/api/session` 成功返回 user、roles、accessNodeCodes、menus，断言 AuthProvider 更新状态。

- [x] **步骤 4：实现 AuthProvider**

包含：

- `login(username, password)`
- `logout()`
- `reloadSession()`
- `status: 'anonymous' | 'loading' | 'authenticated'`
- 当前 session 数据

代码注释解释 token 恢复和 401 清理。

- [x] **步骤 5：实现 ProtectedRoute**

未登录跳转 `/login`，缺权限显示 403。

- [x] **步骤 6：运行测试并提交**

运行：`npm test -- src/app/auth src/shared/permissions.test.ts`

预期：PASS。

Commit：`feat: add auth context and route guards`

## 任务 7：布局、菜单和路由

**文件：**

- 创建：`src/app/router.tsx`
- 创建：`src/app/layout/AppLayout.tsx`
- 创建：`src/app/layout/menu.ts`
- 创建：`src/pages/error/ForbiddenPage.tsx`
- 创建：`src/pages/error/NotFoundPage.tsx`
- 修改：`src/app/App.tsx`
- 测试：`src/app/layout/menu.test.ts`
- 测试：`src/app/router.test.tsx`

- [x] **步骤 1：查询 antd / ProComponents API**

运行：

```bash
antd info Menu --format json
antd info Drawer --format json
antd info Button --format json
```

预期：均返回 JSON。

- [x] **步骤 2：编写菜单转换测试**

输入后端 menu node，输出 ProLayout/Menu 可用的 path、name、children。

- [x] **步骤 3：实现 menu.ts**

包含后端菜单转换、兜底菜单、`componentKey` 到 path 映射。

- [x] **步骤 4：实现 AppLayout**

使用 ProLayout 风格组件和 antd Dropdown/Button，显示用户和退出登录。

- [x] **步骤 5：实现路由对象**

包括 `/login`、`/`、系统页面路径、403、404。

- [x] **步骤 6：运行 lint 和测试**

运行：`npm test -- src/app/layout/menu.test.ts src/app/router.test.tsx`

运行：`antd lint src/app src/pages/error --format json`

预期：PASS，无 antd lint blocker。

- [x] **步骤 7：Commit**

```bash
git add src/app src/pages/error
git commit -m "feat: add application layout and routing"
```

## 任务 8：登录页和工作台

**文件：**

- 创建：`src/pages/auth/LoginPage.tsx`
- 创建：`src/pages/dashboard/DashboardPage.tsx`
- 测试：`src/pages/auth/LoginPage.test.tsx`
- 测试：`src/pages/dashboard/DashboardPage.test.tsx`

- [x] **步骤 1：查询 ProForm 和 Card API**

运行：

```bash
antd info Card --format json
antd info Alert --format json
```

同时使用 ProComponents 文档/API 以现有类型为准，不猜 `LoginForm` API；若不确定，使用 antd `Form` + `Input.Password` 实现登录。

- [x] **步骤 2：编写登录页测试**

断言用户名、密码输入和登录按钮存在；提交时调用 auth login。

- [x] **步骤 3：实现 LoginPage**

使用紧凑后台登录布局，不做营销 hero。代码注释说明 password grant 表单和错误展示。

- [x] **步骤 4：编写工作台测试**

传入 session，断言显示用户、角色数量、权限数量和快捷入口。

- [x] **步骤 5：实现 DashboardPage**

使用 antd Statistic/Card 和 Tailwind 布局展示状态。

- [x] **步骤 6：运行测试、antd lint 并提交**

运行：

```bash
npm test -- src/pages/auth src/pages/dashboard
antd lint src/pages/auth src/pages/dashboard --format json
```

Commit：`feat: add login and dashboard pages`

## 任务 9：系统 service 封装

**文件：**

- 创建：`src/services/system.ts`
- 测试：`src/services/system.test.ts`

- [x] **步骤 1：编写 service 路径测试**

mock typed client，断言用户列表调用 `GET /api/system/rbac/users`，角色列表调用 `GET /api/system/rbac/roles`。

- [x] **步骤 2：实现系统资源函数**

导出对象：

- `usersApi`
- `rolesApi`
- `accessNodesApi`
- `oauthClientsApi`
- `jwksApi`
- `scheduledTasksApi`

每个函数用生成类型约束请求和响应。

- [x] **步骤 3：运行测试并提交**

运行：`npm test -- src/services/system.test.ts`

预期：PASS。

Commit：`feat: add system management api services`

## 任务 10：共享页面组件

**文件：**

- 创建：`src/shared/components/AccessDenied.tsx`
- 创建：`src/shared/components/EntityDrawer.tsx`
- 创建：`src/shared/components/PageErrorState.tsx`
- 创建：`src/shared/components/StatusTag.tsx`
- 创建：`src/shared/components/JsonPreview.tsx`
- 测试：`src/shared/components/*.test.tsx`

- [x] **步骤 1：查询组件 API**

运行：

```bash
antd info Result --format json
antd info Tag --format json
antd info Descriptions --format json
antd info Typography --format json
```

- [x] **步骤 2：编写组件渲染测试**

分别断言访问受限、错误状态、状态标签和 JSON 预览可渲染。

- [x] **步骤 3：实现共享组件**

组件带中文注释说明复用边界，避免每个页面重复状态 UI。

- [x] **步骤 4：运行测试、antd lint 并提交**

运行：

```bash
npm test -- src/shared/components
antd lint src/shared/components --format json
```

Commit：`feat: add shared admin page components`

## 任务 11：RBAC 页面

**文件：**

- 创建：`src/pages/system/rbac/users/UsersPage.tsx`
- 创建：`src/pages/system/rbac/roles/RolesPage.tsx`
- 创建：`src/pages/system/rbac/access-nodes/AccessNodesPage.tsx`
- 测试：`src/pages/system/rbac/users/UsersPage.test.tsx`
- 测试：`src/pages/system/rbac/roles/RolesPage.test.tsx`
- 测试：`src/pages/system/rbac/access-nodes/AccessNodesPage.test.tsx`

- [x] **步骤 1：查询 ProTable、Modal、Popconfirm API**

运行：

```bash
antd info Table --format json
antd info Modal --format json
antd info Popconfirm --format json
antd info Select --format json
```

使用 ProComponents 类型补全确认 `ProTable`、`ModalForm`、`ProFormSelect` 的用法。

- [x] **步骤 2：编写用户页基础测试**

mock `usersApi.list`、`rolesApi.list`，断言页面标题、创建按钮、搜索表格存在。

- [x] **步骤 3：实现 UsersPage**

能力：列表、搜索、角色/启用/锁定筛选、创建、详情、启用/禁用、锁定/解锁、重置密码、更新角色。

- [x] **步骤 4：编写角色页测试**

mock `rolesApi.list`、`accessNodesApi.list`，断言创建和编辑入口存在。

- [x] **步骤 5：实现 RolesPage**

能力：列表、搜索、按访问节点筛选、创建、编辑、详情。

- [x] **步骤 6：编写访问节点页测试**

mock `accessNodesApi.list`，断言 type、visible、enabled 筛选存在。

- [x] **步骤 7：实现 AccessNodesPage**

能力：列表、搜索、筛选、详情。

- [x] **步骤 8：运行测试、antd lint 并提交**

运行：

```bash
npm test -- src/pages/system/rbac
antd lint src/pages/system/rbac --format json
```

Commit：`feat: add rbac management pages`

## 任务 12：OAuth 和 JWK 页面

**文件：**

- 创建：`src/pages/system/oauth/clients/OAuthClientsPage.tsx`
- 创建：`src/pages/system/oauth/jwks/JwksPage.tsx`
- 测试：`src/pages/system/oauth/clients/OAuthClientsPage.test.tsx`
- 测试：`src/pages/system/oauth/jwks/JwksPage.test.tsx`

- [x] **步骤 1：编写 OAuth Client 页面测试**

mock list/create/update/resetSecret，断言创建、编辑、重置 secret 操作存在。

- [x] **步骤 2：实现 OAuthClientsPage**

能力：列表、搜索、创建、编辑、重置 secret、详情。scopes 固定选择 `security:admin`，accessTokenFormat 支持 `self-contained` 和 `reference`。

- [x] **步骤 3：编写 JWK 页面测试**

mock list/rotate，断言轮换按钮和 active 状态显示。

- [x] **步骤 4：实现 JwksPage**

能力：列表、搜索、详情、轮换 JWK。轮换操作用 Popconfirm。

- [x] **步骤 5：运行测试、antd lint 并提交**

运行：

```bash
npm test -- src/pages/system/oauth
antd lint src/pages/system/oauth --format json
```

Commit：`feat: add oauth and jwk management pages`

## 任务 13：定时任务页面

**文件：**

- 创建：`src/pages/system/scheduler/tasks/ScheduledTasksPage.tsx`
- 测试：`src/pages/system/scheduler/tasks/ScheduledTasksPage.test.tsx`

- [x] **步骤 1：编写定时任务页测试**

mock list/create/update/trigger/enable/disable/delete/executions，断言创建、触发、执行记录入口存在。

- [x] **步骤 2：实现 ScheduledTasksPage**

能力：列表、搜索、创建、编辑、启用/禁用、触发、删除、详情、执行记录 Drawer。payload 使用 JSON 文本输入并在提交前解析。

- [x] **步骤 3：运行测试、antd lint 并提交**

运行：

```bash
npm test -- src/pages/system/scheduler
antd lint src/pages/system/scheduler --format json
```

Commit：`feat: add scheduled task management page`

## 任务 14：文档、项目技能、CI 和 Docker

**文件：**

- 创建：`README.md`
- 创建：`LICENSE`
- 创建：`AGENTS.md`
- 创建：`.codex/skills/react-antd/SKILL.md`
- 创建：`.codex/skills/api-auth/SKILL.md`
- 创建：`.codex/skills/source-comments/SKILL.md`
- 创建：`.codex/skills/commit/SKILL.md`
- 创建：`.github/workflows/ci.yml`
- 创建：`Dockerfile`
- 创建：`.dockerignore`
- 创建：`docker/nginx.conf`

- [x] **步骤 1：创建 README 和 LICENSE**

README 包含技术栈、环境要求、开发命令、OpenAPI 同步、登录配置、联调地址、验证命令。LICENSE 使用 AGPL-3.0。

- [x] **步骤 2：创建项目内 Agent 技能**

AGENTS 和技能文件写明：中文沟通、代码注释要求、Ant Design API 查询、OpenAPI typed client、password grant、权限模型、验证命令。

- [x] **步骤 3：创建 CI**

`.github/workflows/ci.yml` 执行：

```yaml
name: CI
on:
  push:
  pull_request:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

- [x] **步骤 4：创建 Dockerfile 和 Nginx 配置**

Node builder 执行 `npm ci && npm run build`，Nginx stage 托管 `dist` 并 fallback 到 `index.html`。

- [x] **步骤 5：Commit**

```bash
git add README.md LICENSE AGENTS.md .codex .github Dockerfile .dockerignore docker
git commit -m "chore: add docs ci docker and agent guides"
```

## 任务 15：Husky、全量验证和初始化提交整理

**文件：**

- 创建：`.husky/pre-commit`
- 修改：`package.json`

- [x] **步骤 1：初始化 Husky**

运行：`npm run prepare`

创建 `.husky/pre-commit`：

```sh
npx lint-staged
```

- [x] **步骤 2：格式化**

运行：`npm run format:fix`

预期：格式化所有源文件。

- [x] **步骤 3：全量验证**

运行：

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

预期：全部 PASS。

- [x] **步骤 4：浏览器手工冒烟**

运行：`npm run dev`

访问 `http://localhost:5173`，确认：

- 登录页显示。
- 使用后端可用账号和 password grant 配置可登录。
- 登录后加载菜单和工作台。
- 系统页面至少能发起列表请求。

- [x] **步骤 5：Commit**

```bash
git add .
git commit -m "chore: initialize avalon admin ui"
```

## 自检

- 规格覆盖：计划覆盖工程骨架、OpenAPI、认证、请求层、路由、菜单、所有系统管理页面、测试、CI、Docker、Husky、README、LICENSE 和项目技能。
- 占位符扫描：计划没有使用待定或 TODO；每个任务包含文件、步骤、命令和预期。
- 类型一致性：认证、session、权限、OpenAPI client、Page 适配和页面 service 在前置任务定义，后续任务复用同一命名。
- 范围检查：任务较多但都属于同一个可运行管理端初始化目标，按资源边界拆分，可逐步提交。
